const db = require('../config/database');

/**
 * 동영상 요약 관련 데이터베이스 작업을 처리하는 Model 클래스
 */
class VideoSummary {
  /**
   * 요약 텍스트를 포맷팅합니다.
   * @private
   * @param {string} text - 원본 요약 텍스트
   * @returns {string} 포맷팅된 요약 텍스트
   */
  static formatSummaryText(text) {
    // 이미 포맷팅된 텍스트인지 확인
    if (text.startsWith('📝 요약') || text.startsWith('🔑 주요 키워드')) {
      return text;
    }

    // 볼드 처리된 텍스트를 추출하여 키워드로 변환
    const boldTexts = text.match(/\*\*(.*?)\*\*/g) || [];
    const cleanBoldTexts = boldTexts
      .map(t => t.replace(/\*\*/g, ''))
      .filter(t => t.length >= 2);  // 2글자 이상만 키워드로 선정

    // 키워드 섹션 생성
    const keywordsSection = cleanBoldTexts.length > 0 
      ? `🔑 주요 키워드\n${cleanBoldTexts.map(k => `#${k}`).join('  ')}\n\n` 
      : '';

    // 본문 텍스트 정리
    const mainText = this.formatMainText(text);
    const formattedParagraphs = this.formatParagraphs(mainText);

    // 최종 포맷팅
    return this.assembleFinalText(keywordsSection, formattedParagraphs);
  }

  /**
   * 본문 텍스트를 정리합니다.
   * @private
   * @param {string} text - 원본 텍스트
   * @returns {string} 정리된 텍스트
   */
  static formatMainText(text) {
    return text
      .replace(/\*\*/g, '')  // 볼드 마크다운 제거
      .replace(/\n\s*\n/g, '\n')  // 빈 줄 정리
      .trim();
  }

  /**
   * 단락을 포맷팅합니다.
   * @private
   * @param {string} text - 정리된 텍스트
   * @returns {string} 포맷팅된 단락
   */
  static formatParagraphs(text) {
    const sentences = text.split(/(?<=\. )/g);
    const paragraphs = [];
    let currentParagraph = [];

    sentences.forEach(sentence => {
      currentParagraph.push(sentence.trim());
      if (currentParagraph.length >= 2 || sentence.endsWith('.')) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
    });

    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }

    return paragraphs
      .map((p, i) => `  ${i === 0 ? '💡' : '•'} ${p}`)
      .join('\n\n');
  }

  /**
   * 최종 텍스트를 조립합니다.
   * @private
   * @param {string} keywordsSection - 키워드 섹션
   * @param {string} formattedParagraphs - 포맷팅된 단락
   * @returns {string} 최종 포맷팅된 텍스트
   */
  static assembleFinalText(keywordsSection, formattedParagraphs) {
    const summaryTitle = '📝 요약';
    const separator = '━━━━━━━━━━━━━━━';
    return `${summaryTitle}\n${separator}\n\n${keywordsSection}${formattedParagraphs}`;
  }

  /**
   * 새로운 요약을 생성합니다.
   * @param {string} videoId - 동영상 ID
   * @param {string} summary - 요약 텍스트
   * @param {number} userId - 사용자 ID
   * @returns {Promise<number>} 생성된 요약의 ID
   */
  static async create(videoId, summary, userId) {
    try {
      const formattedSummary = this.formatSummaryText(summary);
      const [result] = await db.query(
        `INSERT INTO video_summaries 
        (video_id, summary_text, user_id) 
        VALUES (?, ?, ?)`,
        [videoId, formattedSummary, userId]
      );
      return result.insertId;
    } catch (error) {
      console.error('요약 저장 에러:', error);
      throw error;
    }
  }

  /**
   * 동영상 ID로 요약을 조회합니다.
   * @param {string} videoId - 동영상 ID
   * @returns {Promise<Object|null>} 요약 정보
   */
  static async findByVideoId(videoId) {
    try {
      const [rows] = await db.query(
        `SELECT vs.*, u.username as creator_name 
        FROM video_summaries vs
        LEFT JOIN users u ON vs.user_id = u.id
        WHERE vs.video_id = ?`,
        [videoId]
      );

      if (rows[0]) {
        rows[0].summary_text = this.formatSummaryText(rows[0].summary_text);
      }

      return rows[0];
    } catch (error) {
      console.error('요약 조회 에러:', error);
      throw error;
    }
  }

  /**
   * 최근 요약 목록을 조회합니다.
   * @param {number} limit - 조회할 개수
   * @returns {Promise<Array>} 요약 목록
   */
  static async getRecentSummaries(limit = 10) {
    try {
      const [rows] = await db.query(
        `SELECT vs.*, u.username as creator_name 
        FROM video_summaries vs
        LEFT JOIN users u ON vs.user_id = u.id
        ORDER BY vs.created_at DESC
        LIMIT ?`,
        [limit]
      );

      return rows.map(row => ({
        ...row,
        summary_text: this.formatSummaryText(row.summary_text)
      }));
    } catch (error) {
      console.error('최근 요약 조회 에러:', error);
      throw error;
    }
  }

  /**
   * 모든 요약의 포맷을 업데이트합니다.
   * @returns {Promise<boolean>} 업데이트 성공 여부
   */
  static async updateAllSummaryFormats() {
    try {
      const [rows] = await db.query('SELECT * FROM video_summaries');
      
      for (const row of rows) {
        const formattedSummary = this.formatSummaryText(row.summary_text);
        await db.query(
          'UPDATE video_summaries SET summary_text = ? WHERE id = ?',
          [formattedSummary, row.id]
        );
      }
      
      return true;
    } catch (error) {
      console.error('요약 포맷 업데이트 에러:', error);
      throw error;
    }
  }
}

module.exports = VideoSummary; 
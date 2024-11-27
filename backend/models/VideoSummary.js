const db = require('../config/database');

class VideoSummary {
    static formatSummaryText(text) {
        // 이미 포맷팅된 텍스트인지 확인
        if (text.startsWith('📝 요약') || text.startsWith('🔑 주요 키워드')) {
            return text;
        }

        // 볼드 처리된 텍스트를 분리하고 정리
        const boldTexts = text.match(/\*\*(.*?)\*\*/g) || [];
        const cleanBoldTexts = boldTexts
            .map(t => t.replace(/\*\*/g, ''))
            .filter(t => t.length >= 2);  // 2글자 이상만 키워드로 선정

        // 주요 키워드 섹션 생성
        const keywordsSection = cleanBoldTexts.length > 0 
            ? `🔑 주요 키워드\n${cleanBoldTexts.map(k => `#${k}`).join('  ')}\n\n` 
            : '';

        // 본문 텍스트 정리
        let mainText = text
            .replace(/\*\*/g, '')  // 볼드 마크다운 제거
            .replace(/\n\s*\n/g, '\n')  // 빈 줄 정리
            .trim();

        // 문장 단위로 분리하고 정리
        const sentences = mainText.split(/(?<=\. )/g);
        const paragraphs = [];
        let currentParagraph = [];

        sentences.forEach(sentence => {
            currentParagraph.push(sentence.trim());
            
            // 2-3문장마다 또는 마침표로 끝나는 경우 단락 구분
            if (currentParagraph.length >= 2 || sentence.endsWith('.')) {
                paragraphs.push(currentParagraph.join(' '));
                currentParagraph = [];
            }
        });

        // 남은 문장이 있다면 마지막 단락에 추가
        if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(' '));
        }

        // 단락에 들여쓰기와 이모지 추가
        const formattedParagraphs = paragraphs
            .map((p, i) => `  ${i === 0 ? '💡' : '•'} ${p}`)
            .join('\n\n');

        // 최종 포맷팅된 텍스트
        const summaryTitle = '📝 요약';
        const separator = '━━━━━━━━━━━━━━━';

        return `${summaryTitle}\n${separator}\n\n${keywordsSection}${formattedParagraphs}`;
    }

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
                // 저장된 요약 텍스트에 포맷팅 적용
                rows[0].summary_text = this.formatSummaryText(rows[0].summary_text);
            }

            return rows[0];
        } catch (error) {
            console.error('요약 조회 에러:', error);
            throw error;
        }
    }

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

            // 각 요약 텍스트에 포맷팅 적용
            return rows.map(row => ({
                ...row,
                summary_text: this.formatSummaryText(row.summary_text)
            }));
        } catch (error) {
            console.error('최근 요약 조회 에러:', error);
            throw error;
        }
    }

    // 기존 요약 텍스트 포맷팅 업데이트
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
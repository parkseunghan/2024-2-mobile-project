const db = require('../config/database');

class VideoSummary {
    static formatSummaryText(text) {
        // 볼드 처리된 텍스트를 분리
        const boldTexts = text.match(/\*\*(.*?)\*\*/g) || [];
        const cleanBoldTexts = boldTexts.map(t => t.replace(/\*\*/g, ''));

        // 주요 키워드 섹션 생성
        const keywordsSection = cleanBoldTexts.length > 0 
            ? `🔑 주요 키워드\n${cleanBoldTexts.join(' • ')}\n\n` 
            : '';

        // 본문 텍스트 정리
        let mainText = text
            .replace(/\*\*/g, '') // 볼드 마크다운 제거
            .trim();

        // 문단 나누기 및 들여쓰기 추가
        const paragraphs = mainText.split(/(?<=\. )/g);
        mainText = paragraphs
            .map(p => `  ${p.trim()}`)
            .join('\n');

        // 최종 포맷팅된 텍스트
        return `📝 요약\n${keywordsSection}${mainText}`;
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
            return rows;
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
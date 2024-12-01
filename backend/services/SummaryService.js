const NodeCache = require('node-cache');
const YoutubeService = require('./YoutubeService');
const VideoSummary = require('../models/VideoSummary');
const axios = require('axios');

class SummaryService {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 3600 });
        this.validateApiKey();
        this.lilysClient = axios.create({
            baseURL: 'https://tool.lilys.ai',
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.LILYS_API_KEY}`
            }
        });
        this.SYSTEM_USER_ID = 1;
    }

    validateApiKey() {
        const apiKey = process.env.LILYS_API_KEY;
        if (!apiKey) {
            console.warn('LILYS_API_KEY가 설정되지 않았습니다.');
            return;  // 키 검증 실패해도 계속 진행
        }
    }

    async getSummary(videoId) {
        try {
            // 캐시 확인
            const cacheKey = `summary:${videoId}`;
            const cachedSummary = this.cache.get(cacheKey);
            if (cachedSummary) {
                return cachedSummary;
            }

            // DB에서 조회
            const summary = await VideoSummary.findByVideoId(videoId);
            if (summary) {
                this.cache.set(cacheKey, summary);
                return summary;
            }

            return null;
        } catch (error) {
            console.error('요약 조회 에러:', error);
            throw error;
        }
    }

    async createSummary(videoId, user) {
        try {
            // 기존 요약 확인
            const existingSummary = await this.getSummary(videoId);
            if (existingSummary) {
                return {
                    content: existingSummary.summary_text,
                    creator: existingSummary.creator_name || 'AI',
                    fromCache: true
                };
            }

            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            // Lilys AI에 요약 요청
            const response = await this.lilysClient.post('/summaries', {
                source: {
                    sourceType: "youtube_video",
                    sourceUrl: videoUrl
                },
                resultLanguage: "ko",
                modelType: "gpt-4"
            });

            if (!response.data.requestId) {
                throw new Error('요약 요청 ID를 받지 못했습니다.');
            }

            // 요약 결과 대기 및 가져오기
            let summary = await this.waitForSummaryResult(response.data.requestId);

            // DB 저장 (user가 있는 경우에만 해당 user의 ID 사용)
            const userId = user?.id || this.SYSTEM_USER_ID;
            const creatorName = user?.username || 'AI';
            await VideoSummary.create(videoId, summary, userId);

            const summaryData = {
                summary_text: summary,
                creator_name: creatorName,
                created_at: new Date()
            };
            
            this.cache.set(`summary:${videoId}`, summaryData);

            return {
                content: summary,
                creator: creatorName,
                fromCache: false
            };
        } catch (error) {
            console.error('요약 생성 중 에러:', error);
            throw new Error('요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    async waitForSummaryResult(requestId) {
        let retries = 0;
        const maxRetries = 10;
        const initialDelay = 3000;

        while (retries < maxRetries) {
            try {
                const response = await this.lilysClient.get(
                    `/summaries/${requestId}?resultType=shortSummary`,
                    { timeout: 10000 }
                );

                if (response.data.status === 'done' && 
                    response.data.data?.type === 'shortSummary') {
                    return response.data.data.data.summary;
                }

                if (response.data.status === 'error') {
                    throw new Error('요약 생성에 실패했습니다.');
                }

                retries++;
                await new Promise(resolve => 
                    setTimeout(resolve, initialDelay * Math.pow(1.5, retries))
                );
            } catch (error) {
                retries++;
                if (retries === maxRetries) throw error;
                await new Promise(resolve => 
                    setTimeout(resolve, initialDelay * Math.pow(1.5, retries))
                );
            }
        }
        throw new Error('요약 생성 시간이 초과되었습니다.');
    }

    async getRecentSummaries(limit = 10) {
        try {
            return await VideoSummary.getRecentSummaries(limit);
        } catch (error) {
            console.error('최근 요약 조회 에러:', error);
            throw error;
        }
    }
}

module.exports = new SummaryService(); 
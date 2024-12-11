const NodeCache = require('node-cache'); // 캐시 관리를 위한 node-cache 모듈을 불러옴.
const YoutubeService = require('./YoutubeService'); // YouTube 서비스 모듈을 불러옴.
const VideoSummary = require('../models/VideoSummary'); // 비디오 요약 모델을 불러옴.
const axios = require('axios'); // axios 모듈을 불러옴.

/**
 * 비디오 요약 관련 기능을 처리하는 Service 클래스
 */
class SummaryService {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시 설정
        this.validateApiKey(); // API 키 검증
        this.lilysClient = axios.create({
            baseURL: 'https://tool.lilys.ai', // Lilys AI API 기본 URL
            timeout: 60000, // 요청 타임아웃 설정
            headers: {
                'Content-Type': 'application/json', // 요청 시 헤더 설정
                'Authorization': `Bearer ${process.env.LILYS_API_KEY}` // API 키를 Authorization 헤더에 설정
            }
        });
        this.SYSTEM_USER_ID = 1; // 기본 사용자 ID 설정
    }

    /**
     * Lilys API 키가 설정되었는지 확인합니다.
     */
    validateApiKey() {
        const apiKey = process.env.LILYS_API_KEY; // 환경 변수에서 API 키 가져오기
        if (!apiKey) {
            console.warn('LILYS_API_KEY가 설정되지 않았습니다.'); // API 키가 없을 경우 경고 메시지 출력
            return;  // 키 검증 실패해도 계속 진행
        }
    }

    /**
     * 비디오 요약을 가져옵니다.
     * @param {string} videoId - 비디오 ID
     * @returns {Promise<Object|null>} 비디오 요약 또는 null
     * @throws {Error} 요약 조회 실패 시
     */
    async getSummary(videoId) {
        try {
            // 캐시 확인
            const cacheKey = `summary:${videoId}`; // 캐시 키 생성
            const cachedSummary = this.cache.get(cacheKey); // 캐시에서 요약 조회
            if (cachedSummary) {
                return cachedSummary; // 캐시된 요약 반환
            }

            // DB에서 조회
            const summary = await VideoSummary.findByVideoId(videoId); // DB에서 비디오 ID로 요약 조회
            if (summary) {
                this.cache.set(cacheKey, summary); // 요약을 캐시에 저장
                return summary; // 요약 반환
            }

            return null; // 요약이 없을 경우 null 반환
        } catch (error) {
            console.error('요약 조회 에러:', error); // 에러 로그 출력
            throw error; // 에러 발생
        }
    }

    /**
     * 비디오 요약을 생성합니다.
     * @param {string} videoId - 비디오 ID
     * @param {Object} user - 사용자 정보
     * @returns {Promise<Object>} 생성된 요약 정보
     * @throws {Error} 요약 생성 실패 시
     */
    async createSummary(videoId, user) {
        try {
            // 기존 요약 확인
            const existingSummary = await this.getSummary(videoId); // 기존 요약 조회
            if (existingSummary) {
                return {
                    content: existingSummary.summary_text, // 요약 내용
                    creator: existingSummary.creator_name || 'AI', // 생성자 이름
                    fromCache: true // 캐시에서 가져온 경우
                };
            }

            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`; // 비디오 URL 생성
            
            // Lilys AI에 요약 요청
            const response = await this.lilysClient.post('/summaries', {
                source: {
                    sourceType: "youtube_video", // 소스 타입 설정
                    sourceUrl: videoUrl // 소스 URL 설정
                },
                resultLanguage: "ko", // 결과 언어 설정
                modelType: "gpt-4" // 모델 타입 설정
            });

            if (!response.data.requestId) {
                throw new Error('요약 요청 ID를 받지 못했습니다.'); // 요청 ID 미수신 시 에러 발생
            }

            // 요약 결과 대기 및 가져오기
            let summary = await this.waitForSummaryResult(response.data.requestId); // 요약 결과 대기

            // DB 저장 (user가 있는 경우에만 해당 user의 ID 사용)
            const userId = user?.id || this.SYSTEM_USER_ID; // 사용자 ID 설정
            const creatorName = user?.username || 'AI'; // 생성자 이름 설정
            await VideoSummary.create(videoId, summary, userId); // DB에 요약 저장

            const summaryData = {
                summary_text: summary, // 요약 텍스트
                creator_name: creatorName, // 생성자 이름
                created_at: new Date() // 생성일
            };
            
            this.cache.set(`summary:${videoId}`, summaryData); // 캐시에 요약 저장

            return {
                content: summary, // 생성된 요약 내용
                creator: creatorName, // 생성자 이름
                fromCache: false // 캐시에서 가져온 경우 아님
            };
        } catch (error) {
            console.error('요약 생성 중 에러:', error); // 에러 로그 출력
            throw new Error('요약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'); // 요약 생성 실패 에러
        }
    }

    /**
     * 요약 결과를 기다립니다.
     * @param {string} requestId - 요청 ID
     * @returns {Promise<string>} 요약 결과
     * @throws {Error} 요약 생성 시간 초과 시
     */
    async waitForSummaryResult(requestId) {
        let retries = 0; // 재시도 횟수
        const maxRetries = 10; // 최대 재시도 횟수
        const initialDelay = 3000; // 초기 지연 시간

        while (retries < maxRetries) {
            try {
                const response = await this.lilysClient.get(
                    `/summaries/${requestId}?resultType=shortSummary`, // 요약 결과 조회
                    { timeout: 10000 } // 타임아웃 설정
                );

                if (response.data.status === 'done' && 
                    response.data.data?.type === 'shortSummary') {
                    return response.data.data.data.summary; // 요약 결과 반환
                }

                if (response.data.status === 'error') {
                    throw new Error('요약 생성에 실패했습니다.'); // 요약 생성 실패 에러
                }

                retries++; // 재시도 횟수 증가
                await new Promise(resolve => 
                    setTimeout(resolve, initialDelay * Math
                        .pow(1.5, retries)) // 지연 시간 증가
                    );
                } catch (error) {
                    retries++; // 재시도 횟수 증가
                    if (retries === maxRetries) throw error; // 최대 재시도 횟수 초과 시 오류 발생
                    await new Promise(resolve => 
                        setTimeout(resolve, initialDelay * Math.pow(1.5, retries)) // 지연 시간 증가
                    );
                }
            }
            throw new Error('요약 생성 시간이 초과되었습니다.'); // 요약 생성 시간 초과 에러
        }
    
        /**
         * 최근 요약 목록을 가져옵니다.
         * @param {number} limit - 가져올 요약 수
         * @returns {Promise<Array>} 최근 요약 목록
         * @throws {Error} 최근 요약 조회 실패 시
         */
        async getRecentSummaries(limit = 10) {
            try {
                return await VideoSummary.getRecentSummaries(limit); // 최근 요약 조회
            } catch (error) {
                console.error('최근 요약 조회 에러:', error); // 에러 로그 출력
                throw error; // 에러 발생
            }
        }
    }
    
    // 싱글톤 인스턴스 생성 및 내보내기
    module.exports = new SummaryService(); // SummaryService 인스턴스를 내보냄.
    
const axios = require('axios');
const db = require('../config/database');
require('dotenv').config();

class VideoSummaryService {
  constructor() {
    this.LILYS_API_KEY = process.env.LILYS_API_KEY;
    this.LILYS_API_URL = 'https://tool.lilys.ai';
    this.MAX_WAIT_TIME = 5 * 60 * 1000; // 최대 5분 대기
  }

  async getSummary(videoId) {
    try {
      // API 키 체크
      if (!this.LILYS_API_KEY) {
        throw new Error('LILYS_API_KEY가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
      }

      // DB에서 기존 요약 확인
      const [existingSummary] = await db.query(
        'SELECT summary FROM video_summaries WHERE video_id = ?',
        [videoId]
      );

      if (existingSummary.length > 0) {
        return {
          summary: existingSummary[0].summary,
          progress: { status: 'completed', fromCache: true }
        };
      }

      // 1. 요약 생성 요청
      const requestId = await this.requestSummary(videoId);
      console.log('요약 요청 ID:', requestId);

      // 2. 요약 결과 대기 및 가져오기
      const result = await this.waitForSummaryCompletion(requestId);
      console.log('요약 결과:', result);

      // 요약 내용이 없는 경우 에러 처리
      if (!result?.data?.summary) {
        throw new Error('요약 결과를 받지 못했습니다.');
      }

      // DB에 저장
      await db.query(
        'INSERT INTO video_summaries (video_id, summary) VALUES (?, ?)',
        [videoId, result.data.summary]
      );

      return {
        summary: result.data.summary,
        progress: { status: 'completed' }
      };

    } catch (error) {
      console.error('비디오 요약 에러:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      throw new Error(
        error.message === 'LILYS_API_KEY가 설정되지 않았습니다. 환경 변수를 확인해주세요.' 
          ? error.message 
          : '요약 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    }
  }

  async requestSummary(videoId) {
    const maxRetries = 3;
    let retryCount = 0;
    const baseDelay = 3000; // 기본 3초 대기

    while (retryCount < maxRetries) {
        try {
            const url = `${this.LILYS_API_URL}/summaries`;
            const data = {
                source: {
                    sourceType: 'youtube_video',
                    sourceUrl: `https://www.youtube.com/watch?v=${videoId}`
                },
                resultLanguage: 'ko',
                modelType: 'gpt-3.5'
            };
            const headers = {
                'Authorization': `Bearer ${this.LILYS_API_KEY}`,
                'Content-Type': 'application/json'
            };

            console.log('요약 API 요청 시도:', {
                attempt: retryCount + 1,
                url,
                headers: {
                    ...headers,
                    'Authorization': 'Bearer ****' // API 키 마스킹
                },
                data
            });

            const response = await axios.post(url, data, { 
                headers,
                timeout: 15000, // 15초로 증가
                validateStatus: status => status < 500 // 500 이상 에러만 reject
            });
            
            console.log('요약 API 응답:', response.data);

            if (!response.data?.requestId) {
                throw new Error('요약 요청 ID를 받지 못했습니다.');
            }
            
            return response.data.requestId;

        } catch (error) {
            retryCount++;
            const delay = baseDelay * Math.pow(2, retryCount - 1); // 지수 백오프: 3초, 6초, 12초

            console.error('요약 요청 에러:', {
                attempt: retryCount,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                nextRetryDelay: retryCount < maxRetries ? `${delay/1000}초` : '재시도 없음'
            });

            if (error.response?.status === 502) {
                console.log(`Bad Gateway 에러, ${maxRetries - retryCount}회 재시도 남음 (${delay/1000}초 후)`);
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }

            // 임시 응답 반환 (개발/테스트용)
            if (process.env.NODE_ENV === 'development') {
                console.log('개발 환경에서 임시 응답 반환');
                return {
                    requestId: 'temp-' + Date.now(),
                    summary: '현재 요약 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.'
                };
            }

            // 재시도 횟수 초과 또는 다른 에러
            throw new Error(
                error.response?.status === 502 
                    ? 'Lilys API 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.'
                    : '요약 서비스 요청에 실패했습니다. 관리자에게 문의해주세요.'
            );
        }
    }
  }

  async waitForSummaryCompletion(requestId) {
    const startTime = Date.now();
    const checkInterval = 3000; // 3초마다 확인

    while (true) {
      try {
        const response = await axios.get(
          `${this.LILYS_API_URL}/summaries/${requestId}?resultType=shortSummary`,
          {
            headers: {
              'Authorization': `Bearer ${this.LILYS_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const progress = {
          status: response.data.status,
          elapsedTime: Math.round((Date.now() - startTime) / 1000)
        };

        // 요약이 완료된 경우
        if (response.data.status === 'completed') {
          return {
            data: response.data.data,
            progress
          };
        }

        // 요약이 실패한 경우
        if (response.data.status === 'failed') {
          throw new Error('요약 생성에 실패했습니다.');
        }

        // 최대 대기 시간 초과 체크
        if (Date.now() - startTime > this.MAX_WAIT_TIME) {
          throw new Error('요약 시간이 초과되었습니다. 나중에 다시 시도해주세요.');
        }

        // 진행 상태 로깅
        console.log('요약 진행 중...', progress);
        
        // 다음 확인까지 대기
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      } catch (error) {
        if (error.response?.status >= 400) {
          throw new Error('요약 API 호출 중 오류가 발생했습니다.');
        }
        
        console.error('요약 상태 확인 중 오류:', error.message);
        await new Promise(resolve => setTimeout(resolve, checkInterval));
      }
    }
  }
}

module.exports = new VideoSummaryService(); 
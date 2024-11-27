const YoutubeService = require('../services/YoutubeService');
const VideoSummary = require('../models/VideoSummary');
const axios = require('axios');

exports.searchVideos = async (req, res) => {
  try {
    const { query, categoryId } = req.query;
    console.log('검색 요청:', { query, categoryId });

    if (!query) {
      return res.status(400).json({ 
        error: '검색어가 필요합니다.' 
      });
    }

    const videos = await YoutubeService.searchVideos(query, categoryId);
    res.json({ videos });
  } catch (error) {
    console.error('검색 에러:', error);
    const statusCode = error.message.includes('할당량') ? 429 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ 
        error: '비디오 ID가 필요합니다.' 
      });
    }

    const videoDetails = await YoutubeService.getVideoDetails(videoId);
    res.json({ videoDetails });
  } catch (error) {
    console.error('비디오 상세 정보 에러:', error);
    
    const statusCode = error.message.includes('찾을 수 없습니다') ? 404 : 500;
    
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.summarizeVideo = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: '요약 기능은 회원만 이용할 수 있습니다.' 
      });
    }

    const { videoUrl } = req.body;
    const videoId = videoUrl.split('v=')[1];

    // 기존 요약 확인
    const existingSummary = await VideoSummary.findByVideoId(videoId);
    if (existingSummary) {
      return res.json({
        summary: existingSummary.summary_text,
        fromCache: true,
        creator: existingSummary.creator_name
      });
    }

    // 새로운 요약 요청
    let retryCount = 0;
    const maxRetries = 3;
    let response;

    while (retryCount < maxRetries) {
      try {
        response = await axios.post('https://tool.lilys.ai/summaries', {
          source: {
            sourceType: "youtube_video",
            sourceUrl: videoUrl
          },
          resultLanguage: "ko",
          modelType: "gpt-3.5"
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.LILYS_API_KEY}`
          },
          timeout: 10000 // 10초 타임아웃 설정
        });
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === maxRetries) {
          throw error;
        }
        // 재시도 전 대기
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }

    if (!response.data.requestId) {
      throw new Error('요약 요청 ID를 받지 못했습니다.');
    }

    // 요약 결과 대기 및 저장
    let summary = null;
    let retries = 0;
    const maxResultRetries = 5;
    const initialDelay = 3000;

    while (retries < maxResultRetries) {
      try {
        const summaryResponse = await axios.get(
          `https://tool.lilys.ai/summaries/${response.data.requestId}?resultType=shortSummary`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.LILYS_API_KEY}`
            },
            timeout: 10000
          }
        );

        if (summaryResponse.data.status === 'done' && 
          summaryResponse.data.data?.type === 'shortSummary') {
          summary = summaryResponse.data.data.data.summary;
          break;
        }

        if (summaryResponse.data.status === 'error') {
          throw new Error('요약 생성에 실패했습니다.');
        }

        retries++;
        // 지수 백오프로 대기 시간 증가
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, retries)));
      } catch (error) {
        retries++;
        if (retries === maxResultRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, initialDelay * Math.pow(2, retries)));
      }
    }

    if (!summary) {
      throw new Error('요약 생성 시간이 초과되었습니다.');
    }

    // 요약 결과를 생성한 사용자 정보와 함께 저장
    const summaryId = await VideoSummary.create(videoId, summary, req.user.id);
    const savedSummary = await VideoSummary.findByVideoId(videoId);

    res.json({
      summary,
      fromCache: false,
      creator: savedSummary.creator_name
    });

  } catch (error) {
    console.error('요약 요청 에러:', error);
    const errorMessage = error.response?.status === 502 
      ? '요약 서버가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해주세요.'
      : '요약 요청 중 오류가 발생했습니다.';
    
    res.status(500).json({ 
      error: errorMessage,
      details: error.message 
    });
  }
};

exports.getSummaryResult = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    console.log('요약 결과 조회:', requestId);

    const response = await axios.get(
      `https://tool.lilys.ai/summaries/${requestId}?resultType=shortSummary`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LILYS_API_KEY}`
        }
      }
    );
    
    console.log('요약 결과:', response.data);

    if (!response.data.status) {
      return res.status(500).json({
        error: '유효하지 않은 요약 결과입니다.',
        details: response.data
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error('요약 결과 조회 에러:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '요약 결과를 가져오는데 실패했습니다.',
      details: error.response?.data || error.message
    });
  }
};

exports.updateAllSummaryFormats = async (req, res) => {
    try {
        await VideoSummary.updateAllSummaryFormats();
        res.json({ message: '모든 요약 텍스트가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('요약 포맷 업데이트 에러:', error);
        res.status(500).json({ 
            error: '요약 포맷 업데이트 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
};

exports.getVideoSummary = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId) {
      return res.status(400).json({ 
        error: '비디오 ID가 필요합니다.' 
      });
    }

    const summary = await VideoSummary.findByVideoId(videoId);
    
    if (!summary) {
      return res.status(404).json({ 
        error: '요약을 찾을 수 없습니다.' 
      });
    }

    res.json({
      summary: summary.summary_text,
      creator: summary.creator_name,
      fromCache: true
    });
  } catch (error) {
    console.error('요약 조회 에러:', error);
    res.status(500).json({ 
      error: '요약을 불러오는데 실패했습니다.',
      details: error.message 
    });
  }
};



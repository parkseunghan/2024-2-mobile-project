const YoutubeService = require('../services/YoutubeService');
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
    const { videoUrl } = req.body;
    
    console.log('요약 요청 URL:', videoUrl);
    console.log('API Key:', process.env.LILYS_API_KEY ? '설정됨' : '미설정');

    const response = await axios.post('https://tool.lilys.ai/summaries', {
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
      }
    });
    
    console.log('Lily API 응답:', response.data);

    // requestId가 응답에 없는 경우 에러 처리
    if (!response.data.requestId) {
      console.error('Lily API 응답에 requestId가 없음:', response.data);
      return res.status(500).json({ 
        error: '요약 요청 ID를 받지 못했습니다.',
        details: response.data 
      });
    }

    // 정상 응답
    res.json({
      requestId: response.data.requestId,
      message: '요약 요청이 성공적으로 전송되었습니다.'
    });

  } catch (error) {
    console.error('요약 요청 에러:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '요약 요청 중 오류가 발생했습니다.',
      details: error.response?.data || error.message
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



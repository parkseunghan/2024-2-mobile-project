const YoutubeService = require('../services/YoutubeService');

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

exports.getSummary = async (req, res) => {
  try {
    const { videoId } = req.params;
    const summary = await VideoSummaryService.getSummary(videoId);
    res.json({ summary });
  } catch (error) {
    console.error('요약 에러:', error);
    res.status(500).json({ error: '요약 생성 중 오류가 발생했습니다.' });
  }
};
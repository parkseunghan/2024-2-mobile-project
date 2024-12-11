const YoutubeService = require('../services/YoutubeService'); // YouTube 서비스 모듈을 불러옴.
const SummaryService = require('../services/SummaryService'); // 요약 서비스 모듈을 불러옴.

/**
 * YouTube 관련 API 요청을 처리하는 컨트롤러
 */

exports.searchVideos = async (req, res) => {
    try {
        const { query, categoryId } = req.query; // 요청 쿼리에서 검색어와 카테고리 ID 추출
        const videos = await YoutubeService.searchVideos(query, categoryId); // YouTube 비디오 검색
        res.json({ videos }); // 검색 결과 반환
    } catch (error) {
        console.error('유튜브 검색 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '비디오 검색에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.getVideoDetails = async (req, res) => {
    try {
        const { videoId } = req.params; // 요청 매개변수에서 비디오 ID 추출
        console.log('Controller received videoId:', videoId); // 비디오 ID 로깅
        
        const video = await YoutubeService.getVideoDetails(videoId); // 비디오 상세 정보 조회
        console.log('Video details retrieved successfully'); // 성공 로그 출력
        
        res.json({ 
            success: true,
            video // 비디오 정보 반환
        });
    } catch (error) {
        console.error('비디오 상세 정보 조회 에러:', error); // 에러 로그 출력
        res.status(error.response?.status || 500).json({ 
            success: false,
            message: error.message || '비디오 정보 조회에 실패했습니다.' // 에러 메시지 반환
        });
    }
};

exports.getRecommendedVideos = async (req, res) => {
    try {
        const videos = await YoutubeService.getRecommendedVideos(); // 추천 비디오 조회
        res.json({ videos }); // 추천 비디오 반환
    } catch (error) {
        console.error('추천 비디오 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '추천 비디오 조회에 실패했습니다.' }); // 에러 메시지 반환
    }
};

exports.getCategoryVideos = async (req, res) => {
    try {
        const { categoryId } = req.params; // 요청 매개변수에서 카테고리 ID 추출
        console.log('Received category request for:', categoryId); // 카테고리 요청 로깅
        
        const videos = await YoutubeService.getCategoryVideos(categoryId); // 카테고리별 비디오 조회
        console.log('Found videos count:', videos.length); // 조회된 비디오 수 로깅
        
        res.json({ videos }); // 비디오 목록 반환
    } catch (error) {
        console.error('카테고리 비디오 조회 에러:', error); // 에러 로그 출력
        res.status(error.response?.status || 500).json({ 
            message: error.message || '카테고리 비디오 조회에 실패했습니다.' // 에러 메시지 반환
        });
    }
};

exports.summarizeVideo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                error: '요약 기능은 회원만 이용할 수 있습니다.' // 인증되지 않은 사용자에 대한 에러 메시지
            });
        }

        const { videoId, videoUrl } = req.body; // 요청 본체에서 비디오 ID와 URL 추출
        
        // 사용자 정보를 SummaryService로 전달하여 요약 생성
        const summary = await SummaryService.createSummary(videoId, req.user);
        
        res.json({
            summary: summary.content, // 생성된 요약 내용
            creator: summary.creator, // 생성자 이름
            fromCache: summary.fromCache // 캐시 여부
        });
    } catch (error) {
        console.error('요약 생성 에러:', error); // 에러 로그 출력
        const errorMessage = error.message || '요약 생성에 실패했습니다.'; // 에러 메시지 설정
        res.status(500).json({ error: errorMessage }); // 에러 메시지 반환
    }
};

exports.getVideoSummary = async (req, res) => {
    try {
        const { videoId } = req.params; // 요청 매개변수에서 비디오 ID 추출
        const summary = await SummaryService.getSummary(videoId); // 비디오 요약 조회
        
        if (!summary) {
            return res.status(200).json({ 
                hasSummary: false,
                message: '요약을 찾을 수 없습니다.' // 요약이 없을 경우 메시지 반환
            });
        }

        res.json({
            hasSummary: true, // 요약 존재 여부
            summary: summary.summary_text, // 요약 텍스트
            creator: summary.creator_name, // 생성자 이름
            fromCache: true // 캐시 여부
        });
    } catch (error) {
        console.error('요약 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ error: '요약 조회에 실패했습니다.' }); // 에러 메시지 반환
    }
};

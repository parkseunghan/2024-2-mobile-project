const YoutubeService = require('../services/YoutubeService'); // YouTube 서비스 모듈을 불러옴.
const Post = require('../models/Post'); // 게시글 모델을 불러옴.
const db = require('../config/database'); // 데이터베이스 설정을 불러옴.

/**
 * 통합 검색 기능을 제공하는 컨트롤러
 */
exports.search = async (req, res) => {
    try {
        const { query, type = 'all' } = req.query; // 요청 쿼리에서 검색어와 타입을 추출
        const results = { videos: [], posts: [] }; // 검색 결과 초기화

        // YouTube 검색
        if (type === 'all' || type === 'video') {
            const videos = await YoutubeService.searchVideos(query); // YouTube 비디오 검색
            console.log('YouTube API Response:', videos); // 유튜브 API 응답 로깅
            results.videos = videos; // 비디오 결과 저장
        }

        // 커뮤니티 게시글 검색
        if (type === 'all' || type === 'post') {
            results.posts = await Post.search(query); // 게시글 검색
        }

        console.log('Final Response:', results); // 최종 응답 로깅
        res.json(results); // 검색 결과 반환
    } catch (error) {
        console.error('통합 검색 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '검색에 실패했습니다.' }); // 에러 메시지 반환
    }
};

/**
 * 카테고리별 검색 기능
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.searchByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // 카테고리 ID 추출
        const { query } = req.query; // 검색어 추출

        const videos = await YoutubeService.searchVideos(query, categoryId); // 카테고리별 비디오 검색
        res.json({ videos }); // 검색 결과 반환
    } catch (error) {
        console.error('카테고리 검색 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '카테고리 검색에 실패했습니다.' }); // 에러 메시지 반환
    }
};

/**
 * 사용자 검색 기록 조회
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.getSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id; // 인증된 사용자 ID 추출
        const [history] = await db.query(
            `SELECT query, created_at 
             FROM search_history 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [userId] // 사용자 ID로 검색 기록 조회
        );
        
        res.json({ history }); // 검색 기록 반환
    } catch (error) {
        console.error('검색 기록 조회 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '검색 기록 조회에 실패했습니다.' }); // 에러 메시지 반환
    }
};

/**
 * 사용자 검색 기록 추가
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.addSearchHistory = async (req, res) => {
    try {
        const { query } = req.body; // 요청 본체에서 검색어 추출
        const userId = req.user.id; // 인증된 사용자 ID 추출

        // 기존 검색어가 있는지 확인
        const [existingQuery] = await db.query(
            'SELECT id FROM search_history WHERE user_id = ? AND query = ?',
            [userId, query] // 사용자 ID와 검색어로 조회
        );

        if (existingQuery.length > 0) {
            // 기존 검색어가 있으면 시간만 업데이트
            await db.query(
                'UPDATE search_history SET created_at = NOW() WHERE id = ?',
                [existingQuery[0].id] // 기존 검색어의 ID로 업데이트
            );
        } else {
            // 새로운 검색어 추가
            await db.query(
                'INSERT INTO search_history (user_id, query) VALUES (?, ?)',
                [userId, query] // 사용자 ID와 검색어로 추가
            );
        }

        res.json({ success: true }); // 성공 응답
    } catch (error) {
        console.error('검색 기록 저장 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '검색 기록 저장에 실패했습니다.' }); // 에러 메시지 반환
    }
};

/**
 * 사용자 검색 기록 전체 삭제
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.clearSearchHistory = async (req, res) => {
    try {
        const userId = req.user.id; // 인증된 사용자 ID 추출
        await db.query(
            'DELETE FROM search_history WHERE user_id = ?',
            [userId] // 사용자 ID로 검색 기록 삭제
        );
        
        res.json({ success: true }); // 성공 응답
    } catch (error) {
        console.error('검색 기록 전체 삭제 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '검색 기록 삭제에 실패했습니다.' }); // 에러 메시지 반환
    }
};

/**
 * 특정 검색 기록 항목 삭제
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 */
exports.deleteSearchHistoryItem = async (req, res) => {
    try {
        const { query } = req.params; // 요청 매개변수에서 검색어 추출
        const userId = req.user.id; // 인증된 사용자 ID 추출

        await db.query(
            'DELETE FROM search_history WHERE user_id = ? AND query = ?',
            [userId, query] // 사용자 ID와 검색어로 삭제
        );

        res.json({ success: true }); // 성공 응답
    } catch (error) {
        console.error('검색 기록 항목 삭제 에러:', error); // 에러 로그 출력
        res.status(500).json({ message: '검색 기록 항목 삭제에 실패했습니다.' }); // 에러 메시지 반환
    }
};

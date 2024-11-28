import api from '../api';

/**
 * 커뮤니티 관련 API 함수들
 */
export const communityApi = {
    /**
     * 게시글 목록 조회
     * @param {string} category - 카테고리 (선택적)
     * @param {number} page - 페이지 번호
     * @param {string} searchQuery - 검색어 (선택적)
     */
    getPosts: async (category, page = 1, searchQuery = '') => {
        try {
            const response = await api.get('/community/posts', {
                params: { 
                    category, 
                    page,
                    search: searchQuery 
                }
            });
            return response.data;
        } catch (error) {
            console.error('게시글 목록 조회 에러:', error);
            throw error;
        }
    },

    /**
     * 게시글 상세 조회
     * @param {string} postId - 게시글 ID
     */
    getPost: async (postId) => {
        try {
            console.log('Fetching post:', postId);
            const response = await api.get(`/community/posts/${postId}`);
            
            // 응답 구조 확인 및 데이터 검증
            if (!response.data || !response.data.post) {
                throw new Error('게시글을 찾을 수 없습니다.');
            }
            
            console.log('Post response:', response.data);
            return response.data;
        } catch (error) {
            console.error('게시글 조회 에러:', error);
            throw error.response?.data?.message || error.message || '게시글을 불러오는데 실패했습니다.';
        }
    },

    /**
     * 댓글 작성
     * @param {string} postId - 게시글 ID
     * @param {string} content - 댓글 내용
     */
    createComment: async (postId, content) => {
        try {
            const response = await api.post(`/community/posts/${postId}/comments`, {
                content
            });
            return response.data;
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            throw error;
        }
    },

    /**
     * 좋아요 토글
     * @param {string} postId - 게시글 ID
     */
    toggleLike: async (postId) => {
        try {
            const response = await api.post(`/community/posts/${postId}/like`);
            return response.data;
        } catch (error) {
            console.error('좋아요 토글 에러:', error);
            throw error;
        }
    },

    /**
     * 좋아요한 게시글 목록 조회
     */
    getLikedPosts: async () => {
        try {
            const response = await api.get('/profile/liked-posts');
            return response.data;
        } catch (error) {
            console.error('좋아요 게시글 조회 에러:', error);
            throw error;
        }
    }
}; 
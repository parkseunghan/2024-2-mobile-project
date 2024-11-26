import api from '../api';

/**
 * 커뮤니티 관련 API 함수들
 */
export const communityApi = {
    /**
     * 게시글 목록 조회
     * @param {string} category - 카테고리 (선택적)
     * @param {number} page - 페이지 번호
     */
    getPosts: async (category, page = 1) => {
        try {
            const response = await api.get('/community/posts', {
                params: { category, page }
            });
            return response.data;
        } catch (error) {
            console.error('게시글 목록 조회 에러:', error);
            throw error;
        }
    },

    /**
     * 게시글 상세 조회
     * @param {string} id - 게시글 ID
     */
    getPost: async (id) => {
        try {
            const response = await api.get(`/community/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('게시글 조회 에러:', error);
            throw error;
        }
    },

    /**
     * 게시글 작성
     * @param {FormData} formData - 게시글 데이터 (제목, 내용, 미디어 등)
     */
    createPost: async (formData) => {
        try {
            const response = await api.post('/community/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('게시글 작성 API 에러:', error.response?.data);
            throw error;
        }
    },

    /**
     * 게시글 수정
     * @param {string} id - 게시글 ID
     * @param {FormData} formData - 수정할 데이터
     */
    updatePost: async (id, formData) => {
        try {
            const response = await api.put(`/community/posts/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('게시글 수정 에러:', error);
            throw error;
        }
    },

    /**
     * 게시글 삭제
     * @param {string} id - 게시글 ID
     */
    deletePost: async (id) => {
        try {
            const response = await api.delete(`/community/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('게시글 삭제 에러:', error);
            throw error;
        }
    },

    /**
     * 게시글 좋아요 토글
     * @param {string} id - 게시글 ID
     */
    toggleLike: async (id) => {
        try {
            const response = await api.post(`/community/posts/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('좋아요 토글 에러:', error);
            throw error;
        }
    },

    /**
     * 댓글 작성
     * @param {string} postId - 게시글 ID
     * @param {string} content - 댓글 내용
     */
    createComment: async (postId, content) => {
        try {
            const response = await api.post(`/community/posts/${postId}/comments`, { content });
            return response.data;
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            throw error;
        }
    },

    /**
     * 댓글 삭제
     * @param {string} postId - 게시글 ID
     * @param {string} commentId - 댓글 ID
     */
    deleteComment: async (postId, commentId) => {
        try {
            const response = await api.delete(`/community/posts/${postId}/comments/${commentId}`);
            return response.data;
        } catch (error) {
            console.error('댓글 삭제 에러:', error);
            throw error;
        }
    }
}; 
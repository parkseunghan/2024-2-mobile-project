import api from '../api';

export const communityApi = {
    // 게시글 관련 API
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

    getPost: async (id) => {
        try {
            const response = await api.get(`/community/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('게시글 조회 에러:', error);
            throw error;
        }
    },

    createPost: async (formData) => {
        try {
            // FormData 객체를 직접 전송
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

    deletePost: async (id) => {
        try {
            const response = await api.delete(`/community/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('게시글 삭제 에러:', error);
            throw error;
        }
    },

    toggleLike: async (id) => {
        try {
            const response = await api.post(`/community/posts/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('좋아요 토글 에러:', error);
            throw error;
        }
    },

    createComment: async (postId, content) => {
        try {
            const response = await api.post(`/community/posts/${postId}/comments`, { content });
            return response.data;
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            throw error;
        }
    },

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
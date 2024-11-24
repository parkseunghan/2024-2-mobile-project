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
            // FormData를 일반 객체로 변환
            const postData = {
                title: formData.get('title'),
                content: formData.get('content'),
                category: formData.get('category')
            };

            // 미디어 파일이 있는 경우에만 FormData 사용
            if (formData.get('media')) {
                const response = await api.post('/community/posts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                return response.data;
            } else {
                // 미디어 파일이 없는 경우 일반 JSON으로 전송
                const response = await api.post('/community/posts', postData);
                return response.data;
            }
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

    // 좋아요 관련 API
    toggleLike: async (id) => {
        try {
            const response = await api.post(`/community/posts/${id}/like`);
            return response.data;
        } catch (error) {
            console.error('좋아요 토글 에러:', error);
            throw error;
        }
    },

    // 댓글 관련 API
    createComment: async (postId, content) => {
        try {
            const response = await api.post(`/community/posts/${postId}/comments`, { content });
            return response.data;
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            throw error;
        }
    },

    // 댓글 삭제 API
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
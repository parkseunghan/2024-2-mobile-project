import client from './client';

export const communityApi = {
    /**
     * 게시글 목록 조회
     * @param {string} category - 카테고리 (선택)
     * @param {number} page - 페이지 번호
     */
    getPosts: (category = null, page = 1) => 
        client.get('/community/posts', { 
            params: { category, page } 
        }),

    /**
     * 게시글 상세 조회
     * @param {string} postId - 게시글 ID
     */
    getPost: (postId) => 
        client.get(`/community/posts/${postId}`),

    /**
     * 게시글 작성
     * @param {Object} postData - 게시글 데이터
     */
    createPost: (postData) => 
        client.post('/community/posts', postData),

    /**
     * 게시글 수정
     * @param {string} postId - 게시글 ID
     * @param {Object} postData - 수정할 게시글 데이터
     */
    updatePost: (postId, postData) => 
        client.put(`/community/posts/${postId}`, postData),

    /**
     * 게시글 삭제
     * @param {string} postId - 게시글 ID
     */
    deletePost: (postId) => 
        client.delete(`/community/posts/${postId}`),

    /**
     * ��시글 좋아요/좋아요 취소
     * @param {string} postId - 게시글 ID
     */
    toggleLike: (postId) => 
        client.post(`/community/posts/${postId}/like`),

    /**
     * 댓글 작성
     * @param {string} postId - 게시글 ID
     * @param {Object} commentData - 댓글 데이터
     */
    createComment: (postId, commentData) => 
        client.post(`/community/posts/${postId}/comments`, commentData),

    /**
     * 댓글 삭제
     * @param {string} postId - 게시글 ID
     * @param {string} commentId - 댓글 ID
     */
    deleteComment: (postId, commentId) => 
        client.delete(`/community/posts/${postId}/comments/${commentId}`),

    /**
     * 좋아요한 게시글 목록 조회
     */
    getLikedPosts: () => 
        client.get('/community/liked-posts'),

    /**
     * 조회수 증가
     * @param {string} postId - 게시글 ID
     */
    incrementViewCount: (postId) => 
        client.post(`/community/posts/${postId}/view`),
}; 
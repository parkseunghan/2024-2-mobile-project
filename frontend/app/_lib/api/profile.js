import client from './client';

export const profileApi = {
    /**
     * 프로필 정보 조회
     */
    getProfile: () => 
        client.get('/profile'),

    /**
     * 프로필 정보 수정
     * @param {Object} profileData - 수정할 프로필 데이터
     */
    updateProfile: (profileData) => 
        client.put('/profile', profileData),

    /**
     * 사용자의 게시글 목록 조회
     */
    getUserPosts: () => 
        client.get('/profile/posts'),

    /**
     * 사용자의 댓글 목록 조회
     */
    getUserComments: () => 
        client.get('/profile/comments'),

    /**
     * 사용자가 좋아요한 게시글 목록 조회
     */
    getLikedPosts: () => 
        client.get('/profile/liked-posts'),
}; 
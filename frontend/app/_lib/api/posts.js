import client from './client';

const POSTS_PER_PAGE = 10;

export const postsApi = {
    // 게시글 목록 조회
    fetchPosts: async ({ page = 1, category, search }) => {
        const params = new URLSearchParams({
            page,
            limit: POSTS_PER_PAGE,
            ...(category && category !== '전체' && { category }),
            ...(search && { search })
        });
        return await client.get(`/posts?${params}`);
    },

    // 인기 게시글 조회
    fetchPopularPosts: async () => {
        return await client.get('/posts/popular');
    },

    // 게시글 상세 조회
    fetchPostDetail: async (postId) => {
        return await client.get(`/posts/${postId}`);
    },

    // 미디어 업로드
    uploadMedia: async (formData) => {
        return await client.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // 게시글 작성
    createPost: async (postData) => {
        return await client.post('/community/posts', postData);
    },

    // 게시글 좋아요/취소
    toggleLike: async (postId) => {
        return await client.post(`/posts/${postId}/like`);
    },

    // 좋아요한 게시글 목록
    fetchLikedPosts: async () => {
        return await client.get('/posts/liked');
    },

    // 카테고리 목록 조회
    fetchCategories: async () => {
        const response = await client.get('/categories');
        return response.data.categories;
    }
}; 
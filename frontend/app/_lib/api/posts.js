import client from './client';

const POSTS_PER_PAGE = 10;

export const postsApi = {
    // 게시글 목록 조회
    fetchPosts: async ({ page = 1, category, search }) => {
        const params = new URLSearchParams({
            page,
            ...(category && category !== '전체' && { category }),
            ...(search && { search })
        });
        const response = await client.get(`/community/posts?${params}`);
        return {
            posts: response.data.posts,
            nextPage: response.data.nextPage,
            totalPages: response.data.totalPages
        };
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
        try {
            const response = await client.post('/community/posts', postData);
            return response.data;
        } catch (error) {
            console.error('게시글 생성 실패:', error);
            throw error;
        }
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
        try {
            const response = await client.get('/categories');
            return response.data.categories;
        } catch (error) {
            console.error('카테고리 목록 조회 실패:', error);
            throw error;
        }
    }
}; 
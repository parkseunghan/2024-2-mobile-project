import React, { createContext, useState, useContext } from 'react';

const PostContext = createContext();

export function PostProvider({ children }) {
    const [posts, setPosts] = useState([
        { 
            id: '1', 
            category: '상품 리뷰', 
            title: '갤럭시 워치6 클래식... 워치8 기다려, 말아?', 
            imageUrl: '', 
            author: '미유', 
            time: '1시간 전', 
            likes: 43, 
            dislikes: 0,
            liked: false,
            disliked: false,
            favorited: false,
            comments: [], 
            content: '갤럭시 워치에 대한 상세 리뷰입니다.', 
            media: null 
        },
        { 
            id: '2', 
            category: '맛집', 
            title: '서면 파스타 맛집 가성비 롤링파스타', 
            imageUrl: '', 
            author: '이프락', 
            time: '3시간 전', 
            likes: 32, 
            dislikes: 0,
            liked: false,
            disliked: false,
            favorited: false,
            comments: [], 
            content: '부산 서면에서 가성비 좋은 파스타 맛집 소개입니다.', 
            media: null 
        },
        { 
            id: '3', 
            category: '여행', 
            title: '제주도 여행 후기', 
            imageUrl: '', 
            author: '하늘', 
            time: '5시간 전', 
            likes: 9, 
            dislikes: 0,
            liked: false,
            disliked: false,
            favorited: false,
            comments: [], 
            content: '제주도 여행에서의 멋진 경험들입니다.', 
            media: null 
        },
    ]);

    const getPost = (id) => posts.find(post => post.id === id);
    
    const addPost = (newPost) => {
        setPosts(prev => [
            {
                ...newPost,
                id: Date.now().toString(),
                likes: 0,
                dislikes: 0,
                liked: false,
                disliked: false,
                favorited: false,
                comments: [],
                time: '방금 전',
            },
            ...prev
        ]);
    };

    const updatePost = (id, updates) => {
        setPosts(prev => prev.map(post => 
            post.id === id ? { ...post, ...updates } : post
        ));
    };

    const toggleLike = (id) => {
        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                const wasLiked = post.liked;
                const wasDisliked = post.disliked;
                return {
                    ...post,
                    likes: wasLiked ? post.likes - 1 : post.likes + 1,
                    dislikes: wasDisliked ? post.dislikes - 1 : post.dislikes,
                    liked: !wasLiked,
                    disliked: wasDisliked ? false : post.disliked
                };
            }
            return post;
        }));
    };

    const toggleDislike = (id) => {
        setPosts(prev => prev.map(post => {
            if (post.id === id) {
                const wasDisliked = post.disliked;
                const wasLiked = post.liked;
                return {
                    ...post,
                    dislikes: wasDisliked ? post.dislikes - 1 : post.dislikes + 1,
                    likes: wasLiked ? post.likes - 1 : post.likes,
                    disliked: !wasDisliked,
                    liked: wasLiked ? false : post.liked
                };
            }
            return post;
        }));
    };

    const toggleFavorite = (id) => {
        setPosts(prev => prev.map(post => 
            post.id === id ? { ...post, favorited: !post.favorited } : post
        ));
    };

    const addComment = (postId, comment) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    comments: [...post.comments, {
                        id: Date.now().toString(),
                        ...comment,
                        timestamp: new Date().toISOString()
                    }]
                };
            }
            return post;
        }));
    };

    return (
        <PostContext.Provider value={{ 
            posts, 
            getPost, 
            addPost, 
            updatePost,
            toggleLike,
            toggleDislike,
            toggleFavorite,
            addComment
        }}>
            {children}
        </PostContext.Provider>
    );
}

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
}; 
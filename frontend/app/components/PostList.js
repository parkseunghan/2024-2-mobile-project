import React, { useEffect, useState } from 'react';
import { fetchPosts, deletePost } from '../api/api';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const response = await fetchPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePost(id);
            loadPosts(); // 삭제 후 다시 로드
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    return (
        <div>
            <h2>Post List</h2>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        {post.title} by {post.author}
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;

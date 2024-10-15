import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// 사용자 API
export const fetchUsers = () => axios.get('http://localhost:5000/api/users');
export const deleteUser = (id) => axios.delete('http://localhost:5000/api/users');

export const fetchUserById = (id) => axios.get(`${API_URL}/users/${id}`);
export const createUser = (user) => axios.post(`${API_URL}/users`, user);
export const updateUser = (id, user) => axios.put(`${API_URL}/users/${id}`, user);

// 게시글 API
export const fetchPosts = () => axios.get(`${API_URL}/posts`);
export const fetchPostById = (id) => axios.get(`${API_URL}/posts/${id}`);
export const createPost = (post) => axios.post(`${API_URL}/posts`, post);
export const updatePost = (id, post) => axios.put(`${API_URL}/posts/${id}`, post);
export const deletePost = (id) => axios.delete(`${API_URL}/posts/${id}`);

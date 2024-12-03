import { client } from './client';

export const authApi = {
    signup: (userData) => {
        console.log('API call - signup:', userData);
        return client.post('/auth/signup', userData);
    },
    
    login: (credentials) => 
        client.post('/auth/login', credentials),
    
    logout: () => 
        client.post('/auth/logout'),
    
    getMe: () => 
        client.get('/auth/me'),
}; 
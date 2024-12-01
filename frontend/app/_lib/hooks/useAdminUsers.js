import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import client from '../api/client';
import { useAuth } from '@app/_context/AuthContext';

export function useAdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { user } = useAuth();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/admin/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error('사용자 목록 조회 에러:', error);
            setError('사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivateUser = async (userId) => {
        try {
            setError(null);
            await client.delete(`/admin/users/${userId}`);
            await fetchUsers();
        } catch (error) {
            console.error('사용자 비활성화 에러:', error);
            setError('사용자 비활성화에 실패했습니다.');
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'god') {
            fetchUsers();
        }
    }, [user]);

    return {
        users,
        loading,
        error,
        fetchUsers,
        handleDeactivateUser
    };
} 
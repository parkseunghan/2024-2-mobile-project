import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import api from '@app/_utils/api';
import { useAuth } from '@app/_utils/hooks/useAuth';

export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user, checkAuth } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 사용자가 관리자인지 확인
      if (!user || user.role !== 'admin') {
        router.replace('/(tabs)/home');
        return;
      }

      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
      
      if (error.response?.status === 401) {
        // 인증 에러 발생 시 인증 상태 재확인
        await checkAuth();
        setError('인증이 필요합니다. 다시 로그인해주세요.');
        router.replace('/(auth)/login');
      } else {
        setError(error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setError(null);
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      await fetchUsers(); // 목록 새로고침
    } catch (error) {
      console.error('역할 업데이트 실패:', error);
      
      if (error.response?.status === 401) {
        await checkAuth();
        setError('인증이 필요합니다. 다시 로그인해주세요.');
        router.replace('/(auth)/login');
      } else {
        setError(error.response?.data?.message || '역할 업데이트에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    handleRoleUpdate,
  };
} 
import { useState, useEffect, useCallback } from 'react';
import client from '@app/_lib/api/client';

export function useAdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await client.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('대시보드 통계 조회 실패:', error);
            setError('통계 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    return {
        stats,
        loading,
        error,
        refreshData: fetchDashboardStats
    };
} 
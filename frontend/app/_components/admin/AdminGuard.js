import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@app/_context/AuthContext';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';

export function AdminGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    const isAdmin = user?.role === 'admin' || user?.role === 'god';

    useEffect(() => {
        console.log('AdminGuard - User:', user);
        console.log('AdminGuard - IsAdmin:', isAdmin);
        console.log('AdminGuard - User Role:', user?.role);

        if (!loading && user && !isAdmin) {
            console.log('AdminGuard - 권한 없음, 리다이렉트');
            router.replace('/');
        }
    }, [user, loading, isAdmin, router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user || !isAdmin) {
        return null;
    }

    return children;
} 
import React from 'react';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';

export default function AdminIndex() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, []);

    return <LoadingSpinner />;
} 
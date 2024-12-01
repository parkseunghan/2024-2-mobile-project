import React from 'react';
import { Stack } from 'expo-router';
import { Header } from '@app/_components/common/Header';
import { AdminGuard } from '@app/_components/admin/AdminGuard';

export default function AdminLayout() {
    return (
        <AdminGuard>
            <Stack
                screenOptions={{
                    header: ({ route }) => (
                        <Header
                            title={getTitleByRoute(route?.name)}
                            showBackButton={true}
                            hideSearchBar={true}
                        />
                    ),
                    headerShown: true,
                }}
            >
                <Stack.Screen 
                    name="index"
                    options={{
                        title: '관리자'
                    }}
                />
                <Stack.Screen 
                    name="dashboard" 
                    options={{
                        title: '관리자 대시보드'
                    }}
                />
                <Stack.Screen 
                    name="categories" 
                    options={{
                        title: '카테고리 관리'
                    }}
                />
                <Stack.Screen 
                    name="users" 
                    options={{
                        title: '사용자 관리'
                    }}
                />
            </Stack>
        </AdminGuard>
    );
}

function getTitleByRoute(routeName) {
    switch (routeName) {
        case 'dashboard':
            return '관리자 대시보드';
        case 'categories':
            return '카테고리 관리';
        case 'users':
            return '사용자 관리';
        default:
            return '관리자';
    }
} 
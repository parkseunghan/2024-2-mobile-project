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
              title={route.name === 'dashboard' ? '관리자 대시보드' : '관리자 설정'} 
              showBackButton={true}
            />
          ),
        }}
      />
    </AdminGuard>
  );
} 
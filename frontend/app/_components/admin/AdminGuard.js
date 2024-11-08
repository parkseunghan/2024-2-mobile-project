import React from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { colors } from '@app/_styles/colors';

export function AdminGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user || user.role !== 'admin') {
    router.replace('/(tabs)/home');
    return null;
  }

  return children;
} 
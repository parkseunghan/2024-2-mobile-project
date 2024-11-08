import { Stack } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { useAuth } from '@app/_context/AuthContext';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();

  // 관리자가 아닌 경우 접근 제한
  if (!user || user.role !== 'admin') {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: '관리자 대시보드',
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: '사용자 관리',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: '관리자 설정',
        }}
      />
    </Stack>
  );
} 
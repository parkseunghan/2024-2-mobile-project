import { Redirect } from 'expo-router';
import { useAuth } from '@app/_context/AuthContext';

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // 또는 로딩 스피너
  }

  if (!user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Redirect href="/(tabs)/home" />;
}

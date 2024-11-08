import { useAuth } from '@app/_context/AuthContext';
import { Redirect, Slot } from 'expo-router';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Slot />;
} 
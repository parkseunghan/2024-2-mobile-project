import { Stack } from 'expo-router';
import { colors } from '@app/_styles/colors';

export default function AuthLayout() {
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
        name="login"
        options={{
          title: '로그인',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: '회원가입',
        }}
      />
    </Stack>
  );
} 
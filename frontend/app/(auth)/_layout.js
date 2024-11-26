import { Stack } from 'expo-router';
import { colors } from '@app/_styles/colors';

/**
 * 인증 관련 화면 레이아웃 컴포넌트
 * - 로그인, 회원가입 등의 인증 화면 스택 구성
 */
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
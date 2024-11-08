import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Button } from '@app/_components/common/Button';
import { useAuth } from '@app/_context/AuthContext';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useRouter } from 'expo-router';

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: '홈',
          headerRight: () => (
            user ? (
              <Button
                title="로그아웃"
                onPress={handleLogout}
                variant="secondary"
                style={styles.headerButton}
              />
            ) : (
              <Button
                title="로그인"
                onPress={handleLogin}
                variant="primary"
                style={styles.headerButton}
              />
            )
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            ...typography.h2,
          },
        }} 
      />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          {user ? `환영합니다, ${user.username}님!` : '환영합니다!'}
        </Text>
        {!user && (
          <Text style={styles.guestText}>
            현재 비회원으로 이용 중입니다
          </Text>
        )}
        <Text style={styles.text}>홈 화면</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  welcomeText: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  guestText: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.text.secondary,
  },
  headerButton: {
    marginRight: spacing.md,
    paddingHorizontal: spacing.md,
    height: 36,
  },
}); 
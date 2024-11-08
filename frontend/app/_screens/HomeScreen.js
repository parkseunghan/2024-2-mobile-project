import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_utils/hooks/useAuth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
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
}); 
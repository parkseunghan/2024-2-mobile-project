import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>TipTube</Text>
        <Text style={styles.subtitle}>실생활 꿀팁 아카이브</Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title="로그인"
          onPress={() => router.push('/login')}
          variant="primary"
          fullWidth
        />
        <Button
          title="회원가입"
          onPress={() => router.push('/signup')}
          variant="secondary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  buttons: {
    gap: spacing.md,
  },
}); 
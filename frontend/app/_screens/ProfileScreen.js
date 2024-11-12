import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { Button } from '@app/_components/common/Button';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>현재 비회원으로 이용 중입니다.</Text>
          <Text style={styles.subtitle}>
            추가 서비스를 이용하시려면 로그인이 필요합니다.
          </Text>
          
          <View style={styles.buttonContainer}>
            <Button
              title="로그인"
              onPress={() => router.push('/login')}
              variant="primary"
              fullWidth
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.role}>역할: {user.role}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
    maxWidth: 400,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h1,
    color: colors.background,
  },
  infoContainer: {
    alignItems: 'center',
  },
  username: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  email: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  role: {
    ...typography.body,
    color: colors.primary,
  },
}); 
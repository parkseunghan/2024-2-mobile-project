import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';

export function UserList({ users, onRoleUpdate, loading, error }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!users?.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>사용자가 없습니다.</Text>
      </View>
    );
  }

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.role}>역할: {item.role}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          title={item.role === 'user' ? '관리자로 변경' : '일반 사용자로 변경'}
          onPress={() => onRoleUpdate(item.id, item.role === 'user' ? 'admin' : 'user')}
          variant="secondary"
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  userCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    ...typography.h3,
    marginBottom: spacing.xs,
  },
  email: {
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  role: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  actions: {
    gap: spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 
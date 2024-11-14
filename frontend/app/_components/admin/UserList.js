import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';

export function UserList({ users, onRoleUpdate, onDeactivateUser, loading, error }) {
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
        <Button
          title="비활성화"
          onPress={() => {
            Alert.alert(
              '사용자 비활성화',
              '정말 이 사용자를 비활성화하시겠습니까?',
              [
                { text: '취소', style: 'cancel' },
                { 
                  text: '비활성화', 
                  onPress: () => onDeactivateUser(item.id),
                  style: 'destructive'
                }
              ]
            );
          }}
          variant="danger"
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
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={true} // 스크롤 바 표시
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      scrollEventThrottle={16}
      webProps={{
        onWheel: { passive: true }
      }}
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
    alignItems: 'flex-end',
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
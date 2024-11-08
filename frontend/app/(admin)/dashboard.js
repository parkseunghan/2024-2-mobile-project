import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';
import { useAdminUsers } from '@app/_hooks/useAdminUsers';
import { UserList } from '@app/_components/admin/UserList';

export default function AdminDashboard() {
  const { users, loading, error, handleRoleUpdate } = useAdminUsers();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 대시보드</Text>
      <UserList 
        users={users} 
        onRoleUpdate={handleRoleUpdate}
        loading={loading}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
}); 
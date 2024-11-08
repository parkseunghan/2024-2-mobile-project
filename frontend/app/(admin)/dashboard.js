import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';
import api from '@app/_utils/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('사용자 목록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('역할 업데이트 실패:', error);
    }
  };

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
          onPress={() => handleRoleUpdate(item.id, item.role === 'user' ? 'admin' : 'user')}
          variant="secondary"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관리자 대시보드</Text>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
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
}); 
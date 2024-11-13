import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';
import { useAdminUsers } from '@app/_hooks/useAdminUsers';
import { UserList } from '@app/_components/admin/UserList';
import { StatisticsCard } from '@app/_components/admin/StatisticsCard';
import { SearchStatistics } from '@app/_components/admin/SearchStatistics';
import api from '@app/_utils/api';

export default function AdminDashboard() {
  const { users, loading: usersLoading, error: usersError, handleRoleUpdate } = useAdminUsers();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const [basicStats, searchStats] = await Promise.all([
        api.get('/api/admin/statistics'),
        api.get('/api/admin/statistics/search')
      ]);
      
      setStatistics({
        basic: basicStats.data.statistics,
        search: searchStats.data.stats
      });
    } catch (error) {
      console.error('통계 로드 에러:', error);
      setError('통계 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>관리자 대시보드</Text>
      
      {/* 기본 통계 */}
      <View style={styles.statsContainer}>
        <StatisticsCard
          title="전체 사용자"
          value={statistics?.basic?.totalUsers || 0}
          loading={loading}
        />
        <StatisticsCard
          title="오늘의 신규 가입"
          value={statistics?.basic?.newUsersToday || 0}
          loading={loading}
        />
        <StatisticsCard
          title="활성 사용자"
          value={statistics?.basic?.activeUsers || 0}
          loading={loading}
        />
      </View>

      {/* 검색 통계 */}
      <SearchStatistics 
        data={statistics?.search} 
        loading={loading}
        error={error}
      />

      {/* 사용자 관리 */}
      <Text style={styles.sectionTitle}>사용자 관리</Text>
      <UserList 
        users={users} 
        onRoleUpdate={handleRoleUpdate}
        loading={usersLoading}
        error={usersError}
      />
    </ScrollView>
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
  sectionTitle: {
    ...typography.h3,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
}); 
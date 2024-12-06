import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { DashboardCard } from '@app/_components/admin/DashboardCard';
import { DashboardChart } from '@app/_components/admin/DashboardChart';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useAdminDashboard } from '@app/_lib/hooks/useAdminDashboard';
import { useAuth } from '@app/_lib/hooks/useAuth';

export default function AdminDashboardScreen() {
    const { user } = useAuth();
    const { 
        stats, 
        loading, 
        error, 
        refreshData 
    } = useAdminDashboard();
    const [refreshing, setRefreshing] = useState(false);

    // 1. 먼저 권한 체크
    if (!user || (user.role !== 'admin' && user.role !== 'god')) {
        return (
            <View style={styles.container}>
                <Text>접근 권한이 없습니다.</Text>
            </View>
        );
    }

    // 2. 로딩 상태 체크
    if (loading && !refreshing) {
        return <LoadingSpinner />;
    }

    // 3. 에러 상태 체크
    if (error) {
        return <ErrorState message={error} onRetry={refreshData} />;
    }

    // 4. 실제 대시보드 렌더링
    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>관리자 대시보드</Text>
            
            <View style={styles.statsGrid}>
                <DashboardCard
                    title="총 사용자"
                    value={stats?.totalUsers || 0}
                    icon="users"
                    color={colors.primary}
                />
                <DashboardCard
                    title="오늘의 방문자"
                    value={stats?.todayVisitors || 0}
                    icon="user-clock"
                    color={colors.success}
                />
                <DashboardCard
                    title="총 게시물"
                    value={stats?.totalPosts || 0}
                    icon="file-alt"
                    color={colors.warning}
                />
                <DashboardCard
                    title="신규 가입자"
                    value={stats?.newUsers || 0}
                    icon="user-plus"
                    color={colors.info}
                />
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>사용자 통계</Text>
                <DashboardChart data={stats?.userStats} />
            </View>

            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>게시물 통계</Text>
                <DashboardChart data={stats?.postStats} />
            </View>
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
        ...typography.h1,
        marginBottom: spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    chartSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
}); 
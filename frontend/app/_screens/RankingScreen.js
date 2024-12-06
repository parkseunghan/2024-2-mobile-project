import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { userApi } from '@app/_lib/api/userApi';
import { useAuth } from '@app/_lib/hooks';

export default function RankingScreen() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  
  useEffect(() => {
    console.log('[RankingScreen] 컴포넌트 마운트');
    loadRankings();
    return () => {
      console.log('[RankingScreen] 컴포넌트 언마운트');
    };
  }, []);

  useEffect(() => {
    console.log('[RankingScreen] rankings 업데이트:', rankings);
  }, [rankings]);

  const loadRankings = async (showLoadingSpinner = true) => {
    console.log('[RankingScreen] loadRankings 시작');
    try {
      if (showLoadingSpinner) {
        setLoading(true);
      }
      
      console.log('[RankingScreen] API 호출 전');
      const response = await userApi.getRankings();
      console.log('[RankingScreen] API 응답:', response);
      
      if (!response?.data) {
        console.warn('[RankingScreen] 응답 데이터 없음');
        throw new Error('랭킹 데이터가 없습니다.');
      }

      // 데이터 정규화 및 검증
      const normalizedRankings = response.data.map((rank, index) => {
        console.log(`[RankingScreen] 랭킹 데이터 정규화 #${index + 1}:`, rank);
        
        const normalized = {
          ...rank,
          id: rank.id || `temp-${index}`,
          username: rank.username || '알 수 없음',
          rank_name: rank.rank_name || '등급 없음',
          rank_color: rank.rank_color || colors.border,
          total_score: Number(rank.total_score) || 0,
          total_posts: Number(rank.total_posts) || 0,
          total_comments: Number(rank.total_comments) || 0,
          total_received_likes: Number(rank.total_received_likes) || 0,
          total_received_comments: Number(rank.total_received_comments) || 0,
          total_views: Number(rank.total_views) || 0
        };

        // 데이터 유효성 검사
        if (isNaN(normalized.total_score)) {
          console.error('[RankingScreen] 잘못된 총점 데이터:', rank.total_score);
        }
        
        return normalized;
      });

      console.log('[RankingScreen] 정규화된 랭킹 데이터:', normalizedRankings);
      setRankings(normalizedRankings);
    } catch (error) {
      console.error('[RankingScreen] 랭킹 로드 실패:', error);
      console.error('[RankingScreen] 에러 상세:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      Alert.alert(
        '오류',
        '랭킹 정보를 불러오는데 실패했습니다.',
        [
          { 
            text: '다시 시도', 
            onPress: () => {
              console.log('[RankingScreen] 재시도 시작');
              loadRankings();
            }
          }
        ]
      );
      setRankings([]);
    } finally {
      setLoading(false);
      console.log('[RankingScreen] loadRankings 완료');
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadRankings(false);
    setRefreshing(false);
  }, []);

  const renderItem = ({ item, index }) => {
    console.log(`[RankingScreen] 랭킹 항목 렌더링 #${index + 1}:`, {
      id: item.id,
      username: item.username,
      total_score: item.total_score
    });
    
    return (
      <View style={[
        styles.row,
        user?.id === item.id && styles.highlightedRow
      ]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.cell, styles.rankText]}>
            {index + 1 <= 3 ? 
              ['🥇', '🥈', '🥉'][index] : 
              (index + 1).toString()
            }
          </Text>
        </View>
        <View style={styles.userInfoContainer}>
          <View style={styles.nameRankContainer}>
            <Text style={[styles.username, user?.id === item.id && styles.highlightedText]}>
              {item.username}
            </Text>
            <View style={[styles.rankBadge, { backgroundColor: item.rank_color }]}>
              <Text style={styles.rankBadgeText}>{item.rank_name}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, styles.totalScore]}>
              총점: {item.total_score?.toLocaleString() || '0'}점
            </Text>
            <View style={styles.detailScores}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>게시글</Text>
                <Text style={styles.statValue}>{item.total_posts?.toLocaleString()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>댓글</Text>
                <Text style={styles.statValue}>{item.total_comments?.toLocaleString()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>조회</Text>
                <Text style={styles.statValue}>{item.total_views?.toLocaleString()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>좋아요</Text>
                <Text style={styles.statValue}>{item.total_received_likes?.toLocaleString()}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>받은댓글</Text>
                <Text style={styles.statValue}>{item.total_received_comments?.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>유저 랭킹</Text>
      <FlatList
        data={rankings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>랭킹 정보가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...typography.h1,
    textAlign: 'center',
    padding: spacing.md,
  },
  listContainer: {
    padding: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.xs,
    borderRadius: 8,
    elevation: 2,
  },
  highlightedRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rankContainer: {
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...typography.h2,
    color: colors.text.primary,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  nameRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  username: {
    ...typography.subtitle,
    fontSize: 14,
    marginRight: spacing.xs,
  },
  highlightedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  rankBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
  },
  rankBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.background,
  },
  statsContainer: {
    marginTop: spacing.xxs,
  },
  statsText: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: typography.caption.fontSize * 1.4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  detailScores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xxs,
    gap: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    borderRadius: 4,
    width: 'calc(20% - 1px)',
  },
  statLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
  },
  statValue: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginLeft: spacing.xxs,
  },
  totalScore: {
    ...typography.subtitle,
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: spacing.xxs,
  },
});

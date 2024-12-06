import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { userApi } from '@app/_lib/api/userApi';
import { useAuth } from '@app/_lib/hooks';

export default function RankingScreen() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const loadRankings = async () => {
    console.log('[RankingScreen] loadRankings 시작');
    try {
      setLoading(true);
      console.log('[RankingScreen] API 호출 전');
      const response = await userApi.getRankings();
      console.log('[RankingScreen] API 응답:', response);
      
      if (!response?.data) {
        console.warn('[RankingScreen] 응답 데이터 없음');
        setRankings([]);
        return;
      }

      setRankings(response.data);
    } catch (error) {
      console.error('[RankingScreen] 랭킹 로드 실패:', error);
      Alert.alert('오류', '랭킹 정보를 불러오는데 실패했습니다.');
      setRankings([]);
    } finally {
      setLoading(false);
      console.log('[RankingScreen] loadRankings 완료');
    }
  };

  const renderItem = ({ item, index }) => (
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
          <Text style={styles.statsText}>총점: {item.total_score}</Text>
          <Text style={styles.statsText}>게시글: {item.total_posts}</Text>
          <Text style={styles.statsText}>댓글: {item.total_comments}</Text>
          <Text style={styles.statsText}>조회수: {item.total_views}</Text>
          <Text style={styles.statsText}>좋아요: {item.total_likes}</Text>
        </View>
      </View>
    </View>
  );

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
    marginBottom: spacing.sm,
    borderRadius: 8,
    elevation: 2,
  },
  highlightedRow: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rankContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...typography.h2,
    color: colors.text.primary,
  },
  userInfoContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  nameRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  username: {
    ...typography.subtitle,
    marginRight: spacing.sm,
  },
  highlightedText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  rankBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  rankBadgeText: {
    ...typography.caption,
    color: colors.background,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statsText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});

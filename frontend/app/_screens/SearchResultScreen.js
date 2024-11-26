import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { SearchContext } from '@app/_context/SearchContext';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SearchResultScreen() {
  const router = useRouter();
  const { searchQuery, searchResults, loading, error } = useContext(SearchContext);

  // 검색 결과를 조회수와 날짜 기준으로 정렬
  const sortedResults = searchResults
    .sort((a, b) => {
      // 먼저 조회수로 정렬
      const viewCountA = parseInt(a.statistics?.viewCount || '0');
      const viewCountB = parseInt(b.statistics?.viewCount || '0');
      if (viewCountB !== viewCountA) {
        return viewCountB - viewCountA;
      }
      // 조회수가 같으면 날짜로 정렬
      const dateA = new Date(a.snippet?.publishedAt || 0);
      const dateB = new Date(b.snippet?.publishedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 20); // 상위 20개만 표시

  const handleVideoSelect = (videoId) => {
    router.push(`/video-detail?videoId=${videoId}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.searchQuery}>"{searchQuery}" 검색 결과</Text>
        <Text style={styles.resultCount}>
          총 {sortedResults.length}개의 영상
        </Text>
      </View>

      {sortedResults.length > 0 ? (
        <View style={styles.videoGrid}>
          {sortedResults.map((video) => (
            <Pressable
              key={video.id?.videoId || video.id}
              style={styles.videoCard}
              onPress={() => handleVideoSelect(video.id?.videoId || video.id)}
            >
              <View style={styles.thumbnailContainer}>
                <View style={styles.thumbnail}>
                  <img
                    src={video.snippet?.thumbnails?.medium?.url}
                    alt={video.snippet?.title}
                    style={styles.thumbnailImage}
                  />
                </View>
                <View style={styles.videoStats}>
                  <FontAwesome5 name="eye" size={12} color={colors.text.secondary} />
                  <Text style={styles.statsText}>
                    {parseInt(video.statistics?.viewCount || 0).toLocaleString()}
                  </Text>
                  <FontAwesome5 name="calendar-alt" size={12} color={colors.text.secondary} />
                  <Text style={styles.statsText}>
                    {new Date(video.snippet?.publishedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.snippet?.title}
                </Text>
                <Text style={styles.channelTitle} numberOfLines={1}>
                  {video.snippet?.channelTitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          <Text style={styles.emptySubText}>다른 검색어로 시도해보세요.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  searchQuery: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  resultCount: {
    ...typography.body,
    color: colors.text.secondary,
  },
  videoGrid: {
    gap: spacing.lg,
  },
  videoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.border,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  videoStats: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.xs,
    borderRadius: 16,
    gap: spacing.xs,
  },
  statsText: {
    ...typography.caption,
    color: colors.background,
    marginRight: spacing.sm,
  },
  videoInfo: {
    padding: spacing.md,
  },
  videoTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  channelTitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 
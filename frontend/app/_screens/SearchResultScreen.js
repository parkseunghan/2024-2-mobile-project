import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { SearchContext } from '@app/_context/SearchContext';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useRouter } from 'expo-router';

export default function SearchResultScreen() {
  const router = useRouter();
  const { searchQuery, searchResults, loading, error } = useContext(SearchContext);

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
          총 {searchResults.length}개의 결과
        </Text>
      </View>

      {searchResults.length > 0 ? (
        <View style={styles.videoListContainer}>
          {searchResults.map((video) => (
            <VideoList
              key={video.id}
              videos={[video]}
              onVideoSelect={handleVideoSelect}
              style={styles.videoList}
            />
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
    flexGrow: 1,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchQuery: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  resultCount: {
    ...typography.body,
    color: colors.text.secondary,
  },
  videoListContainer: {
    padding: spacing.md,
  },
  videoList: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.xxl,
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
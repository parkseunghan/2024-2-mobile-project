import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { PostCard } from '@app/_components/community/PostCard';
import { SearchContext } from '@app/_context/SearchContext';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useRouter } from 'expo-router';
import { usePosts } from '@app/_context/PostContext';

export default function SearchResultScreen() {
  const router = useRouter();
  const { searchQuery, searchResults, loading, error } = useContext(SearchContext);
  const { posts } = usePosts();
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' 또는 'posts'

  // 검색어와 관련된 게시물 필터링
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoSelect = (videoId) => {
    router.push(`/video-detail?videoId=${videoId}`);
  };

  const handlePostPress = (post) => {
    router.push(`/post/${post.id}`);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.searchQuery}>"{searchQuery}" 검색 결과</Text>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
            영상 ({searchResults.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            게시물 ({filteredPosts.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'videos' ? (
          // 영상 탭 내용
          <View style={styles.videoContainer}>
            {searchResults.length > 0 ? (
              searchResults.map((video) => (
                <VideoList
                  key={video.id}
                  videos={[video]}
                  onVideoSelect={handleVideoSelect}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>검색된 영상이 없습니다.</Text>
              </View>
            )}
          </View>
        ) : (
          // 게시물 탭 내용
          <View style={styles.postsContainer}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPress={() => handlePostPress(post)}
                  style={styles.postCard}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>검색된 게시물이 없습니다.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
  },
  searchQuery: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    padding: spacing.md,
  },
  postsContainer: {
    padding: spacing.md,
  },
  postCard: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
}); 
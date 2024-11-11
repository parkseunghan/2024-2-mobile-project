import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SearchBar } from '@app/_components/main/SearchBar';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { VideoList } from '@app/_components/main/VideoList';
import VideoDetailScreen from '@app/_screens/VideoDetailScreen';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { searchVideos } from '@app/_utils/youtubeApi';

const MainScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const searchResults = await searchVideos(searchQuery);
      setVideos(searchResults);
    } catch (error) {
      console.error('검색 에러:', error);
      setError(
        error.response?.data?.error?.message || 
        '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId) => {
    console.log('선택된 카테고리:', categoryId);
  };

  const handleVideoSelect = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const handleBackPress = () => {
    setSelectedVideoId(null);
  };

  if (selectedVideoId) {
    return <VideoDetailScreen videoId={selectedVideoId} onBack={handleBackPress} />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmit={handleSearch}
      />
      <CategoryButtons onCategoryPress={handleCategoryPress} />
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <VideoList 
          videos={videos} 
          error={error} 
          onVideoSelect={handleVideoSelect}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.md,
  },
  centerContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
});

export default MainScreen;
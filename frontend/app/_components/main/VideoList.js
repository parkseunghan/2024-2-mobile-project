import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VideoCard } from './VideoCard';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 비디오 목록 컴포넌트
 * - 비디오 카드들의 목록을 표시
 * - 에러 상태와 빈 상태 처리
 * 
 * @param {Array} videos - 비디오 데이터 배열
 * @param {string} error - 에러 메시지
 * @param {Function} onVideoSelect - 비디오 선택 핸들러
 */
export const VideoList = ({ videos, error, onVideoSelect }) => {
  if (error) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!videos?.length) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.emptyText}>
          {error || '검색 결과가 없습니다. 다른 검색어를 시도해보세요.'}
        </Text>
      </View>
    );
  }

  const handleVideoPress = (videoId) => {
    onVideoSelect?.(videoId);
  };

  return (
    <View style={styles.container}>
      {videos.map((video) => (
        <VideoCard
          key={video.id?.videoId || video.id || Math.random().toString()}
          video={video}
          style={styles.videoCard}
          onPress={() => handleVideoPress(video.id?.videoId || video.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  videoCard: {
    width: '100%',
    marginBottom: spacing.md,
  },
  messageContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
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
export const VideoList = ({ videos, onVideoSelect }) => {
  return (
    <View style={styles.container}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          style={styles.videoCard}
          onPress={() => onVideoSelect(video.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  videoCard: {
    width: '100%',
    marginBottom: spacing.md,
  }
});
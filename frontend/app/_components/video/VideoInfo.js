import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const VideoInfo = ({ videoDetails, playing, onPlayPress }) => {
  const { snippet, statistics } = videoDetails;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{snippet.title}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.channelTitle}>{snippet.channelTitle}</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            조회수 {Number(statistics.viewCount).toLocaleString()}회
          </Text>
          <Text style={styles.statText}>
            좋아요 {Number(statistics.likeCount).toLocaleString()}개
          </Text>
        </View>
      </View>
      <Pressable style={styles.playButton} onPress={onPlayPress}>
        <FontAwesome5 
          name={playing ? "pause" : "play"} 
          size={16} 
          color={colors.background} 
        />
        <Text style={styles.playButtonText}>
          {playing ? "일시정지" : "재생"}
        </Text>
      </Pressable>
      <Text style={styles.description}>{snippet.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  statsContainer: {
    marginBottom: spacing.md,
  },
  channelTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  playButtonText: {
    ...typography.button,
    color: colors.background,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
  },
}); 
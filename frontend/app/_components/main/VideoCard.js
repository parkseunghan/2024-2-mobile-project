import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

const decodeHTMLEntities = (text) => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
};

export const VideoCard = ({ video, style, onPress }) => {
  const thumbnailUrl = 
    video.snippet.thumbnails.maxres?.url ||
    video.snippet.thumbnails.high?.url ||
    video.snippet.thumbnails.medium.url;

  const decodedTitle = decodeHTMLEntities(video.snippet.title);
  const decodedChannelTitle = decodeHTMLEntities(video.snippet.channelTitle);

  return (
    <Pressable 
      onPress={() => onPress?.()}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text 
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {decodedTitle}
        </Text>
        <Text 
          style={styles.channelTitle}
          numberOfLines={1}
        >
          {decodedChannelTitle}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbnail: {
    width: '100%',
    height: 140,
    backgroundColor: colors.border,
  },
  infoContainer: {
    padding: spacing.sm,
  },
  title: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  channelTitle: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.secondary,
  },
}); 
import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { VideoCard } from './VideoCard';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Ionicons } from '@expo/vector-icons';

export const VideoList = ({ videos, error, onVideoSelect }) => {
  const scrollViewRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const CARD_WIDTH = 280;
  const CARD_MARGIN = spacing.md;
  const CARD_TOTAL_WIDTH = CARD_WIDTH + CARD_MARGIN;

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

  const handleScroll = (event) => {
    setScrollPosition(event.nativeEvent.contentOffset.x);
  };

  const handleLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setViewportWidth(width);
  };

  const handleContentSizeChange = (width) => {
    setContentWidth(width);
  };

  const maxScroll = Math.max(0, contentWidth - viewportWidth);

  const scrollToOffset = (direction) => {
    let newOffset;
    if (direction === 'next') {
      newOffset = Math.min(scrollPosition + CARD_TOTAL_WIDTH, maxScroll);
    } else {
      newOffset = Math.max(scrollPosition - CARD_TOTAL_WIDTH, 0);
    }

    scrollViewRef.current?.scrollTo({
      x: newOffset,
      animated: true,
    });
  };

  const isStartReached = scrollPosition <= 0;
  const isEndReached = scrollPosition >= maxScroll - 2;

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Pressable 
          style={[styles.navButton, isStartReached && styles.navButtonDisabled]} 
          onPress={() => !isStartReached && scrollToOffset('prev')}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isStartReached ? colors.text.disabled : colors.text.primary} 
          />
        </Pressable>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          snapToInterval={CARD_TOTAL_WIDTH}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          onLayout={handleLayout}
          onContentSizeChange={handleContentSizeChange}
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id?.videoId || video.id || Math.random().toString()}
              video={video}
              style={styles.videoCard}
              onPress={() => handleVideoPress(video.id?.videoId || video.id)}
            />
          ))}
        </ScrollView>

        <Pressable 
          style={[styles.navButton, isEndReached && styles.navButtonDisabled]} 
          onPress={() => !isEndReached && scrollToOffset('next')}
        >
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={isEndReached ? colors.text.disabled : colors.text.primary} 
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  videoCard: {
    width: 280,
    marginRight: spacing.md,
  },
  navButton: {
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: spacing.xs,
  },
  navButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
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
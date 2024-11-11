import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions,
  ActivityIndicator,
  Platform,
  Linking,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getVideoDetails } from '@app/_utils/youtubeApi';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { VideoInfo } from '@app/_components/video/VideoInfo';
import { Header } from '@app/_components/common/Header';

// ... (기존 상수 및 VideoPlayer 컴포넌트 코드는 동일)

const VideoDetailScreen = () => {
  // ... (기존 상태 및 효과 코드는 동일)

  return (
    <>
      <Stack.Screen 
        options={{
          header: () => (
            <Header 
              title={videoDetails?.snippet?.channelTitle || '동영상 상세'} 
              showBackButton={true}
            />
          ),
        }} 
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* ... (나머지 JSX 코드는 동일) */}
      </SafeAreaView>
    </>
  );
};

// ... (스타일 코드는 동일)

export default VideoDetailScreen; 
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Header } from '@app/_components/common/Header';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { VideoDetail } from '@app/_components/video/VideoDetail';
import { getVideoDetails } from '@app/_utils/youtubeApi';
import { colors } from '@app/_styles/colors';
import { Platform } from 'react-native';

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!id) {
      router.replace('/(tabs)/home');
      return;
    }
    loadVideoDetails();
  }, [id]);

  const loadVideoDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const details = await getVideoDetails(id);
      if (!details) {
        throw new Error('비디오를 찾을 수 없습니다.');
      }
      setVideoDetails(details);
    } catch (err) {
      console.error('Video details error:', err);
      setError(err.message || '영상을 불러오는데 실패했습니다.');
      // 에러 발생 시에도 홈으로 리다이렉트하지 않음
    } finally {
      setLoading(false);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const handlePlayPress = Platform.OS === 'web' 
    ? () => Linking.openURL(`https://www.youtube.com/watch?v=${id}`)
    : () => setPlaying(!playing);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          header: () => (
            <Header 
              title={videoDetails?.snippet?.channelTitle || '동영상 상세'} 
              showBackButton={true}
              onBackPress={handleBack}
            />
          ),
        }} 
      />
      
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState 
          message={error}
          onRetry={loadVideoDetails}  // 재시도 기능 추가
        />
      ) : (
        <ScrollView 
          style={styles.container}
          bounces={false}
          scrollEventThrottle={16}
        >
          <VideoDetail
            videoId={id}
            videoDetails={videoDetails}
            playing={playing}
            onStateChange={onStateChange}
            onPlayPress={handlePlayPress}
          />
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { VideoDetail } from '@app/_components/video/VideoDetail';
import { getVideoDetails } from '@app/_utils/youtubeApi';
import { colors } from '@app/_styles/colors';
import { Platform } from 'react-native';

const VideoDetailScreen = ({ videoId, onBack }) => {
  const router = useRouter();
  const [videoDetails, setVideoDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    loadVideoDetails();
  }, [videoId]);

  const loadVideoDetails = async () => {
    try {
      setLoading(true);
      const details = await getVideoDetails(videoId);
      setVideoDetails(details);
    } catch (err) {
      setError('영상을 불러오는데 실패했습니다.');
      console.error('Video details error:', err);
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
    ? () => Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`)
    : () => setPlaying(!playing);

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <ScrollView 
          style={styles.content}
          bounces={false}
          scrollEventThrottle={16}
        >
          <VideoDetail
            videoId={videoId}
            videoDetails={videoDetails}
            playing={playing}
            onStateChange={onStateChange}
            onPlayPress={handlePlayPress}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default VideoDetailScreen; 
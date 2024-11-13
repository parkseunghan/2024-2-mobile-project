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

    useEffect(() => {
        if (!videoId) {
            setError('비디오 ID가 없습니다.');
            setLoading(false);
            return;
        }
        loadVideoDetails();
    }, [videoId]);

    const loadVideoDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading video details for ID:', videoId); // 디버깅용
            const details = await getVideoDetails(videoId);
            console.log('Received video details:', details); // 디버깅용
            if (!details) {
                throw new Error('비디오 정보를 찾을 수 없습니다.');
            }
            setVideoDetails(details);
        } catch (err) {
            console.error('Video details error:', err);
            setError(err.message || '영상을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
        }
    }, []);

    const handleSourcePress = () => {
        if (Platform.OS === 'web') {
            Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
        }
    }



    const handleRetry = () => {
        loadVideoDetails();
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <ErrorState
                message={error}
                onRetry={handleRetry}
            />
        );
    }

    if (!videoDetails) {
        return (
            <ErrorState
                message="비디오 정보를 찾을 수 없습니다."
                onRetry={handleRetry}
            />
        );
    }

    return (
        <ScrollView
            style={styles.container}
            bounces={false}
            scrollEventThrottle={16}
        >
            <VideoDetail
                videoId={videoId}
                videoDetails={videoDetails}
                onStateChange={onStateChange}
                onSourcePress={handleSourcePress}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});

export default VideoDetailScreen; 
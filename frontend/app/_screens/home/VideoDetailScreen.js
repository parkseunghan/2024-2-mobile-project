import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Linking, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { VideoDetail } from '@app/_components/video/VideoDetail';
import { youtubeApi } from '@app/_lib/api';
import { colors } from '@app/_styles/colors';

export default function VideoDetailScreen({ videoId }) {
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
        console.log('Loading video details for:', videoId);
        loadVideoDetails();
    }, [videoId]);

    const loadVideoDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await youtubeApi.getVideoDetails(videoId);
            console.log('Video details response:', response);
            
            if (!response.data?.video) {
                throw new Error('비디오 정보를 불러올 수 없습니다.');
            }
            
            setVideoDetails(response.data.video);
        } catch (err) {
            console.error('Video details error:', err);
            setError(err.message || '영상을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            // 영상이 끝났을 때의 처리
        }
    }, []);

    const handleSourcePress = () => {
        if (videoId) {
            Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
}); 
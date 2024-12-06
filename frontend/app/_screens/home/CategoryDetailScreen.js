import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { CATEGORIES } from '@app/_config/constants';
import { youtubeApi } from '@app/_lib/api';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useRouter } from 'expo-router';

export default function CategoryDetailScreen({ categoryId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);

    // 현재 카테고리 찾기
    const category = CATEGORIES.find(cat => 
        cat.subItems.some(sub => sub.id === categoryId)
    );
    const subItem = category?.subItems.find(sub => sub.id === categoryId);

    useEffect(() => {
        if (subItem) {
            loadCategoryContent();
        }
    }, [subItem]);

    const loadCategoryContent = async () => {
        try {
            setLoading(true);
            console.log('Loading category content for:', categoryId);
            
            const response = await youtubeApi.getVideosByCategory(categoryId);
            console.log('API Response:', response);
            
            if (!response.data?.videos) {
                throw new Error('검색 결과가 없습니다.');
            }

            const formattedVideos = response.data.videos.map(item => ({
                id: item.id?.videoId || item.id,
                title: item.snippet?.title,
                thumbnail: item.snippet?.thumbnails?.medium?.url,
                channelTitle: item.snippet?.channelTitle,
                publishedAt: item.snippet?.publishedAt,
                description: item.snippet?.description
            }));
            
            console.log('Formatted Videos:', formattedVideos);
            setVideos(formattedVideos);
        } catch (err) {
            console.error('Category content loading error:', err);
            setError(err.message || '동영상을 불러오는데 실패했습니다.');
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoSelect = (videoId) => {
        if (videoId) {
            router.push(`/video-detail?videoId=${videoId}`);
        }
    };

    if (!category || !subItem) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>카테고리를 찾을 수 없습니다.</Text>
            </View>
        );
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{`${category.title} - ${subItem.title}`}</Text>
            </View>

            <ScrollView style={styles.content}>
                {videos.length > 0 ? (
                    <VideoList
                        videos={videos}
                        onVideoSelect={handleVideoSelect}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            검색 결과가 없습니다.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    content: {
        flex: 1,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        ...typography.body,
        color: colors.error,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    }
}); 
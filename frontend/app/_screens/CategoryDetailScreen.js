import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { PostCard } from '@app/_components/community/PostCard';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { CATEGORIES } from '@app/_config/constants';
import { searchVideos } from '@app/_utils/youtubeApi';
import { LoadingState } from '@app/_components/common/LoadingState';
import { useRouter } from 'expo-router';
import { usePosts } from '@app/_context/PostContext';

export default function CategoryDetailScreen({ categoryId }) {
    const router = useRouter();
    const { posts } = usePosts();
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('videos'); // 'videos' 또는 'posts'

    const category = CATEGORIES.find(cat => cat.id === categoryId);
    const categoryPosts = posts.filter(post => post.category === category?.title);

    useEffect(() => {
        if (category) {
            loadCategoryContent();
        }
    }, [category]);

    const loadCategoryContent = async () => {
        try {
            setLoading(true);
            const results = await searchVideos(category.searchKeywords);
            setVideos(results);
        } catch (err) {
            console.error('Category content loading error:', err);
            setError(err.message);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoSelect = (videoId) => {
        router.push(`/video-detail?videoId=${videoId}`);
    };

    const handlePostPress = (post) => {
        router.push(`/post/${post.id}`);
    };

    if (!category) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>카테고리를 찾을 수 없습니다.</Text>
            </View>
        );
    }

    if (loading) {
        return <LoadingState />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{category.title}</Text>
            </View>

            <View style={styles.tabContainer}>
                <Pressable
                    style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                    onPress={() => setActiveTab('videos')}
                >
                    <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
                        영상 ({videos.length})
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
                    onPress={() => setActiveTab('posts')}
                >
                    <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
                        게시물 ({categoryPosts.length})
                    </Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                {activeTab === 'videos' ? (
                    // 영상 탭 내용
                    <View style={styles.videoContainer}>
                        {error ? (
                            <View style={styles.messageContainer}>
                                <Text style={styles.errorText}>{error}</Text>
                                <Text style={styles.subErrorText}>
                                    현재 YouTube 영상을 불러올 수 없습니다.
                                    잠시 후 다시 시도해주세요.
                                </Text>
                            </View>
                        ) : videos.length > 0 ? (
                            <VideoList
                                videos={videos}
                                onVideoSelect={handleVideoSelect}
                                key="video-list"
                            />
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>관련 영상이 없습니다.</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    // 게시물 탭 내용
                    <View style={styles.postsContainer}>
                        {categoryPosts.length > 0 ? (
                            categoryPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onPress={() => handlePostPress(post)}
                                    style={styles.postCard}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>관련 게시물이 없습니다.</Text>
                            </View>
                        )}
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
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    videoContainer: {
        padding: spacing.md,
    },
    postsContainer: {
        padding: spacing.md,
    },
    postCard: {
        marginBottom: spacing.md,
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
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    messageContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginVertical: spacing.md,
    },
    subErrorText: {
        ...typography.caption,
        color: colors.text.secondary,
        textAlign: 'center',
    },
}); 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingState />
                </View>
            ) : (
                <>
                    <CategoryVideos 
                        videos={videos} 
                        onVideoSelect={handleVideoSelect} 
                    />
                    <CategoryPosts 
                        posts={categoryPosts} 
                        onPostPress={handlePostPress} 
                    />
                </>
            )}
        </ScrollView>
    );
}

const CategoryVideos = ({ videos, onVideoSelect }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>관련 영상</Text>
        {videos.length > 0 ? (
            <VideoList
                videos={videos}
                onVideoSelect={onVideoSelect}
            />
        ) : (
            <Text style={styles.emptyText}>관련 영상이 없습니다.</Text>
        )}
    </View>
);

const CategoryPosts = ({ posts, onPostPress }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>관련 게시물</Text>
        {posts.length > 0 ? (
            posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onPress={() => onPostPress(post)}
                    style={styles.postCard}
                />
            ))
        ) : (
            <Text style={styles.emptyText}>관련 게시물이 없습니다.</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        minHeight: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        padding: spacing.lg,
    },
    sectionTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
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
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        padding: spacing.lg,
    },
    postCard: {
        marginBottom: spacing.md,
    },
}); 
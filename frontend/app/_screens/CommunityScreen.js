import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { PostCard } from '@app/_components/community/PostCard';
import { CategoryFilter } from '@app/_components/community/CategoryFilter';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { communityApi } from '@app/_utils/api/community';
import { useAuth } from '@app/_utils/hooks/useAuth';

export default function CommunityScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [likedPosts, setLikedPosts] = useState([]);

    const categories = ['전체', '상품 리뷰', '취미', '건강·운동', '맛집', '여행', '슈퍼전대'];

    useEffect(() => {
        loadPosts(true);
        if (user) {
            loadLikedPosts();
        }
    }, [selectedCategory, user]);

    const loadLikedPosts = async () => {
        try {
            const response = await communityApi.getLikedPosts();
            setLikedPosts(response.posts || []);
        } catch (error) {
            console.error('좋아요 게시글 로드 에러:', error);
        }
    };

    const loadPosts = async (refresh = false) => {
        try {
            if (refresh) {
                setPage(1);
                setHasMore(true);
            }
            
            if (!hasMore && !refresh) return;

            setLoading(true);
            setError(null);

            const response = await communityApi.getPosts(
                selectedCategory === '전체' ? null : selectedCategory,
                refresh ? 1 : page
            );

            const newPosts = response?.posts || [];
            
            const sortedPosts = newPosts.sort((a, b) => {
                if (a.is_notice !== b.is_notice) {
                    return b.is_notice - a.is_notice;
                }
                return new Date(b.created_at) - new Date(a.created_at);
            });

            setPosts(prev => refresh ? sortedPosts : [...prev, ...sortedPosts]);
            setHasMore(newPosts.length === 10);
            setPage(prev => refresh ? 2 : prev + 1);
        } catch (error) {
            console.error('게시글 로드 에러:', error);
            setError(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePostPress = (post) => {
        router.push(`/post/${post.id}`);
    };

    const handleCreatePost = () => {
        router.push('/post/create');
    };

    const handleRefresh = () => {
        loadPosts(true);
    };

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    // 인기글 TOP3 계산
    const popularPosts = posts
        .filter(post => post.like_count >= 10)
        .sort((a, b) => b.like_count - a.like_count)
        .slice(0, 3);

    const renderPopularPost = (post) => (
        <Pressable
            key={post.id}
            style={styles.popularPostContainer}
            onPress={() => handlePostPress(post)}
        >
            {post.media_url && (
                <Image 
                    source={{ uri: post.media_url }} 
                    style={styles.popularPostImage}
                />
            )}
            <View style={styles.popularPostContent}>
                <Text style={styles.popularPostTitle}>{post.title}</Text>
                <View style={styles.popularPostStats}>
                    <Text style={styles.popularPostAuthor}>
                        {post.author_name} · {calculateTier(post.author_score)}
                    </Text>
                    <View style={styles.statsContainer}>
                        <FontAwesome5 name="heart" size={12} color={colors.primary} />
                        <Text style={styles.statText}>{post.like_count}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    // 사용자 티어 계산
    const calculateTier = (score) => {
        if (score >= 1000) return 'Platinum';
        if (score >= 500) return 'Gold';
        if (score >= 100) return 'Silver';
        return 'Bronze';
    };

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                onScrollEndDrag={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const paddingToBottom = 20;
                    if (layoutMeasurement.height + contentOffset.y >=
                        contentSize.height - paddingToBottom) {
                        loadPosts();
                    }
                }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>커뮤니티</Text>
                    <View style={styles.headerButtons}>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => router.push('/liked-posts')}
                        >
                            <FontAwesome5 name="heart" size={20} color={colors.primary} />
                        </Pressable>
                        <Pressable
                            style={styles.iconButton}
                            onPress={() => setSearchVisible(!searchVisible)}
                        >
                            <FontAwesome5 name="search" size={20} color={colors.text.primary} />
                        </Pressable>
                    </View>
                </View>

                {searchVisible && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                )}

                {/* 인기글 TOP3 섹션 */}
                {popularPosts.length > 0 && (
                    <View style={styles.popularSection}>
                        <Text style={styles.sectionTitle}>🔥 실시간 인기</Text>
                        {popularPosts.map(renderPopularPost)}
                    </View>
                )}

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                {/* 전체 게시글 섹션 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>전체 게시글</Text>
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onPress={() => handlePostPress(post)}
                        />
                    ))}
                    {filteredPosts.length === 0 && !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>현재 게시글이 없습니다.</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <Pressable
                style={styles.floatingButton}
                onPress={handleCreatePost}
            >
                <FontAwesome5 name="pen" size={24} color={colors.background} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    headerTitle: {
        ...typography.h2,
    },
    searchContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    searchInput: {
        ...typography.body,
        backgroundColor: colors.background,
        padding: spacing.sm,
        borderRadius: 8,
    },
    section: {
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    sectionTitle: {
        ...typography.h2,
        color: colors.primary,
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: `${colors.primary}15`,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    floatingButton: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    popularSection: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        marginBottom: spacing.md,
    },
    popularPostContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        backgroundColor: colors.background,
        borderRadius: 12,
        marginBottom: spacing.sm,
        elevation: 2,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    popularPostImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: spacing.md,
    },
    popularPostContent: {
        flex: 1,
    },
    popularPostTitle: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    popularPostStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    popularPostAuthor: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    iconButton: {
        padding: spacing.xs,
    },
});

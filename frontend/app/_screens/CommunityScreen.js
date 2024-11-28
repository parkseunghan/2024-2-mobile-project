import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, RefreshControl } from 'react-native';
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

export default function CommunityScreen() {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const categories = ['전체', '상품 리뷰', '취미', '건강·운동', '맛집', '여행', '슈퍼전대'];

    useEffect(() => {
        loadPosts(true);
    }, [selectedCategory]);

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
            setPosts(prev => refresh ? newPosts : [...prev, ...newPosts]);
            setHasMore(newPosts.length > 0);
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
                    <Text style={styles.headerTitle}>게시판</Text>
                    <Pressable
                        onPress={() => setSearchVisible(!searchVisible)}
                    >
                        <FontAwesome5
                            name="search"
                            size={24}
                            color={colors.text.primary}
                        />
                    </Pressable>
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

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>실시간 인기 게시물</Text>
                    {filteredPosts.filter(post => post.like_count >= 2).map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onPress={() => handlePostPress(post)}
                        />
                    ))}
                    {filteredPosts.filter(post => post.like_count >= 10).length === 0 && !loading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>현재 인기 게시물이 없습니다.</Text>
                        </View>
                    )}
                </View>
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
});

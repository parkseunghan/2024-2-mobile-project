import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { postsApi } from '@app/_lib/api/posts';
import { useAuth } from '@app/_lib/hooks';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';
import { colors } from '@app/_styles/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Button } from '@app/_components/common/Button';

export default function CommunityScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    // 게시글 무한 스크롤 쿼리
    const {
        data: allPostsData,
        fetchNextPage: fetchNextAllPosts,
        hasNextPage: hasNextAllPosts,
        isLoading: isLoadingAllPosts,
        isFetchingNextPage: isFetchingNextAllPosts
    } = useInfiniteQuery({
        queryKey: ['posts', selectedCategory, searchText],
        queryFn: ({ pageParam = 1 }) => postsApi.fetchPosts({
            page: pageParam,
            category: selectedCategory,
            search: searchText,
            searchFields: ['title', 'content', 'author_name']
        }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });

    // 좋아요한 게시글 쿼리 추가
    const {
        data: likedPostsData,
        isLoading: isLoadingLikedPosts,
    } = useQuery({
        queryKey: ['likedPosts'],
        queryFn: postsApi.fetchLikedPosts,
        enabled: !!user, // 로그인한 경우에만 실행
    });

    // 카테고리 목록 조회
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: postsApi.fetchCategories,
        staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    });

    const posts = allPostsData?.pages.flatMap(page => page.posts) ?? [];

    const renderPost = useCallback(({ item }) => {
        if (item.category === '이벤트') return null;
        return (
            <Pressable
                style={styles.postContainer}
                onPress={() => router.push(`/post/${item.id}`)}
            >
                <View style={styles.postContent}>
                    <View style={styles.postHeader}>
                        <Text style={styles.category}>{item.category}</Text>
                        <Text style={styles.postDate}>
                            {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    <Text style={styles.postTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={styles.authorContainer}>
                        <Text style={[
                            styles.authorRank,
                            { color: item.author_rank_color }
                        ]}>
                            {item.author_rank}
                        </Text>
                        <Text style={styles.authorName}>{item.author_name}</Text>
                    </View>
                    <View style={styles.postStats}>
                        <View style={styles.statItem}>
                            <Icon name="remove-red-eye" size={16} color={colors.text.secondary} />
                            <Text style={styles.statText}>{item.view_count}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <FontAwesome5
                                name="heart"
                                size={16}
                                color={item.is_liked ? colors.error : colors.text.secondary}
                            />
                            <Text style={styles.statText}>{item.like_count}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="comment" size={16} color={colors.text.secondary} />
                            <Text style={styles.statText}>{item.comment_count}</Text>
                        </View>
                    </View>
                </View>
                {item.media_url && (
                    <Image
                        source={{ uri: item.media_url }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                )}
            </Pressable>
        );
    }, []);

    // 무한 스크롤 처리
    const onEndReached = useCallback(() => {
        if (hasNextAllPosts && !isFetchingNextAllPosts) {
            fetchNextAllPosts();
        }
    }, [hasNextAllPosts, isFetchingNextAllPosts]);

    return (
        <View style={styles.container}>
            {/* 검색 입력 */}
            <View style={styles.headerSection}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="제목, 내용, 작성자로 검색"
                    value={searchText}
                    onChangeText={setSearchText}
                />

                {/* 탭 메뉴 */}
                <View style={styles.tabContainer}>
                    <Pressable
                        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                        onPress={() => setActiveTab('all')}
                    >
                        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
                            전체 게시글
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
                        onPress={() => setActiveTab('liked')}
                    >
                        <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>
                            좋아요한 글
                        </Text>
                    </Pressable>
                </View>

                {/* 카테고리 필터 */}
                {activeTab === 'all' && (
                    <ScrollView
                        horizontal
                        style={styles.categoryContainer}
                        showsHorizontalScrollIndicator={false}
                    >
                        {categories.map((category) => (
                            <Pressable
                                key={category.id}
                                onPress={() => setSelectedCategory(category.name)}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category.name && styles.categorySelected,
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category.name && styles.categoryTextSelected,
                                ]}>
                                    {category.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}
            </View>

            {activeTab === 'all' ? (
                <>
                    {/* 전체 게시글 리스트 */}
                    <FlatList
                        data={allPostsData?.pages.flatMap(page => page.posts) ?? []}
                        renderItem={renderPost}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetchingNextAllPosts ? <LoadingSpinner /> : null}
                        ListEmptyComponent={
                            !isLoadingAllPosts && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                                </View>
                            )
                        }
                    />
                </>
            ) : (
                // 좋아요 탭 컨텐츠
                !user ? (
                    <View style={styles.container}>
                        <View style={styles.messageContainer}>
                            <FontAwesome5 name="heart" size={50} color={colors.primary} style={styles.icon} />
                            <Text style={styles.title}>로그인이 필요합니다</Text>
                            <Text style={styles.subtitle}>
                                좋아요 한 게시물을 보려면 로그인이 필요합니다.
                            </Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title="로그인하기"
                                    onPress={() => router.push('/login')}
                                    variant="primary"
                                    fullWidth
                                />
                            </View>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={likedPostsData?.data?.posts ?? []}
                        renderItem={renderPost}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={
                            !isLoadingLikedPosts && (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>좋아요한 게시글이 없습니다.</Text>
                                </View>
                            )
                        }
                        ListFooterComponent={isLoadingLikedPosts ? <LoadingSpinner /> : null}
                    />
                )
            )}

            {/* 게시글 작성 버튼 */}
            <Pressable
                style={styles.floatingButton}
                onPress={() => router.push('/post/create')}
            >
                <FontAwesome5 name="plus" size={24} color={colors.background} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    likedPostsButton: {
        padding: 8
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 8,
        margin: 8,
        backgroundColor: colors.surface,
    },
    popularSection: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 8
    },
    popularTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8
    },
    popularPostContainer: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
    },
    popularPostTitle: {
        fontSize: 14,
        fontWeight: 'bold'
    },
    popularPostLikes: {
        fontSize: 12,
        color: 'gray',
        marginTop: 4
    },
    categoryContainer: {
        maxHeight: 50,
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    categoryContent: {
        alignItems: 'center',
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        height: 36,
        justifyContent: 'center',
    },
    categorySelected: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        color: colors.text.secondary,
        fontSize: 14,
    },
    categoryTextSelected: {
        color: colors.background,
    },
    postContainer: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    mediaPreviewContainer: {
        position: 'relative',
        marginRight: 16,
    },
    postImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    postContent: {
        flex: 1,
        marginRight: 8,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: colors.text.primary,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    authorRank: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 4,
    },
    authorName: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    postStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        fontSize: 12,
        color: colors.text.secondary,
        marginLeft: 4,
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    postHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    category: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    postDate: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: colors.text.secondary,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        color: colors.text.secondary,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    unauthorizedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    unauthorizedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    unauthorizedSubtitle: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    icon: {
        marginBottom: 16,
    },
    
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        backgroundColor: colors.background,
    },
    icon: {
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.sm,
        color: colors.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body1,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    headerSection: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.sm,
        zIndex: 1, // 헤더 섹션이 리스트 위에 오도록 설정
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.sm,
        margin: spacing.sm,
        backgroundColor: colors.surface,
    },
    categoryContainer: {
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.sm,
    },
    categoryButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        height: 36,
        justifyContent: 'center',
    },
});

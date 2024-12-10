import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { postsApi } from '@app/_lib/api/posts';
import { useAuth } from '@app/_lib/hooks';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';
import { colors } from '@app/_styles/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { spacing } from '@app/_styles/spacing';

export default function EventScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchText, setSearchText] = useState('');

    // 게시글 무한 스크롤 쿼리
    const {
        data: allPostsData,
        fetchNextPage: fetchNextAllPosts,
        hasNextPage: hasNextAllPosts,
        isLoading: isLoadingAllPosts,
        isFetchingNextPage: isFetchingNextAllPosts,
    } = useInfiniteQuery({
        queryKey: ['posts', searchText],
        queryFn: ({ pageParam = 1 }) =>
            postsApi.fetchPosts({
                page: pageParam,
                category: '', // 모든 카테고리로 필터링
                search: searchText,
                searchFields: ['title', 'content', 'author_name'],
            }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: 1000 * 60 * 5,
    });

    // 카테고리 목록 조회
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: postsApi.fetchCategories,
        staleTime: 1000 * 60 * 30,
    });

    const posts = allPostsData?.pages.flatMap((page) => page.posts) ?? [];

    // '공지' 카테고리의 최신 게시물 3개 가져오기
    const noticePosts = posts.filter((post) => post.category === '공지').slice(0, 3);

    // 좋아요 수가 1개 이상인 게시물 필터링 및 정렬
    const topLikedPosts = posts
        .filter((post) => post.like_count > 0)
        .sort((a, b) => {
            if (b.like_count === a.like_count) {
                return b.view_count - a.view_count;
            }
            return b.like_count - a.like_count;
        })
        .slice(0, 3);

    const renderPost = useCallback(({ item }) => {
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
                        <Text
                            style={[
                                styles.authorRank,
                                { color: item.author_rank_color },
                            ]}
                        >
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
            <ScrollView style={styles.scrollContainer}>
                {/* 배너 이미지 */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={require('../../../assets/banner.png')}
                        style={styles.bannerImage}
                    />
                </View>
                <View style={styles.headerSection}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="제목, 내용, 작성자로 검색"
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                {/* 최신 공지 게시물 리스트 */}
                {noticePosts.length > 0 && (
                    <FlatList
                        data={noticePosts}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.noticePostContainer}
                                onPress={() => router.push(`/post/${item.id}`)}
                            >
                                <View style={styles.noticePostBox}>
                                    <Text style={styles.noticePostIcon}>🔥</Text>
                                    <Text style={styles.noticePostTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View style={styles.noticePostStats}>
                                        <View style={styles.statItem}>
                                            <Icon name="remove-red-eye" size={16} color={colors.text.secondary} />
                                            <Text style={styles.statText}>{item.view_count}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <FontAwesome5 name="heart" size={16} color={colors.text.secondary} />
                                            <Text style={styles.statText}>{item.like_count}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Icon name="comment" size={16} color={colors.text.secondary} />
                                            <Text style={styles.statText}>{item.comment_count}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={<Text style={styles.noticeHeader}>공지사항</Text>}
                    />
                )}

                {/* 인기 게시물 리스트 */}
                {topLikedPosts.length > 0 && (
                    <FlatList
                        data={topLikedPosts}
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={styles.topPostContainer}
                                onPress={() => router.push(`/post/${item.id}`)}
                            >
                                <View style={styles.topPostBox}>
                                    <Text style={styles.topPostRank}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </Text>
                                    <Text style={styles.topPostTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View style={styles.topPostStats}>
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
                            </Pressable>
                        )}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={<Text style={styles.topPostsHeader}>인기 게시물</Text>}
                    />
                )}

                {/* 전체 게시글 리스트 */}
                <FlatList
                    data={posts}
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
            </ScrollView>

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
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flex: 1,
    },
    headerSection: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.sm,
        zIndex: 1,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.sm,
        margin: spacing.sm,
        backgroundColor: colors.surface,
    },
    noticePostContainer: {
        marginBottom: 3,
    },
    noticePostBox: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    noticePostIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    noticePostTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    noticePostStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    noticeHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        color: colors.text.primary,
    },
    topPostContainer: {
        marginBottom: 3,
    },
    topPostBox: {
        flexDirection: 'row',
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    topPostRank: {
        fontSize: 24,
        marginRight: 8,
    },
    topPostsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
        color: colors.text.primary,
    },
    topPostTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    topPostStats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    postContainer: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
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
    bannerContainer: {
        width: '100%',
        height: 180, // 배너 높이
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 15, // 배너 둥글게
        borderWidth: 2, // 테두리 추가
        borderColor: '#FFDE59', // 테두리 색상
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 15, // 배너 둥글게
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
});

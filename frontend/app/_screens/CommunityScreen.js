import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { postsApi } from '@app/_lib/api/posts';
import { useAuth } from '@app/_lib/hooks';
import { LoadingSpinner } from '@app/_components/common/LoadingSpinner';
import { formatTimeAgo } from '@app/_lib/utils/date';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export default function CommunityScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchText, setSearchText] = useState('');

    // 게시글 무한 스크롤 쿼리
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['posts', selectedCategory, searchText],
        queryFn: ({ pageParam = 1 }) => postsApi.fetchPosts({ 
            page: pageParam, 
            category: selectedCategory,
            search: searchText 
        }),
        getNextPageParam: (lastPage) => {
            if (lastPage.posts.length < POSTS_PER_PAGE) return undefined;
            return lastPage.nextPage;
        }
    });

    // 인기 게시글 쿼리
    const { data: popularPosts } = useQuery({
        queryKey: ['posts', 'popular'],
        queryFn: postsApi.fetchPopularPosts
    });

    // 카테고리 목록 조회
    const { data: categories = [], isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: postsApi.fetchCategories,
        onError: (error) => {
            console.error('카테고리 목록 조회 에러:', error);
        }
    });

    const renderPost = useCallback(({ item }) => (
        <Pressable
            style={styles.postContainer}
            onPress={() => router.push(`/posts/${item.id}`)}
        >
            {item.media_url && (
                <View style={styles.mediaPreviewContainer}>
                    <Image source={{ uri: item.media_url }} style={styles.postImage} />
                </View>
            )}
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postAuthor}>
                    {`${item.author.username} (${item.author.rank.name}) · ${formatTimeAgo(item.created_at)}`}
                </Text>
                <View style={styles.postStats}>
                    <View style={styles.postStat}>
                        <Icon name="thumb-up" size={16} color={colors.gray[500]} />
                        <Text style={styles.statText}>{item.like_count}</Text>
                    </View>
                    <View style={styles.postStat}>
                        <Icon name="comment" size={16} color={colors.gray[500]} />
                        <Text style={styles.statText}>{item.comment_count}</Text>
                    </View>
                    <View style={styles.postStat}>
                        <Icon name="visibility" size={16} color={colors.gray[500]} />
                        <Text style={styles.statText}>{item.view_count}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    ), []);

    // 무한 스크롤 처리
    const onEndReached = useCallback(() => {
        if (hasNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [hasNextPage, isLoading]);

    return (
        <View style={styles.container}>
            {/* 헤더 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>게시판</Text>
                <Link href="/liked-posts" asChild>
                    <Pressable style={styles.likedPostsButton}>
                        <Icon name="favorite" size={24} color="#ff5252" />
                    </Pressable>
                </Link>
            </View>

            {/* 검색 입력 */}
            <TextInput
                style={styles.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* 게시글 리스트 */}
            <FlatList
                data={data?.pages.flatMap(page => page.posts) ?? []}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={
                    <>
                        {/* 인기글 섹션 */}
                        {popularPosts?.length > 0 && (
                            <View style={styles.popularSection}>
                                <Text style={styles.popularTitle}>인기글 TOP3</Text>
                                {popularPosts.map(post => (
                                    <Pressable
                                        key={post.id}
                                        style={styles.popularPostContainer}
                                        onPress={() => router.push(`/posts/${post.id}`)}
                                    >
                                        <Text style={styles.popularPostTitle}>{post.title}</Text>
                                        <Text style={styles.popularPostLikes}>
                                            {`조회 ${post.view_count} · 좋아요 ${post.like_count}`}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}

                        {/* 카테고리 필터 */}
                        <ScrollView horizontal style={styles.categoryContainer}>
                            {!categoriesLoading && categories.map((category) => (
                                <Pressable
                                    key={category.id || category.name}
                                    onPress={() => setSelectedCategory(category.name)}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory === category.name && styles.categorySelected,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selectedCategory === category.name && styles.categoryTextSelected,
                                        ]}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </>
                }
                ListFooterComponent={isLoading ? <LoadingSpinner /> : null}
            />

            {/* 게시글 작성 버튼 */}
            <Link href="/post/create" asChild>
                <Pressable style={styles.floatingButton}>
                    <Icon name="add" size={24} color={colors.white} />
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
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
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        margin: 8,
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
        flexDirection: 'row', 
        padding: 8 
    },
    categoryButton: { 
        paddingHorizontal: 12, 
        paddingVertical: 4, 
        marginHorizontal: 4, 
        backgroundColor: '#eee',
        borderRadius: 16
    },
    categorySelected: { 
        backgroundColor: '#007BFF' 
    },
    categoryText: { 
        color: '#555' 
    },
    categoryTextSelected: { 
        color: '#fff' 
    },
    postContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    mediaPreviewContainer: {
        position: 'relative',
        marginRight: 16,
    },
    postImage: { 
        width: 50, 
        height: 50, 
        borderRadius: 25 
    },
    postContent: { 
        flex: 1 
    },
    postTitle: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    postAuthor: { 
        fontSize: 12, 
        color: '#555' 
    },
    postStats: {
        flexDirection: 'row',
        marginTop: 8,
    },
    postStat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: { 
        marginLeft: 4, 
        fontSize: 12, 
        color: '#555' 
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007BFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
});

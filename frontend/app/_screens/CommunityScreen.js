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
        isLoading,
        isFetchingNextPage
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

    // 카테고리 목록 조회
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: postsApi.fetchCategories,
        staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    });

    const posts = data?.pages.flatMap(page => page.posts) ?? [];

    const renderPost = useCallback(({ item }) => (
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
                        <Icon 
                            name="thumb-up" 
                            size={16} 
                            color={item.is_liked ? colors.primary : colors.text.secondary} 
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
    ), []);

    // 무한 스크롤 처리
    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage]);

    return (
        <View style={styles.container}>
            {/* 검색 입력 */}
            <TextInput
                style={styles.searchInput}
                placeholder="제목, 내용, 작성로 검색"
                value={searchText}
                onChangeText={setSearchText}
            />

            {/* 카테고리 필터 */}
            <ScrollView 
                horizontal 
                style={styles.categoryContainer}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryContent}
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

            {/* 게시글 리스트 */}
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id.toString()}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingNextPage ? <LoadingSpinner /> : null}
                ListEmptyComponent={
                    !isLoading && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>게시글이 없습니다.</Text>
                        </View>
                    )
                }
            />

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
});

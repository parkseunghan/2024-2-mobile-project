import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { PostCard } from '@app/_components/community/PostCard';
import { CategoryFilter } from '@app/_components/community/CategoryFilter';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { communityApi } from '@app/_lib/api';
import { useAuth } from '@app/_lib/hooks';
import { typography } from '@app/_styles/typography';

export default function CommunityScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'liked'
    const [allPosts, setAllPosts] = useState([]); // 전체 게시글 저장
    const [filteredPosts, setFilteredPosts] = useState([]); // 필터링된 게시글

    const categories = ['전체', '상품 리뷰', '취미', '건강·운동', '맛집', '여행', '슈퍼전대'];

    // 게시글 목록 로드
    const loadPosts = async (refresh = false) => {
        try {
            if (refresh) {
                setPage(1);
                setHasMore(true);
            }
            
            if (!hasMore && !refresh) return;

            setLoading(true);
            setError(null);

            let response;
            try {
                if (activeTab === 'liked') {
                    response = await communityApi.getLikedPosts();
                } else {
                    response = await communityApi.getPosts(
                        selectedCategory === '전체' ? null : selectedCategory,
                        refresh ? 1 : page
                    );
                }

                const newPosts = response?.posts || [];
                
                if (refresh) {
                    setAllPosts(newPosts);
                    setFilteredPosts(newPosts);
                } else {
                    setAllPosts(prev => [...prev, ...newPosts]);
                    setFilteredPosts(prev => [...prev, ...newPosts]);
                }
                
                setHasMore(newPosts.length === 10);
                setPage(prev => refresh ? 2 : prev + 1);
            } catch (err) {
                console.error('API 호출 에러:', err);
                setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
                setAllPosts([]);
                setFilteredPosts([]);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 초기 로드 및 카테고리/탭 변경 시 로드
    useEffect(() => {
        loadPosts(true);
    }, [selectedCategory, activeTab]);

    // 검색어 변경 시 필터링
    const handleSearchChange = (text) => {
        setSearchQuery(text);
        
        // 카테고리와 검색어로 필터링
        const filtered = allPosts.filter(post => {
            const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
            const matchesSearch = text.trim() === '' || 
                post.title.toLowerCase().includes(text.toLowerCase()) ||
                post.content.toLowerCase().includes(text.toLowerCase()) ||
                post.author?.username.toLowerCase().includes(text.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });

        setFilteredPosts(filtered);
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        
        // 카테고리와 현재 검색어로 필터링
        const filtered = allPosts.filter(post => {
            const matchesCategory = category === '전체' || post.category === category;
            const matchesSearch = searchQuery.trim() === '' || 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.author?.username.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });

        setFilteredPosts(filtered);
    };

    // 게시글 클릭 핸들러
    const handlePostPress = (post) => {
        router.push({
            pathname: `/post/${post.id}`,
            params: { id: post.id }
        });
    };

    // 새 게시글 작성 핸들러
    const handleCreatePost = () => {
        if (!user) {
            Alert.alert('알림', '로그인이 필요한 기능입니다.');
            return;
        }
        router.push('/post/create');
    };

    // 새로고침 핸들러
    const handleRefresh = () => {
        setRefreshing(true);
        loadPosts(true);
    };

    if (loading && !refreshing) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <View style={styles.container}>
            {/* 탭 버튼 */}
            <View style={styles.tabContainer}>
                <Pressable
                    style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text 
                        style={[
                            styles.tabText, 
                            activeTab === 'all' && styles.activeTabText
                        ]}
                        numberOfLines={1}
                    >
                        전체 게시글
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.tabButton, activeTab === 'liked' && styles.activeTab]}
                    onPress={() => {
                        if (!user) {
                            Alert.alert('알림', '로그인이 필요한 기능입니다.');
                            return;
                        }
                        setActiveTab('liked');
                    }}
                >
                    <Text 
                        style={[
                            styles.tabText, 
                            activeTab === 'liked' && styles.activeTabText
                        ]}
                        numberOfLines={1}
                    >
                        좋아요 모음
                    </Text>
                </Pressable>
            </View>

            {/* 검색바 */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    placeholder="제목, 내용, 작성자로 검색..."
                />
                {searchQuery ? (
                    <Pressable 
                        style={styles.clearButton} 
                        onPress={() => handleSearchChange('')}
                    >
                        <FontAwesome5 name="times" size={16} color={colors.text.secondary} />
                    </Pressable>
                ) : (
                    <FontAwesome5 
                        name="search" 
                        size={16} 
                        color={colors.text.secondary}
                        style={styles.searchIcon}
                    />
                )}
            </View>

            {activeTab === 'all' && (
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={handleCategoryChange}
                />
            )}

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                    
                    if (isCloseToBottom && !loading && hasMore && !searchQuery) {
                        loadPosts();
                    }
                }}
                scrollEventThrottle={400}
            >
                {filteredPosts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onPress={() => handlePostPress(post)}
                    />
                ))}
                {filteredPosts.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery 
                                ? '검색 결과가 없습니다.' 
                                : '게시글이 없습니다.'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <Pressable
                style={styles.floatingButton}
                onPress={handleCreatePost}
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
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 16,
        color: colors.text.secondary,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        ...typography.body,
    },
    searchButton: {
        width: 40,
        height: 40,
        backgroundColor: colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: spacing.md,
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

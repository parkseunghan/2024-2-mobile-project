import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, FlatList } from 'react-native';
import { useAuth } from '@app/_lib/hooks';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '@app/_lib/api/posts';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { FontAwesome5 } from '@expo/vector-icons';

/**
 * 메인 화면 컴포넌트
 * - 카테고리 버튼 목록 표시
 * - 사용자 상태에 따른 배너 표시
 * - 인기 게시물 표시
 */
const MainScreen = () => {
    const { user } = useAuth();

    // 인기 게시물 쿼리 추가
    const {
        data: topPostsData,
        isLoading: isLoadingTopPosts,
    } = useQuery({
        queryKey: ['topPosts'],
        queryFn: async () => {
            const response = await postsApi.fetchPosts({
                category: '', // 모든 카테고리
                search: '',
                searchFields: ['title', 'content', 'author_name'],
            });
            // 이벤트와 공지를 제외한 게시물 필터링
            const filteredPosts = response.posts.filter(post => post.category !== '이벤트' && post.category !== '공지');
            // 좋아요 수와 조회수가 많은 상위 3개 게시물 정렬
            return filteredPosts.sort((a, b) => {
                const totalA = a.like_count + a.view_count;
                const totalB = b.like_count + b.view_count;
                return totalB - totalA; // 내림차순 정렬
            }).slice(0, 3); // 상위 3개
        },
        staleTime: 1000 * 60 * 30, // 30분간 캐시 유지
    });

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {/* 사용자 상태에 따른 배너 */}
            <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>
                    {user ? "오늘의 추천 영상" : "현재 비회원으로 이용 중입니다."}
                </Text>
                <Text style={styles.bannerSubtitle}>
                    {user ? "오늘의 추천 영상을 확인해보세요." : "추가 서비스를 이용하시려면 로그인이 필요합니다."}
                </Text>
            </View>

            {/* 카테고리 버튼 목록 */}
            <CategoryButtons />
            
            {/* 이벤트 배너 */}
            <Pressable onPress={() => router.push('/event')} style={styles.eventBannerContainer}>
                <Image
                    source={require('../../../assets/banner.png')}
                    style={styles.eventBannerImage}
                    resizeMode="cover"
                />
            </Pressable>

            {/* 인기 게시물 섹션 */}
            <View style={styles.popularSection}>
                <Text style={styles.popularTitle}>인기 게시물</Text>
                {isLoadingTopPosts ? (
                    <Text>로딩 중...</Text>
                ) : (
                    <FlatList
                        data={topPostsData ?? []}
                        renderItem={({ item }) => (
                            <Pressable
                                style={styles.popularPostContainer}
                                onPress={() => router.push(`/post/${item.id}`)}
                            >
                                <View style={styles.postContent}>
                                    <View style={styles.postHeader}>
                                        <Text style={styles.category}>{item.category}</Text>
                                        <Text style={styles.postDate}>
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                    <Text style={styles.popularPostTitle}>{item.title}</Text>
                                    <View style={styles.postStats}>
                                        <View style={styles.statItem}>
                                            <Icon name="remove-red-eye" size={16} color={colors.text.secondary} />
                                            <Text style={styles.statText}>{item.view_count}</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <FontAwesome5 name="heart" size={16} color={item.is_liked ? colors.error : colors.text.secondary} />
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
                        ListEmptyComponent={<Text>인기 게시물이 없습니다.</Text>}
                    />
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        padding: spacing.md,
    },
    bannerContainer: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.lg,
    },
    bannerTitle: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    bannerSubtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    eventBannerContainer: {
        width: '100%',
        aspectRatio: 16 / 6,  // 비율 설정
        minHeight: 100,       // 최소 높이 보장
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 35,
        marginTop: 20,
    },
    eventBannerImage: {
        width: '100%',
        height: '100%', // 배너의 높이에 맞추어 이미지 설정
    },
    popularSection: {
        padding: 16,
        backgroundColor: '#FFF7E0',
        marginBottom: 8,
    },
    popularTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    popularPostContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: colors.surface,
    },
    postContent: {
        flex: 1,
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
    popularPostTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
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
});

export default MainScreen;

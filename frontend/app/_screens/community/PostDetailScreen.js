import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, TextInput, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { communityApi } from '@app/_lib/api';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useAuth } from '@app/_lib/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function PostDetailScreen() {
    // URL 파라미터에서 게시글 ID 추출
    const params = useLocalSearchParams();
    const postId = params.id;
    const router = useRouter();
    const { user } = useAuth();
    const [viewCountUpdated, setViewCountUpdated] = useState(false);
    const queryClient = useQueryClient();

    // 상태 관리
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    // 게시글 데이터 로드
    useEffect(() => {
        console.log('PostDetailScreen - postId:', postId);
        if (!postId) {
            setError('게시글 ID가 없습니다.');
            setLoading(false);
            return;
        }

        const loadPostWithViewCount = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. 먼저 조회수를 증가시킴
                try {
                    await communityApi.incrementViewCount(postId);
                    // community 페이지의 posts 쿼리 무효화
                    queryClient.invalidateQueries(['posts']);
                } catch (viewCountError) {
                    console.error('조회수 증가 실패:', viewCountError);
                    // 조회수 증가 실패해도 게시글은 로드 시도
                }

                // 2. 최신 데이터로 게시글 로드
                const response = await communityApi.getPost(postId);
                
                if (!response?.data) {
                    throw new Error('게시글을 찾을 수 없습니다.');
                }

                const postData = response.data[0] || response.data;
                const comments = response.data.comments || [];

                const normalizedPost = {
                    ...postData,
                    comments
                };

                if (!normalizedPost.id) {
                    throw new Error('게시글 데이터가 없습니다.');
                }

                setPost(normalizedPost);
                setViewCountUpdated(true);
            } catch (err) {
                console.error('Error loading post:', {
                    message: err.message,
                    stack: err.stack,
                    response: err.response?.data
                });
                setError(err.message || '게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadPostWithViewCount();
    }, [postId, queryClient]);

    // 좋아요 토글 핸들러
    const handleLikeToggle = async () => {
        if (!user) {
            Alert.alert('알림', '로그인이 필한 기능입니다.');
            return;
        }

        try {
            const response = await communityApi.toggleLike(postId);
            setPost(prev => ({
                ...prev,
                is_liked: response.data.isLiked,
                like_count: response.data.likeCount
            }));
        } catch (error) {
            Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    // 댓글 작성 핸들러
    const handleComment = async () => {
        try {
            const response = await communityApi.createComment(postId, newComment);
            
            // 새로운 댓글을 포함한 게시글 상태 업데이트
            setPost(prevPost => ({
                ...prevPost,
                comments: [...(prevPost.comments || []), {
                    ...response.data.comment,
                    rank_color: colors.new, // 새 댓글 표시용 노란색
                    is_new: true // 새 댓글 여부 표시
                }],
                comment_count: (prevPost.comment_count || 0) + 1
            }));
            
            setNewComment('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            Alert.alert('오류', '댓글 작성에 실패했습니다.');
        }
    };

    // 투표 핸들러
    const handleVote = async (optionId) => {
        if (!user) {
            Alert.alert('알림', '로그인이 필요한 기능입니다.');
            return;
        }

        try {
            await communityApi.vote(postId, optionId);
            loadPost(); // 게시글 데이터 새로고침
        } catch (error) {
            Alert.alert('오류', '투표 처리 중 오류가 발생했습니.');
        }
    };

    // ScrollView ref 추가
    const scrollViewRef = useRef(null);

    // 로딩 상태 표시
    if (loading) {
        return <LoadingState />;
    }

    // 에러 상태 표시
    if (error) {
        return <ErrorState message={error} />;
    }

    // 데이터가 없는 경우
    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
                <Pressable onPress={() => router.back()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>돌아가기</Text>
                </Pressable>
            </View>
        );
    }

    // 게시글 렌더링
    return (
        <ScrollView 
            ref={scrollViewRef}
            style={styles.container}
        >
            <View style={styles.postHeader}>
                <Text style={styles.title}>{post.title}</Text>
                <View style={styles.authorInfo}>
                    <View style={styles.authorContainer}>
                        <Text style={styles.author}>{post.author_name}</Text>
                        <View style={[styles.rankBadge, { backgroundColor: post.rank_color }]}>
                            <Text style={styles.rankText}>{post.author_rank}</Text>
                        </View>
                    </View>
                    <View style={styles.postStats}>
                        <View style={styles.statItem}>
                            <FontAwesome5 name="eye" size={14} color={colors.text.secondary} />
                            <Text style={styles.statText}>{post.view_count}</Text>
                        </View>
                        <Pressable style={styles.statItem} onPress={handleLikeToggle}>
                            <FontAwesome5
                                name="heart"
                                size={14}
                                solid={post.is_liked}
                                color={post.is_liked ? colors.primary : colors.text.secondary}
                            />
                            <Text style={styles.statText}>{post.like_count}</Text>
                        </Pressable>
                        <View style={styles.statItem}>
                            <FontAwesome5 name="comment" size={14} color={colors.text.secondary} />
                            <Text style={styles.statText}>{post.comment_count}</Text>
                        </View>
                    </View>
                    <Text style={styles.date}>
                        {new Date(post.created_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.contentText}>{post.content}</Text>
                {post.media_url && (
                    <Image
                        source={{ uri: post.media_url }}
                        style={styles.mediaImage}
                        resizeMode="contain"
                    />
                )}
            </View>

            {post.poll_options && post.poll_options.length > 0 && (
                <View style={styles.pollContainer}>
                    <Text style={styles.pollTitle}>투표</Text>
                    {post.poll_options.map((option) => (
                        <Pressable
                            key={option.id}
                            style={[
                                styles.pollOption,
                                option.voted && styles.pollOptionVoted
                            ]}
                            onPress={() => handleVote(option.id)}
                            disabled={post.poll_options.some(opt => opt.voted)}
                        >
                            <Text style={styles.pollOptionText}>{option.text}</Text>
                            <Text style={styles.pollVoteCount}>{option.votes}표</Text>
                        </Pressable>
                    ))}
                </View>
            )}

            <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>댓글 {post.comment_count}개</Text>

                {/* 댓글 목록 */}
                <View style={styles.commentsList}>
                    {post.comments?.map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                            <View style={styles.commentHeader}>
                                <View style={styles.commentAuthor}>
                                    <View 
                                        style={[
                                            styles.rankDot, 
                                            { backgroundColor: comment.rank_color || colors.border }
                                        ]} 
                                    />
                                    <Text style={styles.commentAuthorName}>
                                        {comment.author_name}
                                    </Text>
                                </View>
                                <Text style={styles.commentDate}>
                                    {new Date(comment.created_at).toLocaleString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </Text>
                            </View>
                            <Text style={styles.commentContent}>{comment.content}</Text>
                        </View>
                    ))}
                </View>

                {/* 댓글 입력은 목록 아래에 위치 */}
                {user && (
                    <View style={styles.commentInputContainer}>
                        <TextInput
                            style={styles.commentInput}
                            value={newComment}
                            onChangeText={setNewComment}
                            placeholder="댓글을 입력하세요"
                            multiline
                        />
                        <Pressable
                            style={[
                                styles.commentButton,
                                !newComment.trim() && styles.commentButtonDisabled
                            ]}
                            onPress={handleComment}
                            disabled={!newComment.trim()}
                        >
                            <Text style={styles.commentButtonText}>작성</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

// 스타일 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    postHeader: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.md,
    },
    authorInfo: {
        marginBottom: spacing.sm,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    author: {
        ...typography.subtitle,
        marginRight: spacing.sm,
    },
    rankBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 4,
        marginLeft: spacing.sm,
    },
    rankText: {
        ...typography.caption,
        color: colors.background,
        fontWeight: 'bold',
    },
    postStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.md,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    statText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginLeft: spacing.xs,
    },
    date: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    content: {
        padding: spacing.lg,
    },
    contentText: {
        ...typography.body,
        lineHeight: 24,
    },
    mediaImage: {
        width: '100%',
        height: 300,
        marginTop: spacing.md,
        borderRadius: 8,
    },
    pollContainer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    pollTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
    pollOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    pollOptionVoted: {
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
    },
    pollOptionText: {
        ...typography.body,
        flex: 1,
    },
    pollVoteCount: {
        ...typography.caption,
        color: colors.text.secondary,
        marginLeft: spacing.sm,
    },
    commentsSection: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    commentsTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
    commentInputContainer: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.sm,
        marginRight: spacing.sm,
        ...typography.body,
    },
    commentButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        borderRadius: 8,
    },
    commentButtonText: {
        ...typography.button,
        color: colors.background,
    },
    commentButtonDisabled: {
        backgroundColor: colors.border,
    },
    commentItem: {
        padding: spacing.md,
        borderBottomColor: colors.border,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    commentAuthor: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.xs,
        backgroundColor: colors.border, // 기본 색상
    },
    commentAuthorName: {
        ...typography.subtitle,
        color: colors.text.primary,
    },
    commentDate: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    commentContent: {
        ...typography.body,
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
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    retryButtonText: {
        ...typography.button,
        color: colors.background,
    },
    commentsList: {
        marginTop: spacing.md,
    },
});

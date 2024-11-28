import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, TextInput, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { communityApi } from '@app/_utils/api/community';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useAuth } from '@app/_utils/hooks/useAuth';

export default function PostDetailScreen() {
    // URL 파라미터에서 게시글 ID 추출
    const params = useLocalSearchParams();
    const postId = params.id;
    const router = useRouter();
    const { user } = useAuth();

    // 상태 관리
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    // 게시글 데이터 로드
    useEffect(() => {
        if (!postId) {
            setError('게시글 ID가 없습니다.');
            setLoading(false);
            return;
        }

        loadPost();
    }, [postId]);

    // 게시글 데이터 로드 함수
    const loadPost = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading post with ID:', postId);
            
            const response = await communityApi.getPost(postId);
            console.log('Loaded post data:', response);
            
            if (!response.post) {
                throw new Error('게시글을 찾을 수 없습니다.');
            }

            setPost(response.post);
        } catch (err) {
            console.error('Error loading post:', err);
            setError(typeof err === 'string' ? err : '게시글을 불러오는데 실패했습니다.');
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    // 좋아요 토글 핸들러
    const handleLikeToggle = async () => {
        if (!user) {
            Alert.alert('알림', '로그인이 필요한 기능입니다.');
            return;
        }

        try {
            const response = await communityApi.toggleLike(postId);
            setPost(prev => ({
                ...prev,
                isLiked: response.isLiked,
                like_count: response.likeCount
            }));
        } catch (error) {
            Alert.alert('오류', '좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    // 댓글 작성 핸들러
    const handleComment = async () => {
        if (!user) {
            Alert.alert('알림', '로그인이 필요한 기능입니다.');
            return;
        }

        if (!newComment.trim()) {
            Alert.alert('알림', '댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await communityApi.createComment(postId, newComment);
            setNewComment('');
            loadPost(); // 게시글 데이터 새로고침
        } catch (error) {
            Alert.alert('오류', '댓글 작성에 실패했습니다.');
        }
    };

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
        <ScrollView style={styles.container}>
            <View style={styles.postHeader}>
                <Text style={styles.title}>{post.title}</Text>
                <View style={styles.authorInfo}>
                    <Text style={styles.author}>
                        {post.author?.username || '익명'}
                    </Text>
                    <Text style={styles.date}>
                        {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.media_url && (
                <View style={styles.mediaContainer}>
                    <Image 
                        source={{ uri: post.media_url }} 
                        style={styles.media}
                        resizeMode="contain"
                    />
                </View>
            )}

            <View style={styles.actions}>
                <Pressable 
                    onPress={handleLikeToggle}
                    style={styles.likeButton}
                >
                    <FontAwesome5 
                        name={post.isLiked ? "heart" : "heart-o"} 
                        size={20} 
                        color={post.isLiked ? colors.primary : colors.text.secondary} 
                    />
                    <Text style={styles.likeCount}>{post.like_count || 0}</Text>
                </Pressable>
            </View>

            <View style={styles.comments}>
                <Text style={styles.commentsTitle}>
                    댓글 {post.comments?.length || 0}개
                </Text>
                {post.comments?.map(comment => (
                    <View key={comment.id} style={styles.commentItem}>
                        <Text style={styles.commentAuthor}>
                            {comment.author?.username || '익명'}
                        </Text>
                        <Text style={styles.commentContent}>
                            {comment.content}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.commentInput}>
                <TextInput
                    style={styles.input}
                    placeholder="댓글을 입력하세요"
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                />
                <Pressable 
                    onPress={handleComment}
                    style={styles.submitButton}
                >
                    <Text style={styles.submitButtonText}>등록</Text>
                </Pressable>
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
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    authorInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    author: {
        ...typography.body,
        color: colors.text.secondary,
    },
    date: {
        ...typography.caption,
        color: colors.text.tertiary,
    },
    postContent: {
        ...typography.body,
        padding: spacing.lg,
    },
    mediaContainer: {
        width: '100%',
        height: 200,
        marginBottom: spacing.lg,
    },
    media: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    actions: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: 20,
        backgroundColor: colors.surface,
    },
    likeCount: {
        ...typography.caption,
        marginLeft: spacing.xs,
        color: colors.text.secondary,
    },
    comments: {
        padding: spacing.lg,
    },
    commentsTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    commentItem: {
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    commentAuthor: {
        ...typography.caption,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    commentContent: {
        ...typography.body,
    },
    commentInput: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        ...typography.body,
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        minHeight: 40,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
    },
    submitButtonText: {
        ...typography.button,
        color: colors.background,
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
});

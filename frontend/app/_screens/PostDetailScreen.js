import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { communityApi } from '@app/_utils/api/community';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';

export default function PostDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadPost();
    }, [id]);

    const loadPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await communityApi.getPost(id);
            
            if (response?.post) {
                setPost(response.post);
            } else {
                throw new Error('게시글 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('게시글 로드 에러:', error);
            setError(error.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadPost();
        setRefreshing(false);
    };

    const handleAddComment = async () => {
        if (!user) {
            Alert.alert('알림', '댓글을 작성하려면 로그인이 필요합니다.', [
                { text: '취소', style: 'cancel' },
                { text: '로그인', onPress: () => router.push('/login') }
            ]);
            return;
        }

        if (!commentText.trim()) {
            Alert.alert('알림', '댓글 내용을 입력해주세요.');
            return;
        }

        try {
            await communityApi.createComment(id, commentText);
            setCommentText('');
            loadPost(); // 댓글 목록 새로고침
        } catch (error) {
            console.error('댓글 작성 에러:', error);
            Alert.alert('오류', error.response?.data?.message || '댓글 작성에 실패했습니다.');
        }
    };

    const handleToggleLike = async () => {
        if (!user) {
            Alert.alert('알림', '좋아요를 하려면 로그인이 필요합니다.', [
                { text: '취소', style: 'cancel' },
                { text: '로그인', onPress: () => router.push('/login') }
            ]);
            return;
        }

        try {
            await communityApi.toggleLike(id);
            loadPost(); // 게시글 정보 새로고침
        } catch (error) {
            console.error('좋아요 토글 에러:', error);
            Alert.alert('오류', error.response?.data?.message || '좋아요 처리에 실패했습니다.');
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                <View style={styles.postContent}>
                    <Text style={styles.title}>{post.title}</Text>
                    <Text style={styles.author}>
                        {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.content}>{post.content}</Text>
                    {post.media_url && (
                        <Image 
                            source={{ uri: post.media_url }} 
                            style={styles.media}
                            resizeMode="contain"
                        />
                    )}
                    <View style={styles.actions}>
                        <TouchableOpacity 
                            onPress={handleToggleLike} 
                            style={[
                                styles.actionButton,
                                post.isLiked && styles.likeButton
                            ]}
                        >
                            <FontAwesome5
                                name="heart"
                                size={20}
                                color={post.isLiked ? '#FF3B5C' : colors.text.secondary}
                                solid={post.isLiked}
                            />
                            <Text style={[
                                styles.actionText,
                                post.isLiked && styles.likeText
                            ]}>
                                {post.like_count || 0}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>댓글</Text>
                    {post.comments?.map((comment) => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.commentUser}>{comment.author_name}</Text>
                            <Text style={styles.commentText}>{comment.content}</Text>
                            <Text style={styles.commentTime}>
                                {new Date(comment.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.commentInput}>
                <TextInput
                    style={styles.input}
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="댓글을 입력하세요"
                    multiline
                />
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        !commentText.trim() && styles.sendButtonDisabled
                    ]}
                    onPress={handleAddComment}
                    disabled={!commentText.trim()}
                >
                    <FontAwesome5 
                        name="paper-plane" 
                        size={20} 
                        color={commentText.trim() ? colors.primary : colors.text.disabled} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
    },
    postContent: {
        padding: spacing.md,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    author: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    content: {
        ...typography.body,
        marginBottom: spacing.lg,
    },
    media: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: spacing.md,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        backgroundColor: `${colors.border}15`,
    },
    actionText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    commentsSection: {
        padding: spacing.md,
        borderTopWidth: 8,
        borderTopColor: colors.border,
    },
    commentsTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    comment: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    commentUser: {
        ...typography.caption,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    commentText: {
        ...typography.body,
        marginBottom: spacing.xs,
    },
    commentTime: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    commentInput: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    input: {
        flex: 1,
        ...typography.body,
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        maxHeight: 100,
    },
    sendButton: {
        padding: spacing.sm,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    likeButton: {
        backgroundColor: '#FF3B5C15',
    },
    likeText: {
        color: '#FF3B5C',
    },
});

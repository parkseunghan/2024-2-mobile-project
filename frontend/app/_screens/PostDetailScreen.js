import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { usePosts } from '@app/_context/PostContext';

export default function PostDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getPost, toggleLike, toggleDislike, toggleFavorite, addComment } = usePosts();
    const post = getPost(id);
    const [commentText, setCommentText] = useState('');

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
            </View>
        );
    }

    const handleAddComment = () => {
        if (commentText.trim()) {
            addComment(id, {
                user: '익명',
                text: commentText,
            });
            setCommentText('');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={post.comments}
                ListHeaderComponent={() => (
                    <View style={styles.postContent}>
                        <Text style={styles.title}>{post.title}</Text>
                        <Text style={styles.author}>{post.author} · {post.time}</Text>
                        <Text style={styles.content}>{post.content}</Text>
                        {post.media && (
                            <Image source={{ uri: post.media }} style={styles.media} />
                        )}
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => toggleLike(id)} style={styles.actionButton}>
                                <FontAwesome5
                                    name="thumbs-up"
                                    size={20}
                                    color={post.liked ? colors.primary : colors.text.secondary}
                                />
                                <Text style={styles.actionText}>{post.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleDislike(id)} style={styles.actionButton}>
                                <FontAwesome5
                                    name="thumbs-down"
                                    size={20}
                                    color={post.disliked ? colors.error : colors.text.secondary}
                                />
                                <Text style={styles.actionText}>{post.dislikes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleFavorite(id)} style={styles.actionButton}>
                                <FontAwesome5
                                    name="star"
                                    size={20}
                                    color={post.favorited ? colors.warning : colors.text.secondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={styles.comment}>
                        <Text style={styles.commentUser}>{item.user}</Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={
                    <Text style={styles.emptyComments}>첫 댓글을 남겨보세요!</Text>
                }
            />

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
    },
    actionText: {
        ...typography.caption,
        color: colors.text.secondary,
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
    },
    emptyComments: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        padding: spacing.xl,
    },
    commentInput: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
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
    },
    sendButton: {
        padding: spacing.sm,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_lib/hooks';
import { formatDate } from '@app/_lib/utils';

export function PostCard({ post, onPress, onLikePress }) {
    const { user } = useAuth();
    
    const hasUserComment = post.comments?.some(comment => comment.author_id === user?.id);

    return (
        <Pressable 
            style={[styles.container, style]}
            onPress={onPress}
        >
            {post.media_url ? (
                <Image 
                    source={{ uri: post.media_url }} 
                    style={styles.thumbnail}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.thumbnailPlaceholder}>
                    <FontAwesome5 
                        name="newspaper" 
                        size={24} 
                        color={colors.text.secondary} 
                    />
                </View>
            )}
            <View style={styles.infoContainer}>
                <Text 
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {post.title}
                </Text>
                <Text 
                    style={styles.preview}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {post.content?.substring(0, 20)}...
                </Text>
                <View style={styles.bottomContainer}>
                    <Text style={styles.channelTitle}>{post.author_name}</Text>
                    <View style={styles.statsContainer}>
                        <View style={[
                            styles.stat, 
                            (post.isLiked || (user && post.likes?.includes(user.id))) && styles.statLiked
                        ]}>
                            <FontAwesome5 
                                name={post.isLiked ? "heart" : "heart-o"} 
                                size={20} 
                                color={post.isLiked ? colors.primary : colors.text.secondary} 
                            />
                            <Text style={[
                                styles.statText,
                                (post.isLiked || (user && post.likes?.includes(user.id))) && styles.statTextLiked
                            ]}>
                                {post.like_count || 0}
                            </Text>
                        </View>
                        <View style={[
                            styles.stat,
                            hasUserComment && styles.commentButton
                        ]}>
                            <FontAwesome5 
                                name="comment-alt" 
                                size={12} 
                                color={hasUserComment ? '#4A90E2' : colors.text.secondary} 
                                solid={hasUserComment}
                            />
                            <Text style={[
                                styles.statText,
                                hasUserComment && styles.commentText
                            ]}>
                                {post.comment_count || 0}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: spacing.sm,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: `${colors.border}50`,
        maxHeight: 280,
    },
    thumbnail: {
        width: '100%',
        height: 140,
        backgroundColor: colors.border,
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: `${colors.border}30`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        padding: spacing.sm,
    },
    title: {
        ...typography.h3,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: spacing.xs,
        color: colors.text.primary,
    },
    preview: {
        ...typography.body,
        fontSize: 13,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    channelTitle: {
        ...typography.caption,
        fontSize: 12,
        color: colors.text.secondary,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: 4,
        paddingHorizontal: spacing.sm,
        borderRadius: 12,
        backgroundColor: `${colors.border}15`,
    },
    statLiked: {
        backgroundColor: '#FF3B5C15',
    },
    commentButton: {
        backgroundColor: '#4A90E215',
    },
    statText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    statTextLiked: {
        color: '#FF3B5C',
    },
    commentText: {
        color: '#4A90E2',
    },
}); 
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const PostCard = ({ post, onPress, style }) => {
    return (
        <Pressable 
            style={[styles.container, style]}
            onPress={onPress}
        >
            {post.media ? (
                <Image 
                    source={{ uri: post.media }} 
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
                <Text style={styles.channelTitle}>{post.author}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <FontAwesome5 
                            name="heart" 
                            size={12} 
                            color={post.liked ? colors.primary : colors.text.secondary} 
                        />
                        <Text style={styles.statText}>{post.likes}</Text>
                    </View>
                    <View style={styles.stat}>
                        <FontAwesome5 
                            name="comment" 
                            size={12} 
                            color={colors.text.secondary} 
                        />
                        <Text style={styles.statText}>{post.comments?.length || 0}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: spacing.sm,
    },
    thumbnail: {
        width: '100%',
        height: 140,
        backgroundColor: colors.border,
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: 140,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoContainer: {
        padding: spacing.sm,
    },
    title: {
        ...typography.body,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: spacing.xs,
    },
    channelTitle: {
        ...typography.caption,
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: spacing.xs,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statText: {
        ...typography.caption,
        fontSize: 12,
        color: colors.text.secondary,
    },
}); 
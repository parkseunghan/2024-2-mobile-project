import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 비디오 정보 컴포넌트
 * - 비디오 제목, 채널명, 조회수 등 표시
 * - 출처 보기 버튼 포함
 * 
 * @param {Object} videoDetails - 비디오 상세 정보
 * @param {Function} onSourcePress - 출처 보기 버튼 클릭 핸들러
 */
export const VideoInfo = ({ videoDetails, onSourcePress }) => {
    const { snippet, statistics } = videoDetails;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{snippet.title}</Text>
            <View style={styles.statsContainer}>
                <Text style={styles.channelTitle}>{snippet.channelTitle}</Text>
                <View style={styles.stats}>
                    <Text style={styles.statText}>
                        조회수 {Number(statistics.viewCount).toLocaleString()}회
                    </Text>
                    <Text style={styles.statText}>
                        좋아요 {Number(statistics.likeCount).toLocaleString()}개
                    </Text>
                </View>
            </View>
            <Pressable style={styles.sourceButton} onPress={onSourcePress}>
                <FontAwesome5
                    name="external-link-alt"
                    size={16}
                    color={colors.background}
                />
                <Text style={styles.sourceButtonText}>
                    출처 보기
                </Text>
            </Pressable>
            <Text style={styles.description}>{snippet.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
    statsContainer: {
        marginBottom: spacing.md,
    },
    channelTitle: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    stats: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    statText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    sourceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: spacing.sm,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: spacing.md,
        gap: spacing.xs,
    },
    sourceButtonText: {
        ...typography.button,
        color: colors.background,
    },
    description: {
        ...typography.body,
        color: colors.text.secondary,
    },
}); 
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const CategoryButton = ({ category, onPress }) => {
    return (
        <Pressable
            style={styles.categoryButton}
            onPress={onPress}
        >
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    categoryButton: {
        width: '47%',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.md,
    },
    categoryTitle: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    categorySubtitle: {
        ...typography.caption,
        color: colors.text.secondary,
    },
}); 
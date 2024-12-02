import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export function SearchResults({ results }) {
    if (!results || results.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.resultItem}>
                    <Text style={styles.resultText}>{item.title}</Text>
                </View>
            )}
            style={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    resultItem: {
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    resultText: {
        ...typography.body,
        color: colors.text.primary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    }
}); 
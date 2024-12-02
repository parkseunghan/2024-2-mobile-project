import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export function SearchHistory({ history, onSelect, onRemove }) {
    if (!history || history.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>최근 검색 기록이 없습니다.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>최근 검색어</Text>
            {history.map((query, index) => (
                <View key={index} style={styles.historyItem}>
                    <Pressable 
                        style={styles.queryButton}
                        onPress={() => onSelect(query)}
                    >
                        <FontAwesome5 
                            name="history" 
                            size={16} 
                            color={colors.text.secondary}
                            style={styles.icon}
                        />
                        <Text style={styles.queryText}>{query}</Text>
                    </Pressable>
                    <Pressable 
                        style={styles.removeButton}
                        onPress={() => onRemove(query)}
                    >
                        <FontAwesome5 
                            name="times" 
                            size={16} 
                            color={colors.text.secondary}
                        />
                    </Pressable>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md,
    },
    title: {
        ...typography.subtitle,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    queryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: spacing.sm,
    },
    queryText: {
        ...typography.body,
        color: colors.text.primary,
    },
    removeButton: {
        padding: spacing.xs,
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
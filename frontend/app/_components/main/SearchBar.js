import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const SearchBar = ({ searchQuery, onSearchChange, onSubmit, onClear }) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color={colors.text.secondary}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.input}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    onSubmitEditing={onSubmit}
                    placeholder="어떤 팁을 찾으시나요?"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="search"
                />

                <Pressable
                    onPress={onClear}
                    style={[styles.clearButton, { opacity: searchQuery.length ? 1 : 0.5 }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    disabled={!searchQuery.length}
                >
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={searchQuery.length ? colors.text.secondary : colors.text.disabled}
                    />
                </Pressable>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        height: 40,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        paddingVertical: spacing.xs,
    },
    clearButton: {
        padding: spacing.xs,
        marginLeft: spacing.xs,
    },
}); 
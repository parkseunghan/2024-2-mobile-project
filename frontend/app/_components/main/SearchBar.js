import React, { memo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const SearchBar = memo(({ 
    searchQuery, 
    onSearchChange, 
    onSubmit, 
    onClear,
    onFocus,
    autoFocus = false 
}) => {
    const handleFocus = async () => {
        if (onFocus) {
            await onFocus();
        }
    };

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
                    onFocus={handleFocus}
                    placeholder="어떤 팁을 찾으시나요?"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="search"
                    autoFocus={autoFocus}
                />
                {searchQuery.length > 0 && (
                    <View style={styles.clearButtonContainer}>
                        <Pressable
                            onPress={onClear}
                            style={styles.clearButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={colors.text.secondary}
                            />
                        </Pressable>
                    </View>
                )}
            </View>
        </View>
    );
});

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 20,
        paddingLeft: spacing.md,
        paddingRight: spacing.xl,
        height: 44,
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        height: '100%',
        paddingVertical: 0,
    },
    clearButtonContainer: {
        position: 'absolute',
        right: spacing.sm,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButton: {
        padding: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 
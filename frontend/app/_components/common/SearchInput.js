import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export function SearchInput({ 
    value, 
    onChangeText, 
    placeholder = '검색어를 입력하세요...', 
    style 
}) {
    return (
        <View style={[styles.container, style]}>
            <FontAwesome 
                name="search" 
                size={16} 
                color={colors.text.secondary} 
                style={styles.icon} 
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.text.secondary}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    icon: {
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        ...typography.body,
        color: colors.text.primary,
        padding: 0,
    },
}); 
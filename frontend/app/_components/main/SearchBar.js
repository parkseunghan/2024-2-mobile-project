import React, { memo } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 검색바 컴포넌트
 * - 검색어 입력 및 검색 기능 제공
 * - 검색어 초기화 기능 포함
 * 
 * @param {string} searchQuery - 검색어
 * @param {Function} onSearchChange - 검색어 변경 핸들러
 * @param {Function} onSubmit - 검색 제출 핸들러
 * @param {Function} onClear - 검색어 초기화 핸들러
 * @param {Function} onFocus - 포커스 이벤트 핸들러
 * @param {boolean} autoFocus - 자동 포커스 여부
 */
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
                    placeholderTextColor={'#8E8E93'}
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
        fontSize: 14.5,
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
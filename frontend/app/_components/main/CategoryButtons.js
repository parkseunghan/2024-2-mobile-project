import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@app/_config/constants';

/**
 * 카테고리 버튼 목록 컴포넌트
 * - 메인 화면에 표시되는 카테고리 버튼들
 * - 각 버튼은 아이콘과 제목으로 구성
 */
export const CategoryButtons = () => {
    const router = useRouter();

    /**
     * 카테고리 버튼 클릭 핸들러
     * @param {string} categoryId - 카테고리 ID
     */
    const handleCategoryPress = (categoryId) => {
        console.log('Pressing category:', categoryId);
        router.push(`/category/${categoryId}`);
    };

    /**
     * 개별 카테고리 버튼 렌더링
     * @param {Object} category - 카테고리 정보
     */
    const renderCategoryButton = (category) => (
        <Pressable
            key={category.id}
            style={styles.button}
            onPress={() => handleCategoryPress(category.id)}
        >
            <View style={styles.buttonContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
                    <Ionicons name={category.icon} size={28} color={category.color} />
                </View>
                <Text style={styles.buttonText} numberOfLines={1}>
                    {category.title}
                </Text>
            </View>
        </Pressable>
    );

    const firstRow = CATEGORIES.slice(0, 3);
    const secondRow = CATEGORIES.slice(3);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {firstRow.map(renderCategoryButton)}
            </View>
            <View style={styles.row}>
                {secondRow.map(renderCategoryButton)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 800,
        alignSelf: 'center',
        paddingHorizontal: spacing.xs,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 4,
        height: 90,
        minWidth: 95,
        borderRadius: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xs,
    },
    buttonContent: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    buttonText: {
        color: '#2D3436',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
});

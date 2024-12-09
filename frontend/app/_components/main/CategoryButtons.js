import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@app/_config/constants';
import { colors } from '@app/_styles/colors';

/**
 * 유동적인 카테고리 버튼 목록 컴포넌트
 */
export const CategoryButtons = () => {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]?.id || null);

    const handleCategoryPress = (categoryId) => {
        setActiveCategory(activeCategory === categoryId ? null : categoryId);
    };

    const handleSubItemPress = (subItem) => {
        const parentCategory = CATEGORIES.find(cat => 
            cat.subItems.some(sub => sub.id === subItem.id)
        );
        
        router.push({
            pathname: `/category/${subItem.id}`,
        });
    };

    const renderCategoryButton = ({ item: category }) => (
        <Pressable
            key={category.id}
            style={({ pressed }) => [
                styles.categoryButton,
                pressed && styles.buttonPressed,
                activeCategory === category.id && styles.categorySelected,
            ]}
            onPress={() => handleCategoryPress(category.id)}
        >
            <Text
                style={[
                    styles.categoryText,
                    activeCategory === category.id && styles.categoryTextSelected,
                ]}
            >
                {category.title}
            </Text>
        </Pressable>
    );

    const renderSubItemButton = ({ item: subItem }) => (
        <Pressable
            key={subItem.id}
            style={({ pressed }) => [
                styles.subItemButton,
                pressed && styles.buttonPressed,
            ]}
            onPress={() => handleSubItemPress(subItem)}
        >
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: `${subItem.color}15` },
                ]}
            >
                <Ionicons name={subItem.icon} size={24} color={subItem.color} />
            </View>
            <Text style={styles.subItemText}>{subItem.title}</Text>
        </Pressable>
    );

    const renderSubItems = () => {
        if (!activeCategory) return null;

        const category = CATEGORIES.find((cat) => cat.id === activeCategory);
        return (
            <FlatList
                data={category.subItems}
                renderItem={renderSubItemButton}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.subItemsContainer}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <FlatList
                    data={CATEGORIES}
                    renderItem={renderCategoryButton}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                />
                <View style={styles.subItemsWrapper}>{renderSubItems()}</View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 10,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        paddingHorizontal: 1,
        marginBottom: 10,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginHorizontal: 5,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        height: 36,
        justifyContent: 'center',
    },
    categorySelected: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        color: colors.text.secondary,
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    categoryTextSelected: {
        color: colors.background,
    },
    subItemButton: {
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        flex: 1,
        maxWidth: '30%',
        minHeight: 80,
    },
    buttonPressed: {
        backgroundColor: '#e0e0e0',
    },
    subItemsWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
    },
    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    subItemText: {
        color: '#2D3436',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        flexWrap: 'wrap', // 텍스트가 넘칠 경우 자동으로 줄바꿈
        maxWidth: '100%', // 부모 컨테이너 크기에 맞게 조정
    },
});

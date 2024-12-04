import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@app/_config/constants';

/**
 * 유동적인 카테고리 버튼 목록 컴포넌트
 */
export const CategoryButtons = () => {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState(null);

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
                styles.button,
                pressed && styles.buttonPressed,
                activeCategory === category.id && styles.activeButton,
            ]}
            onPress={() => handleCategoryPress(category.id)}
        >
            <Text style={styles.buttonText}>{category.title}</Text>
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
        alignItems: 'center',
        paddingTop: 20,
    },
    scrollContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    activeButton: {
        backgroundColor: '#d0e8ff',
    },
    subItemButton: {
        backgroundColor: 'white',
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
    buttonText: {
        color: '#2D3436',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
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
        overflow: 'hidden',
        width: '150%',
        whiteSpace: 'nowrap',
    },
});

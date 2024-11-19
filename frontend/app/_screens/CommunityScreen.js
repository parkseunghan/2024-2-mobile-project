import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { PostCard } from '@app/_components/community/PostCard';
import { CategoryFilter } from '@app/_components/community/CategoryFilter';
import { usePosts } from '@app/_context/PostContext';

export default function CommunityScreen() {
    const router = useRouter();
    const { posts, addPost } = usePosts();
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const categories = ['전체', '상품 리뷰', '취미', '건강·운동', '맛집', '여행', '슈퍼전대'];
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const filteredPosts = posts.filter((post) => {
        const matchesCategory =
            selectedCategory === '전체' || post.category === selectedCategory;
        const matchesSearchText = post.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
        return matchesCategory && matchesSearchText;
    });

    const popularPosts = posts
        .filter((post) => post.likes >= 10)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    const handlePostPress = (post) => {
        router.push(`/post/${post.id}`);
    };

    const handleCreatePost = () => {
        router.push('/post/create');
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>게시판</Text>
                    <TouchableOpacity
                        onPress={() => setSearchVisible(!searchVisible)}
                    >
                        <FontAwesome5
                            name="search"
                            size={24}
                            color={colors.text.primary}
                        />
                    </TouchableOpacity>
                </View>

                {searchVisible && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                )}

                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>실시간 인기 글</Text>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularPostsList}
                    >
                        {popularPosts.map((post) => (
                            <View key={post.id} style={styles.popularPostContainer}>
                                <PostCard
                                    post={post}
                                    onPress={() => handlePostPress(post)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>모든 게시물</Text>
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onPress={() => handlePostPress(post)}
                        />
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={handleCreatePost}
            >
                <FontAwesome5 name="pen" size={24} color={colors.background} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
    },
    headerTitle: {
        ...typography.h2,
    },
    searchContainer: {
        padding: spacing.md,
        backgroundColor: colors.surface,
    },
    searchInput: {
        ...typography.body,
        backgroundColor: colors.background,
        padding: spacing.sm,
        borderRadius: 8,
    },
    section: {
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
    },
    floatingButton: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    popularPostContainer: {
        width: 280,
        marginRight: spacing.md,
    },
    popularPostsList: {
        paddingHorizontal: spacing.xs,
    },
});

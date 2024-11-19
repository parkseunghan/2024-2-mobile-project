import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SearchBar } from '@app/_components/main/SearchBar';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { SearchContext } from '@app/_context/SearchContext';
import { searchVideos } from '@app/_utils/youtubeApi';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SearchScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const {
        searchQuery,
        setSearchQuery,
        setSearchResults,
        addToSearchHistory
    } = useContext(SearchContext);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const results = await searchVideos(searchQuery);
            setSearchResults(results || []);
            if (user) {
                await addToSearchHistory(searchQuery);
            }
            router.push('/(tabs)/home');
        } catch (error) {
            console.error('검색 에러:', error);
            setSearchResults([]);
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.searchContainer}>
                <Pressable onPress={() => router.back()}>
                    <FontAwesome5 name="arrow-left" size={24} color={colors.text.primary} />
                </Pressable>
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSubmit={handleSearch}
                    onClear={handleClearSearch}
                    autoFocus={true}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        padding: spacing.md,
    },
});
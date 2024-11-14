import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { Menu } from './Menu';
import { SearchBar } from '@app/_components/main/SearchBar';
import { SearchContext } from '@app/_context/SearchContext';
import { searchVideos } from '@app/_utils/youtubeApi';

export function Header({ title, showBackButton, onBackPress }) {
    const router = useRouter();
    const navigation = useNavigation();
    const { user } = useAuth();
    const {
        searchQuery,
        setSearchQuery,
        setSearchResults,
        addToSearchHistory,
    } = React.useContext(SearchContext);

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const handleProfilePress = () => {
        router.push('/(profile)/profile');
    };

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.push('/(tabs)/home');
        }
    };

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
        <>
            <View style={styles.header}>
                {showBackButton && (
                    <Pressable onPress={handleBackPress} style={styles.backButton}>
                        <FontAwesome5 name="arrow-left" size={24} color={colors.text.primary} />
                    </Pressable>
                )}

                <View style={styles.searchContainer}>
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSubmit={handleSearch}
                        onClear={handleClearSearch}
                    />
                </View>
                <View style={styles.rightContainer}>
                    <Pressable onPress={handleProfilePress} style={styles.iconButton}>
                        {user ? (
                            <FontAwesome5 name="user-circle" size={24} color={colors.primary} />
                        ) : (
                            <FontAwesome5 name="user" size={24} color={colors.text.secondary} />
                        )}
                    </Pressable>
                    <Pressable
                        onPress={() => setIsMenuVisible(true)}
                        style={styles.iconButton}
                    >
                        <FontAwesome5 name="bars" size={24} color={colors.text.primary} />
                    </Pressable>
                </View>
            </View>

            <Menu
                isVisible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
            />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    searchContainer: {
        flex: 1,
        marginHorizontal: spacing.sm,
    },
    searchBar: {
        width: '100%',
        height: 40, // SearchBar height 조정
        paddingHorizontal: spacing.sm,
        borderRadius: 8,
        backgroundColor: colors.inputBackground,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minWidth: 80,
    },
    iconButton: {
        padding: spacing.xs,
    },
    backButton: {
        padding: spacing.xs,
        minWidth: 40,
    },
}); 
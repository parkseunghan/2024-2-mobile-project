import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Modal, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { SearchBar } from '@app/_components/main/SearchBar';
import { useAuth } from '@app/_lib/hooks';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSearch } from '@app/_context/SearchContext';

const SearchScreen = ({ visible, onClose }) => {
    const router = useRouter();
    const { user } = useAuth();
    const {
        searchQuery,
        setSearchQuery,
        searchHistory,
        handleSearch,
        clearAllSearchHistory,
        deleteSearchHistoryItem,
        loadSearchHistory,
    } = useSearch();
    const [slideAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible && user) {
            loadSearchHistory();
        }
    }, [visible, user]);

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        } else {
            Animated.spring(slideAnim, {
                toValue: 1000,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        }
    }, [visible]);

    const handleSearchSubmit = async (event) => {
        const query = event.nativeEvent.text;
        if (!query.trim()) return;

        await handleSearch(query);
        onClose();
        router.push('/search-results');
    };

    const handleSearchHistoryItemPress = async (query) => {
        await handleSearch(query);
        onClose();
        router.push('/search-results');
    };

    const handleDeleteHistoryItem = async (query) => {
        await deleteSearchHistoryItem(query);
    };

    const renderSearchHistory = () => {
        if (!user || !searchHistory?.length) return null;

        return (
            <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>최근 검색어</Text>
                    <Pressable
                        style={styles.clearButton}
                        onPress={clearAllSearchHistory}
                    >
                        <FontAwesome5 name="trash-alt" size={16} color={colors.text.secondary} />
                        <Text style={styles.clearButtonText}>전체 삭제</Text>
                    </Pressable>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.historyScrollView}
                >
                    {searchHistory.map((item, index) => (
                        <Pressable
                            key={index}
                            style={styles.historyItem}
                            onPress={() => handleSearchHistoryItemPress(item.query)}
                        >
                            <Text style={styles.historyText}>{item.query}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        );
    };

    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View
                style={[
                    styles.modalContainer,
                    { transform: [{ translateY: slideAnim }] }
                ]}
            >
                <View style={styles.header}>
                    <Pressable onPress={onClose} style={styles.backButton}>
                        <FontAwesome5 name="arrow-left" size={24} color={colors.text.primary} />
                    </Pressable>
                    <View style={styles.searchBarContainer}>
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onSubmit={handleSearchSubmit}
                            onClear={() => setSearchQuery('')}
                            autoFocus={true}
                        />
                    </View>
                </View>

                <ScrollView style={styles.content}>
                    {renderSearchHistory()}
                </ScrollView>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.sm,
        marginRight: spacing.sm,
    },
    searchBarContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    section: {
        padding: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
    },
    clearButton: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    historyItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    historyItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        marginRight: spacing.xs,
    },
    historyIcon: {
        marginRight: spacing.xs,
    },
    historyText: {
        ...typography.caption,
        color: colors.text.primary,
    },
    deleteButton: {
        padding: spacing.xs,
    },
    videoCard: {
        width: 280,
        marginRight: spacing.md,
    },
    historySection: {
        padding: spacing.md,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    historyTitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.xs,
    },
    clearButtonText: {
        ...typography.caption,
        color: colors.text.secondary,
        marginLeft: spacing.xs,
    },
    historyScrollView: {
        flexGrow: 0,
    },
    historyItem: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 16,
        marginRight: spacing.sm,
        ...Platform.select({
            ios: {
                shadowColor: colors.text.primary,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            },
        }),
    },
    historyText: {
        ...typography.caption,
        color: colors.text.primary,
    },
});

export default React.memo(SearchScreen);
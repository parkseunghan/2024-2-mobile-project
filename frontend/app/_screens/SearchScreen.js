import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Pressable, Animated, Platform, Dimensions } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { SearchContext } from '@app/_context/SearchContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { VideoCard } from '@app/_components/main/VideoCard';
import { SearchBar } from '@app/_components/main/SearchBar';
import { useRouter } from 'expo-router';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { searchVideos } from '@app/_utils/youtubeApi';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SearchScreen = ({ visible, onClose }) => {
    const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
    const router = useRouter();
    const { user } = useAuth();
    const { 
        searchQuery,
        setSearchQuery,
        searchHistory,
        clearAllSearchHistory,
        deleteSearchHistoryItem,
        recommendedVideos,
        setSearchResults,
        addToSearchHistory,
    } = useContext(SearchContext);

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleSearchSubmit = async (event) => {
        try {
            const query = event.nativeEvent.text;
            const results = await searchVideos(query);
            setSearchResults(results || []);
            if (query.trim()) {
                await addToSearchHistory(query);
            }
            onClose();
            router.push('/search-results');
        } catch (error) {
            console.error('검색 에러:', error);
            setSearchResults([]);
        }
    };

    const handleSearchHistoryItemPress = async (query) => {
        setSearchQuery(query);
        await handleSearchSubmit({ nativeEvent: { text: query } });
    };

    const handleDeleteHistoryItem = async (query) => {
        await deleteSearchHistoryItem(query);
    };

    const renderSearchHistory = () => {
        if (!user || !searchHistory?.length) return null;

        return (
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>최근 검색어</Text>
                    <Pressable onPress={clearAllSearchHistory}>
                        <Text style={styles.clearButton}>전체 삭제</Text>
                    </Pressable>
                </View>
                <View style={styles.historyContainer}>
                    {searchHistory.map((item, index) => (
                        <View key={index} style={styles.historyItemContainer}>
                            <Pressable
                                style={styles.historyItem}
                                onPress={() => handleSearchHistoryItemPress(item.query)}
                            >
                                <FontAwesome5 
                                    name="history" 
                                    size={14} 
                                    color={colors.text.secondary}
                                    style={styles.historyIcon}
                                />
                                <Text style={styles.historyText}>{item.query}</Text>
                            </Pressable>
                            <Pressable
                                style={styles.deleteButton}
                                onPress={() => handleDeleteHistoryItem(item.query)}
                            >
                                <FontAwesome5 
                                    name="times" 
                                    size={14} 
                                    color={colors.text.secondary}
                                />
                            </Pressable>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderRecommendedVideos = () => {
        if (!recommendedVideos?.length) return null;

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>추천 영상</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {recommendedVideos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onPress={() => {
                                onClose();
                                router.push(`/video/${video.id}`);
                            }}
                            style={styles.videoCard}
                        />
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

                <ScrollView 
                    style={styles.content}
                    bounces={false}
                >
                    {renderSearchHistory()}
                    {renderRecommendedVideos()}
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
});

export default React.memo(SearchScreen);
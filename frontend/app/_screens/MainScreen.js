import React, { useState, useEffect, useContext, useRef } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text, Pressable, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { SearchBar } from '@app/_components/main/SearchBar';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { VideoList } from '@app/_components/main/VideoList';
import VideoDetailScreen from '@app/_screens/VideoDetailScreen';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { searchVideos } from '@app/_utils/youtubeApi';
import { Header } from '@app/_components/common/Header';
import { SearchContext } from '@app/_context/SearchContext';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { typography } from '@app/_styles/typography';
import { FontAwesome5 } from '@expo/vector-icons';

const MainScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { 
        searchQuery, 
        setSearchQuery, 
        searchResults, 
        setSearchResults,
        addToSearchHistory,
        searchHistory,
        clearAllSearchHistory 
    } = useContext(SearchContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const scrollViewRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        if (selectedVideoId) {
            navigation.setOptions({
                header: () => (
                    <Header 
                        title="동영상 상세" 
                        showBackButton={true}
                        onBackPress={() => setSelectedVideoId(null)}
                    />
                ),
            });
        } else {
            navigation.setOptions({
                header: () => <Header title="홈" />,
            });
        }
    }, [selectedVideoId]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const results = await searchVideos(searchQuery);
            setSearchResults(results || []);
            
            if (user) {
                await addToSearchHistory(searchQuery);
            }
        } catch (error) {
            console.error('검색 에러:', error);
            setError(
                error.message ||
                '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            );
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (categoryId) => {
        console.log('선택된 카테고리:', categoryId);
    };

    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    const handleScroll = (event) => {
        setScrollPosition(event.nativeEvent.contentOffset.x);
    };

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setViewportWidth(width);
    };

    const handleContentSizeChange = (width) => {
        setContentWidth(width);
    };

    const handleMouseDown = (e) => {
        if (Platform.OS === 'web') {
            setIsDragging(true);
            setStartX(e.pageX - scrollViewRef.current.scrollLeft);
            setScrollLeft(scrollViewRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        if (Platform.OS === 'web') {
            setIsDragging(false);
        }
    };

    const handleMouseUp = () => {
        if (Platform.OS === 'web') {
            setIsDragging(false);
        }
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        if (Platform.OS === 'web' && scrollViewRef.current) {
            const x = e.pageX - scrollViewRef.current.offsetLeft;
            const walk = (x - startX) * 2; // 스크롤 속도 조절
            scrollViewRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const webScrollStyle = Platform.OS === 'web' ? {
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
    } : {};

    if (selectedVideoId) {
        return (
            <View style={styles.container}>
                <VideoDetailScreen 
                    videoId={selectedVideoId} 
                    onBack={() => setSelectedVideoId(null)} 
                />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSubmit={handleSearch}
            />
            {user && searchHistory.length > 0 && (
                <View style={styles.historyContainer} onLayout={handleLayout}>
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
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        onContentSizeChange={handleContentSizeChange}
                        bounces={false}
                        contentContainerStyle={[
                            styles.historyScrollContent,
                            webScrollStyle
                        ]}
                        {...(Platform.OS === 'web' && {
                            onMouseDown: handleMouseDown,
                            onMouseLeave: handleMouseLeave,
                            onMouseUp: handleMouseUp,
                            onMouseMove: handleMouseMove,
                        })}
                    >
                        {searchHistory.map((item, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.historyItem,
                                    index === searchHistory.length - 1 && styles.lastHistoryItem,
                                    Platform.OS === 'web' && styles.webHistoryItem
                                ]}
                                onPress={() => {
                                    if (!isDragging) {
                                        setSearchQuery(item.query);
                                        handleSearch();
                                    }
                                }}
                            >
                                <Text style={styles.historyText}>{item.query}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
            <CategoryButtons onCategoryPress={handleCategoryPress} />

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <VideoList
                    videos={searchResults}
                    error={error}
                    onVideoSelect={handleVideoSelect}
                />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingVertical: spacing.md,
    },
    centerContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    historyContainer: {
        padding: spacing.md,
    },
    historyScrollContent: {
        paddingHorizontal: spacing.xs,
        ...(Platform.OS === 'web' && {
            scrollBehavior: 'smooth',
        }),
    },
    historyTitle: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
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
    lastHistoryItem: {
        marginRight: 0,
    },
    historyText: {
        ...typography.caption,
        color: colors.text.primary,
    },
    webHistoryItem: {
        ...(Platform.OS === 'web' && {
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            ':hover': {
                transform: 'translateY(-2px)',
            },
        }),
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
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
});

export default MainScreen;
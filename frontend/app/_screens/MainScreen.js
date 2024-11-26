import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { VideoList } from '@app/_components/main/VideoList';
import VideoDetailScreen from '@app/_screens/VideoDetailScreen';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { SearchContext } from '@app/_context/SearchContext';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { searchVideos } from '@app/_utils/youtubeApi';
import Banner from '@app/_components/main/Banner';
import { useRouter } from 'expo-router';

const MainScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const {
        searchResults,
        searchHistory,
        setSearchQuery,
        setSearchResults,
        clearAllSearchHistory,
        addToSearchHistory
    } = useContext(SearchContext);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const router = useRouter();

    const handleCategoryPress = (categoryId) => {
        router.push(`/category/${categoryId}`);
    };

    const handleVideoSelect = (videoId) => {
        setSelectedVideoId(videoId);
    };

    const handleSearchHistoryPress = async (query) => {
        setSearchQuery(query);
        try {
            const results = await searchVideos(query);
            setSearchResults(results || []);
            if (user) {
                await addToSearchHistory(query);
            }
        } catch (error) {
            console.error('검색 에러:', error);
            setSearchResults([]);
        }
    };

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
            {user ? (
                <Banner title="오늘의 추천 영상" subtitle="오늘의 추천 영상을 확인해보세요." />
            ) : (
                <Banner title="현재 비회원으로 이용 중입니다." subtitle="추가 서비스를 이용하시려면 로그인이 필요합니다." />
            )}

            <CategoryButtons onCategoryPress={handleCategoryPress} />


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        paddingVertical: spacing.md,
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

export default MainScreen;
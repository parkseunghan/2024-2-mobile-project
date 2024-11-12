import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
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

const MainScreen = () => {
    const navigation = useNavigation();
    const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useContext(SearchContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedVideoId, setSelectedVideoId] = useState(null);

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
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setError(null);
            const results = await searchVideos(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('검색 에러:', error);
            setError(
                error.response?.data?.error?.message ||
                '검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            );
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
});

export default MainScreen;
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { VideoList } from '@app/_components/main/VideoList';
import { SearchContext } from '@app/_context/SearchContext';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';
import { useRouter } from 'expo-router';

/**
 * 검색 결과 화면 컴포넌트
 * - 검색어에 따른 비디오 목록 표시
 * - 로딩 및 에러 상태 처리
 */
export default function SearchResultScreen() {
    const router = useRouter();
    const { searchQuery, searchResults, loading, error } = useContext(SearchContext);

    // 비디오 선택 처리
    const handleVideoSelect = (videoId) => {
        router.push(`/video-detail?videoId=${videoId}`);
    };

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.searchQuery}>"{searchQuery}" 검색 결과</Text>
            </View>

            <ScrollView style={styles.content}>
                {searchResults.length > 0 ? (
                    <VideoList
                        videos={searchResults}
                        onVideoSelect={handleVideoSelect}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: spacing.lg,
    },
    searchQuery: {
        ...typography.h2,
        marginBottom: spacing.sm,
    },
    content: {
        flex: 1,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
}); 
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
import { useEffect } from 'react';
import { useState } from 'react';
import { usePosts } from '@app/_context/PostContext';


/**
 * 검색 결과 화면 컴포넌트
 * - 검색어에 따른 비디오 목록 표시
 * - 로딩 및 에러 상태 처리
 */
export default function SearchResultScreen() {
    const router = useRouter();
    const { searchQuery, searchResults, loading, error, setSearchQuery } = useContext(SearchContext);    
    const{ posts } = usePosts();
    const [activeTab, setActiveTab] = useState('videos');

    useEffect(() => {
        return () => {
          setSearchQuery(''); // 검색어 초기화
        };
    }, [setSearchQuery]);
    
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log('Search Results in Screen:', searchResults); // 검색 결과 로깅

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

    // 검색 결과가 없는 경우 처리
    if (!searchResults || searchResults.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
        );
    }

    // 검색 결과에서 중복된 비디오 제거 및 데이터 구조 정규화
    const uniqueResults = searchResults.reduce((acc, current) => {
        if (!current) return acc;
        
        const videoId = current.id?.videoId || current.id;
        const x = acc.find(item => (item.id?.videoId || item.id) === videoId);
        
        if (!x) {
            return acc.concat([{
                id: videoId,
                title: current.snippet?.title,
                thumbnail: current.snippet?.thumbnails?.medium?.url,
                channelTitle: current.snippet?.channelTitle,
                publishedAt: current.snippet?.publishedAt,
                description: current.snippet?.description
            }]);
        }
        return acc;
    }, []);

    console.log('Formatted Results:', uniqueResults); // 포맷팅된 결과 로깅

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.searchQuery}>"{searchQuery}" 검색 결과</Text>
            </View>

            <ScrollView style={styles.content}>
                {uniqueResults.length > 0 ? (
                    <VideoList
                        videos={uniqueResults}
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
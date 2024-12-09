import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { useAuth } from '@app/_lib/hooks';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { router } from 'expo-router';

/**
 * 메인 화면 컴포넌트
 * - 카테고리 버튼 목록 표시
 * - 사용자 상태에 따른 배너 표시
 */
const MainScreen = () => {
    const { user } = useAuth();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {/* 사용자 상태에 따른 배너 */}
            <View style={styles.bannerContainer}>
                <Text style={styles.bannerTitle}>
                    {user ? "오늘의 추천 영상" : "현재 비회원으로 이용 중입니다."}
                </Text>
                <Text style={styles.bannerSubtitle}>
                    {user ? "오늘의 추천 영상을 확인해보세요." : "추가 서비스를 이용하시려면 로그인이 필요합니다."}
                </Text>
            </View>

            {/* 카테고리 버튼 목록 */}
            <CategoryButtons />
            
            {/* 이벤트 배너 */}
            
            <Pressable onPress={() => router.push('/event')} style={styles.eventBannerContainer}>
                <Image
                    source={require('../../../assets/banner.png')}
                    style={styles.eventBannerImage}
                    resizeMode="cover"
                />
            </Pressable>
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
        padding: spacing.md,
    },
    bannerContainer: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.lg,
    },
    bannerTitle: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    bannerSubtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    eventBannerContainer: {
        width: '100%',
        aspectRatio: 16 / 6,  // 비율 설정
        minHeight: 100,       // 최소 높이 보장
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 35,
        marginTop: 20,
    },
    eventBannerImage: {
        width: '100%',
        height: '100%', // 배너의 높이에 맞추어 이미지 설정
    },
});

export default MainScreen;

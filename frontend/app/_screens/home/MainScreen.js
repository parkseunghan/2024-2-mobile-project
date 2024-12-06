import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@app/_lib/hooks';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';

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
});

export default MainScreen;
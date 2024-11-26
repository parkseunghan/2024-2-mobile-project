import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import Banner from '@app/_components/main/Banner';
import { useAuth } from '@app/_utils/hooks/useAuth';

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
            {/* 사용자 상태에 따른 배너 표시 */}
            {user ? (
                <Banner title="오늘의 추천 영상" subtitle="오늘의 추천 영상을 확인해보세요." />
            ) : (
                <Banner title="현재 비회원으로 이용 중입니다." subtitle="추가 서비스를 이용하시려면 로그인이 필요합니다." />
            )}

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
        paddingVertical: spacing.md,
    },
});

export default MainScreen;
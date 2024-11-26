// Banner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

/**
 * 배너 컴포넌트
 * - 메인 화면 상단에 표시되는 배너
 * - 제목과 부제목을 표시
 * 
 * @param {string} title - 배너 제목
 * @param {string} subtitle - 배너 부제목 (선택적)
 */
const Banner = ({ title, subtitle }) => (
    <View style={styles.bannerContainer}>
        <Text style={styles.bannerTitle}>{title}</Text>
        {subtitle && <Text style={styles.bannerSubtitle}>{subtitle}</Text>}
    </View>
);

const styles = StyleSheet.create({
    bannerContainer: {
        backgroundColor: "white",
        padding: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: 12,
        margin: spacing.md,
        width: '95%',
        alignSelf: 'center',
        height: 100,
    },
    bannerTitle: {
        color: colors.text.primary,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    bannerSubtitle: {
        color: colors.text.secondary,
        fontSize: 16,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default Banner;

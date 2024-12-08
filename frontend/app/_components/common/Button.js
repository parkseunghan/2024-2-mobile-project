import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 공통 버튼 컴포넌트
 * @param {string|ReactElement} title - 버튼 텍스트 또는 커스텀 컴포넌트
 * @param {Function} onPress - 클릭 이벤트 핸들러
 * @param {boolean} disabled - 비활성화 여부
 * @param {Object} style - 추가 스타일
 * @param {Object} textStyle - 텍스트 추가 스타일
 * @param {ReactElement} icon - 버튼 아이콘
 * @param {'primary'|'secondary'|'danger'} variant - 버튼 스타일 변형
 * @param {boolean} fullWidth - 전체 너비 사용 여부
 * @param {string} subtitle - 부제목 (선택적)
 */
export const Button = ({
    title,
    onPress,
    disabled = false,
    style,
    textStyle,
    icon,
    variant = 'primary',
    fullWidth = false,
    subtitle,
}) => {
    // 제목이 문자열인 경우 Text 컴포넌트로 렌더링
    const renderTitle = () => {
        if (typeof title === 'string') {
            return (
                <Text style={[
                    styles.text,
                    styles[`${variant}Text`],
                    textStyle,
                    disabled && styles.disabledText
                ]}>
                    {title}
                </Text>
            );
        }
        return title;  // React 엘리먼트인 경우 그대로 반환
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                fullWidth && styles.fullWidth,
                style,
                disabled && styles.disabled,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.content}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <View>
                    {renderTitle()}
                    {subtitle && (
                        <Text style={[styles.subtitle, textStyle]}>
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: spacing.md,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    primary: {
        backgroundColor: colors.button.primary,
        shadowColor: colors.shadow.primary,
    },
    secondary: {
        backgroundColor: colors.button.secondary,
        shadowColor: colors.shadow.secondary,
    },
    danger: {
        backgroundColor: colors.error,
        shadowColor: colors.error,
    },
    primaryText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    dangerText: {
        color: colors.text.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.5,
    },
    disabledText: {
        color: colors.text.disabled,
    },
    pressed: {
        opacity: 0.8,
    },
    text: {
        textAlign: 'center',
    },
    subtitle: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
}); 
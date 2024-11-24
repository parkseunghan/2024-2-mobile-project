import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const Button = ({
    title,
    onPress,
    disabled = false,
    style,
    textStyle,
    icon,
    variant = 'primary',
    fullWidth = false,
}) => {
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
                <Text style={[
                    styles.text,
                    styles[`${variant}Text`],
                    textStyle,
                    disabled && styles.disabledText
                ]}>
                    {title}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    danger: {
        backgroundColor: colors.error,
    },
    primaryText: {
        color: colors.background,
        ...typography.button,
    },
    secondaryText: {
        color: colors.text.primary,
        ...typography.button,
    },
    dangerText: {
        color: colors.background,
        ...typography.button,
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
}); 
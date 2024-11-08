import React from 'react';
import { Pressable, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
        Platform.OS === 'web' && styles.webButton,
        style,
      ]}
    >
      <Text style={[
        styles.text,
        styles[`${variant}Text`],
        disabled && styles.disabledText,
        textStyle,
      ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const webStyles = Platform.OS === 'web' ? {
  cursor: 'pointer',
  outlineStyle: 'none',
  WebkitTapHighlightColor: 'transparent',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
} : {};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  webButton: {
    ...webStyles,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.background,
  },
  secondaryText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.text.disabled,
  },
}); 
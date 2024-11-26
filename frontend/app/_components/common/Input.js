import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 공통 입력 필드 컴포넌트
 * @param {string} label - 입력 필드 레이블
 * @param {string} error - 에러 메시지
 * @param {boolean} touched - 필드 터치 여부
 * @param {Object} style - 추가 스타일
 * @param {Object} containerStyle - 컨테이너 추가 스타일
 * @param {Object} props - 기타 TextInput props
 */
export const Input = ({
  label,
  error,
  touched,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && touched && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.text.secondary}
        {...props}
      />
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    marginBottom: spacing.xs,
    color: colors.text.primary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    color: colors.text.primary,
    ...typography.body,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
    ...typography.caption,
  },
}); 
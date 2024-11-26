import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

/**
 * 에러 상태를 표시하는 공통 컴포넌트
 * - 화면 중앙에 에러 메시지 표시
 * @param {string} message - 표시할 에러 메시지
 */
export const ErrorState = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
}); 
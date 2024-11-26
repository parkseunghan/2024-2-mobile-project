import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

/**
 * 로딩 상태를 표시하는 공통 컴포넌트
 * - 화면 중앙에 로딩 인디케이터 표시
 * - 전체 화면을 차지하며 중앙 정렬
 */
export const LoadingState = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
}); 
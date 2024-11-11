import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

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
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';

export function StatisticsCard({ title, value, loading }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={styles.value}>{value.toLocaleString()}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  title: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.h2,
    color: colors.primary,
  },
}); 
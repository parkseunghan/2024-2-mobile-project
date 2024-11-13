import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '@app/_styles/colors';
import { typography } from '@app/_styles/typography';
import { spacing } from '@app/_styles/spacing';

export function SearchStatistics({ data, loading, error }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data?.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>검색 데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>인기 검색어</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <View key={index} style={styles.searchItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.query}>{item.query}</Text>
            <Text style={styles.count}>{item.search_count}회</Text>
            <Text style={styles.date}>{new Date(item.search_date).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.lg,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  centerContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  searchItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginRight: spacing.md,
    minWidth: 150,
    alignItems: 'center',
  },
  rank: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  query: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.caption,
    color: colors.text.secondary,
  },
}); 
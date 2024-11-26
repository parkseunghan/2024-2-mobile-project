import React from 'react';
import { View, StyleSheet, Platform, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@app/_config/constants';

export const CategoryButtons = () => {
  const router = useRouter();

  const handleCategoryPress = (categoryId) => {
    router.push(`/category/${categoryId}`);
  };

  const renderCategoryButton = (category) => (
    <Pressable
      key={category.id}
      style={styles.button}
      onPress={() => handleCategoryPress(category.id)}
    >
      <View style={styles.buttonContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${category.color}15` }]}>
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <Text style={styles.buttonText}>{category.title}</Text>
      </View>
    </Pressable>
  );

  const firstRow = CATEGORIES.slice(0, 3);
  const secondRow = CATEGORIES.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {firstRow.map(renderCategoryButton)}
      </View>
      <View style={styles.row}>
        {secondRow.map(renderCategoryButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    width: '100%',
  },
  button: {
    width: '31%',
    height: 100,
    borderRadius: 24,
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    overflow: 'hidden',
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  buttonText: {
    color: '#2D3436',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

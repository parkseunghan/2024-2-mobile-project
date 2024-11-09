import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

const CATEGORIES = [
  { id: 'car', icon: 'car-sport', color: '#FF5733', title: '자동차 팁' },
  { id: 'home', icon: 'home', color: '#4CAF50', title: '생활 팁' },
  { id: 'travel', icon: 'airplane', color: '#FFC107', title: '여행 팁' },
  { id: 'tech', icon: 'laptop', color: '#2196F3', title: '기술 팁' },
  { id: 'food', icon: 'restaurant', color: '#9C27B0', title: '요리 팁' },
  { id: 'fashion', icon: 'shirt', color: '#FF9800', title: '패션 팁' },
];

export const CategoryButtons = ({ onCategoryPress }) => {
  const renderCategoryButton = (category) => (
    <Button
      key={category.id}
      title={category.title}
      onPress={() => onCategoryPress(category.id)}
      variant="secondary"
      style={styles.button}
      icon={<Ionicons name={category.icon} size={24} color={category.color} />}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {CATEGORIES.slice(0, 3).map(renderCategoryButton)}
      </View>
      <View style={styles.row}>
        {CATEGORIES.slice(3).map(renderCategoryButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
    height: 80,
  },
}); 
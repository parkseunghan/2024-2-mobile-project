import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@app/_config/constants';

export const CategoryButtons = () => {
  const router = useRouter();

  const handleCategoryPress = (categoryId) => {
    router.push(`/category/${categoryId}`);
  };

  // 카테고리를 2행으로 나누기
  const firstRow = CATEGORIES.slice(0, 3);
  const secondRow = CATEGORIES.slice(3);

  return (
    <View style={styles.container}>
      {/* 첫 번째 행 */}
      <View style={styles.row}>
        {firstRow.map((category) => (
          <Button
            key={category.id}
            title={category.title}
            onPress={() => handleCategoryPress(category.id)}
            icon={<Ionicons name={category.icon} size={24} color={category.color} />}
            style={styles.button}
            variant="secondary"
          />
        ))}
      </View>

      {/* 두 번째 행 */}
      <View style={styles.row}>
        {secondRow.map((category) => (
          <Button
            key={category.id}
            title={category.title}
            onPress={() => handleCategoryPress(category.id)}
            icon={<Ionicons name={category.icon} size={24} color={category.color} />}
            style={styles.button}
            variant="secondary"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.md, // 행 간격
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md, // 버튼 간격
  },
  button: {
    flex: 1,
    height: 80, // 버튼 높이 증가
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12, // 모서리 더 둥글게
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        ':hover': {
          transform: 'translateY(-2px)',
        },
      },
      ios: {
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
}); 
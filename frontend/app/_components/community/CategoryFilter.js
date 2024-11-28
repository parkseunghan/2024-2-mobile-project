import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';

export const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  const { width: windowWidth } = useWindowDimensions();
  const containerPadding = spacing.md * 2; // 좌우 패딩
  const buttonMargin = spacing.sm; // 버튼 간 마진
  const minButtonWidth = 80; // 최소 버튼 너비

  // 한 줄에 들어갈 수 있는 최대 버튼 수 계산
  const availableWidth = windowWidth - containerPadding;
  const buttonsPerRow = Math.floor(availableWidth / (minButtonWidth + buttonMargin));
  const buttonWidth = (availableWidth - (buttonMargin * (buttonsPerRow - 1))) / buttonsPerRow;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buttonContainer}>
          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.category,
                { width: buttonWidth },
                selectedCategory === category && styles.selectedCategory
              ]}
              onPress={() => onSelect(category)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  category: {
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  selectedCategoryText: {
    color: colors.background,
  },
}); 
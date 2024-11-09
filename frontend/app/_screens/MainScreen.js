import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SearchBar } from '@app/_components/main/SearchBar';
import { CategoryButtons } from '@app/_components/main/CategoryButtons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

const MainScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: 검색 API 연동
    console.log('검색어:', searchQuery);
  };

  const handleCategoryPress = (categoryId) => {
    // TODO: 카테고리별 페이지 이동
    console.log('선택된 카테고리:', categoryId);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmit={handleSearch}
      />
      <CategoryButtons onCategoryPress={handleCategoryPress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.md,
  },
});

export default MainScreen;
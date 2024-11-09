import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@app/_components/common/Input';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

export const SearchBar = ({ searchQuery, onSearchChange, onSubmit }) => {
  return (
    <View style={styles.searchContainer}>
      <Input
        value={searchQuery}
        onChangeText={onSearchChange}
        onSubmitEditing={onSubmit}
        placeholder="어떤 팁을 찾으시나요?"
        returnKeyType="search"
        leftIcon={<Ionicons name="search" size={24} color={colors.text.secondary} />}
        containerStyle={styles.inputContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: 0,
  },
}); 
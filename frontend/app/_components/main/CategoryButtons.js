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

  const renderCategoryButton = (category) => (
    <View 
      key={category.id} 
      style={styles.buttonWrapper}
    >
      <View 
        style={[
          styles.button,
          Platform.select({
            ios: styles.shadowIOS,
            android: styles.shadowAndroid,
            web: styles.shadowWeb,
          })
        ]}
        onStartShouldSetResponder={() => {
          handleCategoryPress(category.id);
          return true;
        }}
      >
        <View style={[styles.iconCircle, { backgroundColor: `${category.color}15` }]}>
          <Ionicons 
            name={category.icon} 
            size={24} 
            color={category.color} 
          />
        </View>
        <Text style={styles.buttonText}>{category.title}</Text>
      </View>
    </View>
  );

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
      flex: 1,
      padding: spacing.md,
      backgroundColor: '#F8F9FA',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    button: {
      flex: 1,
      marginHorizontal: spacing.xs,
      height: 100,
      borderRadius: 24,
      backgroundColor: 'white',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.sm,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3.5,
      position: 'relative',
      overflow: 'hidden',
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs,
    },
    buttonText: {
      color: '#2D3436',
      fontSize: 14,
      fontWeight: '600',
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      backgroundColor: 'white',
      opacity: 0.05,
      borderRadius: 24,
    },
  });
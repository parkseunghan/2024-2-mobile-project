import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { Menu } from './Menu';

export function Header({ title, showBackButton, onBackPress }) {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push('/(tabs)/home');
    }
  };

  return (
    <>
      <View style={styles.header}>
        {showBackButton && (
          <Pressable onPress={handleBackPress} style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={24} color={colors.text.primary} />
          </Pressable>
        )}
        <Text style={[styles.title, showBackButton && styles.titleWithBack]}>
          {title}
        </Text>
        <View style={styles.rightContainer}>
          <Pressable onPress={handleProfilePress} style={styles.iconButton}>
            {user ? (
              <FontAwesome5 name="user-circle" size={24} color={colors.primary} />
            ) : (
              <FontAwesome5 name="user" size={24} color={colors.text.secondary} />
            )}
          </Pressable>
          <Pressable 
            onPress={() => setIsMenuVisible(true)} 
            style={styles.iconButton}
          >
            <FontAwesome5 name="bars" size={24} color={colors.text.primary} />
          </Pressable>
        </View>
      </View>

      <Menu 
        isVisible={isMenuVisible} 
        onClose={() => setIsMenuVisible(false)} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    flex: 1,
    textAlign: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 80,
  },
  iconButton: {
    padding: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    minWidth: 40,
  },
  titleWithBack: {
    marginHorizontal: spacing.md,
  },
}); 
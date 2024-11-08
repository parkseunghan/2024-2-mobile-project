import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_utils/hooks/useAuth';

export function Menu({ isVisible, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [slideAnim] = useState(new Animated.Value(300));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  }, [isVisible]);

  const menuItems = [
    { 
      title: '홈', 
      icon: 'home', 
      onPress: () => {
        router.push('/(tabs)/home');
        onClose();
      }
    },
    { 
      title: '커뮤니티', 
      icon: 'users', 
      onPress: () => {
        router.push('/(tabs)/community');
        onClose();
      }
    },
    { 
      title: '프로필', 
      icon: 'user-circle', 
      onPress: () => {
        router.push('/(tabs)/profile');
        onClose();
      }
    },
    ...(user?.role === 'admin' ? [{
      title: router.pathname?.includes('(admin)') ? '일반 화면으로' : '관리자 대시보드',
      icon: router.pathname?.includes('(admin)') ? 'home' : 'cog',
      onPress: () => {
        if (router.pathname?.includes('(admin)')) {
          router.push('/(tabs)/home');
        } else {
          router.push('/(admin)/dashboard');
        }
        onClose();
      }
    }] : [])
  ];

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace('/login');
  };

  const animatedStyle = Platform.OS === 'web' 
    ? { transform: [{ translateX: slideAnim }] }
    : { transform: [{ translateX: slideAnim }] };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>메뉴</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={24} color={colors.text.primary} />
            </Pressable>
          </View>

          <ScrollView style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <Pressable
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <FontAwesome5 name={item.icon} size={20} color={colors.primary} />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            {user ? (
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <FontAwesome5 name="sign-out-alt" size={20} color={colors.error} />
                <Text style={[styles.menuItemText, { color: colors.error }]}>
                  로그아웃
                </Text>
              </Pressable>
            ) : (
              <View style={styles.authButtons}>
                <Pressable 
                  style={styles.authButton} 
                  onPress={() => {
                    router.push('/login');
                    onClose();
                  }}
                >
                  <FontAwesome5 name="sign-in-alt" size={20} color={colors.primary} />
                  <Text style={styles.menuItemText}>로그인</Text>
                </Pressable>
                <Pressable 
                  style={styles.authButton} 
                  onPress={() => {
                    router.push('/signup');
                    onClose();
                  }}
                >
                  <FontAwesome5 name="user-plus" size={20} color={colors.primary} />
                  <Text style={styles.menuItemText}>회원가입</Text>
                </Pressable>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: colors.background,
    height: '100%',
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
  },
  closeButton: {
    padding: spacing.sm,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    ...typography.body,
    marginLeft: spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  authButtons: {
    gap: spacing.sm,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
}); 
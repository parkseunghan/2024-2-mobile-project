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
            title: '설정',
            icon: 'cog',
            onPress: () => {
                router.push('/(tabs)/setting');
                onClose();
            }
        },
        ...(user?.role === 'admin' ? [{
            title: router.pathname?.includes('(admin)') ? '일반 화면으로' : '관리자 설정',
            icon: router.pathname?.includes('(admin)') ? 'home' : 'shield-alt',
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

    const animatedStyle = {
        transform: [{ translateX: slideAnim }]
    };

    const renderMenuItem = (item, index) => (
        <Pressable
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
        >
            <View style={styles.menuItemContent}>
                <FontAwesome5 name={item.icon} size={20} color={colors.primary} />
                <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
        </Pressable>
    );

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

                    <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
                        {menuItems.map(renderMenuItem)}
                    </ScrollView>

                    <View style={styles.footer}>
                        {user ? (
                            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                                <View style={styles.menuItemContent}>
                                    <FontAwesome5 name="sign-out-alt" size={20} color={colors.error} />
                                    <Text style={[styles.menuItemText, { color: colors.error }]}>
                                        로그아웃
                                    </Text>
                                </View>
                            </Pressable>
                        ) : (
                            <View style={styles.authButtons}>
                                {['로그인', '회원가입'].map((title, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.authButton}
                                        onPress={() => {
                                            router.push(title === '로그인' ? '/login' : '/signup');
                                            onClose();
                                        }}
                                    >
                                        <View style={styles.menuItemContent}>
                                            <FontAwesome5 
                                                name={title === '로그인' ? 'sign-in-alt' : 'user-plus'} 
                                                size={20} 
                                                color={colors.primary} 
                                            />
                                            <Text style={styles.menuItemText}>{title}</Text>
                                        </View>
                                    </Pressable>
                                ))}
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
        ...(Platform.OS === 'web' ? {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        } : {
            shadowColor: colors.text.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        })
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
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    }
}); 
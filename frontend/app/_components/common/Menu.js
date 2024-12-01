import React, { useEffect } from 'react';
import { View, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from './MenuItem';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useAuth } from '@app/_lib/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function Menu({ isVisible, onClose, anchorPosition }) {
    const router = useRouter();
    const { user, logout } = useAuth();
    
    // isAdmin 상태를 직접 계산
    const isAdmin = user?.role === 'admin' || user?.role === 'god';

    console.log('Current user:', user);
    console.log('Is admin:', isAdmin);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
            // 로컬 스토리지 초기화
            await AsyncStorage.clear();
            // 홈으로 이동 후 새로고침 효과
            router.replace('/');
        } catch (error) {
            console.error('로그아웃 에러:', error);
            Alert.alert('오류', '로그아웃에 실패했습니다.');
        }
    };

    // 로그인 핸들러 추가
    const handleLogin = () => {
        router.replace('/(auth)/login');
        onClose();
    };

    // 기본 메뉴 아이템 (모든 사용자에게 보임)
    const commonMenuItems = [
        {
            icon: "home",
            label: "홈",
            onPress: () => {
                router.push('/home');
                onClose();
            }
        },
        {
            icon: "trophy",
            label: "랭킹",
            onPress: () => {
                router.push('/ranking');
                onClose();
            }
        },
        {
            icon: "users",
            label: "꿀팁 공유",
            onPress: () => {
                router.push('/community');
                onClose();
            }
        },
        {
            icon: "calendar",
            label: "이벤트",
            onPress: () => {
                router.push('/event');
                onClose();
            }
        },
        {
            icon: "cog",
            label: "설정",
            onPress: () => {
                router.push('/setting');
                onClose();
            }
        },
    ];

    // 관리자 전용 메뉴
    const adminMenuItems = isAdmin ? [
        {
            icon: "shield-alt",
            label: "관리자 대시보드",
            onPress: () => {
                router.push('/(admin)/dashboard');
                onClose();
            }
        },
        {
            icon: "cog",
            label: "카테고리 관리",
            onPress: () => {
                router.push('/(admin)/categories');
                onClose();
            }
        },
        {
            icon: "users-cog",
            label: "사용자 관리",
            onPress: () => {
                router.push('/(admin)/users');
                onClose();
            }
        }
    ] : [];

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.menuContainer, {
                    position: 'absolute',
                    top: anchorPosition?.y + 45 || 0,
                    right: spacing.md,
                }]}>
                    <View style={styles.menu}>
                        {/* 공통 메뉴 */}
                        {commonMenuItems.map((item, index) => (
                            <MenuItem key={`common-${index}`} {...item} />
                        ))}

                        {/* 구분선 */}
                        {user && <View style={styles.divider} />}

                        {/* 관리자 메뉴 */}
                        {isAdmin && adminMenuItems.length > 0 && (
                            <>
                                <View style={styles.divider} />
                                {adminMenuItems.map((item, index) => (
                                    <MenuItem key={`admin-${index}`} {...item} />
                                ))}
                            </>
                        )}

                        {/* 로그인/로그아웃 */}
                        <View style={styles.divider} />
                        {user ? (
                            <MenuItem
                                icon="sign-out-alt"
                                label="로그아웃"
                                onPress={handleLogout}
                                variant="danger"
                            />
                        ) : (
                            <MenuItem
                                icon="sign-in-alt"
                                label="로그인"
                                onPress={handleLogin}
                            />
                        )}
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        minWidth: 200,
    },
    menu: {
        padding: spacing.sm,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.xs,
    }
}); 
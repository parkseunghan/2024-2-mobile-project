import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from 'react-native';
import { typography } from '@app/_styles/typography';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const APP_VERSION = '1.0.0'; // 앱 버전 정보

    const settingsSections = [
        {
            title: '설정',
            items: [
                {
                    title: '알림 설정',
                    icon: 'bell',
                    onPress: () => router.push('/settings/notifications')
                },
                {
                    title: '관심 키워드 설정',
                    icon: 'tags',
                    onPress: () => router.push('/settings/keywords')
                },
                {
                    title: '다크모드',
                    icon: 'moon',
                    onPress: () => router.push('/settings/display')
                }
            ]
        },
        {
            title: '계정',
            items: [
                {
                    title: '계정 정보 확인',
                    icon: 'id-card',
                    onPress: () => router.push('/settings/account-info'),
                    show: !!user
                },
                {
                    title: '닉네임 변경',
                    icon: 'user-edit',
                    onPress: () => router.push('/settings/change-nickname'),
                    show: !!user
                },
                {
                    title: '비밀번호 변경',
                    icon: 'key',
                    onPress: () => router.push('/settings/change-password'),
                    show: !!user
                },
                {
                    title: '회원 탈퇴',
                    icon: 'user-times',
                    onPress: () => router.push('/settings/delete-account'),
                    show: !!user,
                    variant: 'danger'
                }
            ]
        },
        {
            title: '이용 안내',
            items: [
                {
                    title: '이용 제한 내역',
                    icon: 'ban',
                    onPress: () => router.push('/settings/restrictions'),
                    show: !!user
                },
                {
                    title: '커뮤니티 이용 규칙',
                    icon: 'book',
                    onPress: () => router.push('/settings/community-rules')
                },
                {
                    title: '문의하기',
                    icon: 'question-circle',
                    onPress: () => router.push('/settings/support')
                }
            ]
        },
        {
            title: '약관 및 정책',
            items: [
                {
                    title: '서비스 이용 약관',
                    icon: 'file-contract',
                    onPress: () => router.push('/settings/terms')
                },
                {
                    title: '개인정보 처리방침',
                    icon: 'shield-alt',
                    onPress: () => router.push('/settings/privacy')
                },
                {
                    title: '정보 동의 설정',
                    icon: 'check-circle',
                    onPress: () => router.push('/settings/consent')
                }
            ]
        }
    ];

    const handleLogout = async () => {
        await logout();
        router.replace('/login');
    };

    return (
        <ScrollView style={styles.container}>
            {settingsSections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.items
                        .filter(item => item.show === undefined || item.show)
                        .map((item, itemIndex) => (
                            <Button
                                key={itemIndex}
                                title={item.title}
                                onPress={item.onPress}
                                variant={item.variant || 'secondary'}
                                icon={<FontAwesome5 
                                    name={item.icon} 
                                    size={20} 
                                    color={item.variant === 'danger' ? colors.background : colors.primary} 
                                />}
                                style={styles.button}
                                fullWidth
                            />
                        ))}
                </View>
            ))}

            {user ? (
                <Button
                    title="로그아웃"
                    onPress={handleLogout}
                    variant="danger"
                    icon={<FontAwesome5 name="sign-out-alt" size={20} color={colors.background} />}
                    style={styles.logoutButton}
                    fullWidth
                />
            ) : (
                <Button
                    title="로그인"
                    onPress={() => router.push('/login')}
                    variant="primary"
                    icon={<FontAwesome5 name="sign-in-alt" size={20} color={colors.background} />}
                    style={styles.logoutButton}
                    fullWidth
                />
            )}

            <Text style={styles.version}>버전 {APP_VERSION}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    section: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sectionTitle: {
        ...typography.h3,
        marginBottom: spacing.md,
        color: colors.text.primary,
    },
    button: {
        marginBottom: spacing.sm,
    },
    logoutButton: {
        margin: spacing.lg,
    },
    version: {
        ...typography.caption,
        textAlign: 'center',
        color: colors.text.secondary,
        marginBottom: spacing.xl,
    }
});

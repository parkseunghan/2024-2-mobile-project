import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@app/_context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    // 관리자 권한 체크
    if (user?.role !== 'admin' && user?.role !== 'god') {
        return (
            <View style={styles.container}>
                <Text>접근 권한이 없습니다.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>관리자 대시보드</Text>
            
            <View style={styles.menuGrid}>
                {/* 기존 메뉴들 */}
                <Link href="/users" asChild>
                    <Pressable style={styles.menuItem}>
                        <Text style={styles.menuTitle}>사용자 관리</Text>
                        <Text style={styles.menuDescription}>사용자 목록 조회 및 권한 관리</Text>
                    </Pressable>
                </Link>

                <Link href="/statistics" asChild>
                    <Pressable style={styles.menuItem}>
                        <Text style={styles.menuTitle}>통계</Text>
                        <Text style={styles.menuDescription}>사이트 사용 통계 확인</Text>
                    </Pressable>
                </Link>

                {/* 새로운 카테고리 관리 메뉴 */}
                <Link href="/categories" asChild>
                    <Pressable style={styles.menuItem}>
                        <Text style={styles.menuTitle}>카테고리 관리</Text>
                        <Text style={styles.menuDescription}>게시글 카테고리 생성 및 관리</Text>
                    </Pressable>
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuGrid: {
        gap: 15,
    },
    menuItem: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    menuDescription: {
        fontSize: 14,
        color: '#666',
    },
}); 
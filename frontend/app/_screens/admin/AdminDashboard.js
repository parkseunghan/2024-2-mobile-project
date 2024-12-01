import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminDashboard() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>관리자 대시보드</Text>
            {/* 여기에 대시보드 내용 추가 */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
}); 
import React from 'react';
import { StyleSheet, Text, View, Pre, Pressable } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to TipTube</Text>
            <Text style={styles.subtitle}>Get the best tips and tricks here!</Text>

            <View style={styles.textContainer}>
                <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.clickableText}>로그인</Text>
                </Pressable>
                
                <Pressable onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.clickableText}>회원가입</Text>

                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    textContainer: {
        flexDirection: 'row', // 가로로 텍스트 배치
        justifyContent: 'space-between', // 텍스트 간격 조정
        width: '60%', // 텍스트 컨테이너의 너비 설정
    },
    clickableText: {
        fontSize: 20,
        color: 'black',
        marginHorizontal: 10, // 텍스트 간격
        textDecorationLine: 'underline', // 클릭 가능한 느낌을 주기 위해 밑줄 추가
    },
});

export default HomeScreen;
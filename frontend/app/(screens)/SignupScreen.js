import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable, StyleSheet } from 'react-native';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, confirmPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('성공', '회원가입이 완료되었습니다!');
                navigation.navigate('Login');
            } else {
                Alert.alert('오류', data.message);
            }
        } catch (error) {
            Alert.alert('오류', '회원가입 중 문제가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="사용자 이름"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address" // 이메일 전용 키보드
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <Pressable style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>회원가입</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    pink: {
        color: 'black',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'black', // 버튼 배경색
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 5,
        elevation: 3, // 안드로이드에서 그림자 효과
        shadowColor: '#000', // iOS에서 그림자 색상
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2.62,
    },
    buttonText: {
        color: 'white', // 버튼 텍스트 색상
      
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SignupScreen;

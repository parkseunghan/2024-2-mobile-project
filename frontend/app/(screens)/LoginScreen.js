import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native';
import axios from 'axios';  // axios import 추가
import { useRouter } from 'expo-router'; // useRouter 사용

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter(); // 라우터 사용 준비

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            console.log('Login Success:', response.data);
            alert("로그인 성공!");
            // 로그인 성공 시, 다음 화면으로 이동
            router.push('/home'); // 성공 후 home 페이지로 이동 (home은 이동할 경로)

        } catch (err) {
            // 백엔드에서 받은 에러 메시지를 설정
            setError(err.response?.data?.message || '로그인 실패');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
                inputMode="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
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

export default LoginScreen;

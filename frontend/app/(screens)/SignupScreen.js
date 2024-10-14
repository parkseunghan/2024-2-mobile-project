import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router'; // useRouter 사용


const SignupScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                email,
                password,
                confirmPassword,
            });
            console.log('Signup Success:', response.data);
            alert("회원가입 성공!");
            navigation.navigate('Login');
        } catch (err) {
            // 백엔드에서 받은 에러 메시지를 설정
            setError(err.response?.data?.message || '회원');
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
                inputMode="email-address" // 이메일 전용 키보드
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
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
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

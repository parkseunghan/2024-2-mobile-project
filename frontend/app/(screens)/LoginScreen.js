import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                // 로그인 성공 후 /app/(tabs)/home.js로 이동
                router.push('(tabs)/home'); // 'HomeTab' 스크린으로 이동
            } else {
                Alert.alert('오류', data.message);
            }
        } catch (error) {
            Alert.alert('오류', '로그인 중 문제가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="이메일"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
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

export default LoginScreen;

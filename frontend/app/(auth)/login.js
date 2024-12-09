import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { spacing } from '@app/_styles/spacing';
import { useAuth } from '@app/_lib/hooks';
import { colors } from '@app/_styles/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signupEmail, setSignupEmail, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: signupEmail || '', password: '' });
  const [loading, setLoading] = useState(false);

  // 애니메이션 값
  const loginScale = useRef(new Animated.Value(1)).current;
  const signupScale = useRef(new Animated.Value(1)).current;
  const guestScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => setSignupEmail('');
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/(tabs)/home');
    }
  }, [isLoading, user]);

  if (isLoading) {
    return null;
  }

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password) {
      Alert.alert('알림', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email.trim(), formData.password);
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || '로그인에 실패했습니다.';
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 애니메이션 함수
  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      <View style={styles.form}>
        <Input
          label="이메일"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="이메일을 입력하세요"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Input
          label="비밀번호"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: loginScale }] }}>
          <Pressable
            style={styles.loginButton}
            onPress={handleLogin}
            onPressIn={() => handlePressIn(loginScale)}
            onPressOut={() => handlePressOut(loginScale)}
          >
            <Text style={styles.buttonText}>{loading ? '로그인 중...' : '로그인'}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: signupScale }] }}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/signup')}
            onPressIn={() => handlePressIn(signupScale)}
            onPressOut={() => handlePressOut(signupScale)}
          >
            <Text style={styles.buttonText}>계정이 없으신가요? 회원가입</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: guestScale }] }}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)/home')}
            onPressIn={() => handlePressIn(guestScale)}
            onPressOut={() => handlePressOut(guestScale)}
          >
            <Text style={styles.buttonText}>비회원으로 이용하기</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // 🍯 꿀 느낌의 배경색
  },
  contentContainer: {
    padding: spacing.xl,
    flexGrow: 1,
  },
  form: {
    marginBottom: spacing.xl,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#FFB100',
    borderWidth: 2,
    padding: 10,
  },
  buttons: {
    gap: spacing.md,
  },
  loginButton: {
    backgroundColor: '#FFA500',
    borderRadius: 25,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFA000',
    borderRadius: 25,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

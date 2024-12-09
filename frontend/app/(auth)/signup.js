import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Platform, Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_lib/hooks';
import { AUTH } from '@app/_config/constants';

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  // 애니메이션 참조
  const signupScale = useRef(new Animated.Value(1)).current;
  const loginScale = useRef(new Animated.Value(1)).current;

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

  const handleSignup = async () => {
    if (!formData.username.trim() || !formData.email.trim() || 
        !formData.password || !formData.confirmPassword) {
      Alert.alert('알림', '모든 필드를 입력해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < AUTH.MIN_PASSWORD_LENGTH) {
      Alert.alert('알림', `비밀번호는 최소 ${AUTH.MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('알림', '올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setLoading(true);
      await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const successMessage = '회원가입이 완료되었습니다.';
      Platform.OS === 'web' ? window.alert(successMessage) : Alert.alert('성공', successMessage, [
        { text: '확인', onPress: () => router.replace('/login') },
      ]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      Platform.OS === 'web' ? window.alert(errorMessage) : Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>TipTube의 새로운 멤버가 되어주세요</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="사용자 이름"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          placeholder="사용자 이름을 입력하세요"
        />

        <Input
          label="이메일"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="이메일을 입력하세요"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="비밀번호"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="비밀번호를 입력하세요"
          secureTextEntry
        />

        <Input
          label="비밀번호 확인"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          placeholder="비밀번호를 다시 입력하세요"
          secureTextEntry
        />
      </View>

      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: signupScale }] }}>
          <Pressable
            style={styles.signupButton}
            onPress={handleSignup}
            onPressIn={() => handlePressIn(signupScale)}
            onPressOut={() => handlePressOut(signupScale)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "가입 중..." : "회원가입"}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: loginScale }] }}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
            onPressIn={() => handlePressIn(loginScale)}
            onPressOut={() => handlePressOut(loginScale)}
          >
            <Text style={styles.buttonText}>이미 계정이 있으신가요? 로그인</Text>
          </Pressable>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: spacing.xl,
  },
  buttons: {
    gap: spacing.md,
  },
  signupButton: {
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
  secondaryButton: {
    backgroundColor: '#FFA000',
    borderRadius: 25,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

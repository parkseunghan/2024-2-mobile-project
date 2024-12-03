import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { Button } from '@app/_components/common/Button';
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
      console.log('Attempting signup with:', formData);

      await signup({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      if (Platform.OS === 'web') {
        window.alert('회원가입이 완료되었습니다.');
        router.replace('/login');
      } else {
        Alert.alert('성공', '회원가입이 완료되었습니다.', [
          {
            text: '확인',
            onPress: () => router.replace('/login'),
          },
        ]);
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      
      if (Platform.OS === 'web') {
        window.alert(errorMessage);
      } else {
        Alert.alert('오류', errorMessage);
      }
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
        <Button
          title={loading ? "가입 중..." : "회원가입"}
          onPress={handleSignup}
          disabled={loading}
          variant="primary"
          fullWidth
        />
        <Button
          title="이미 계정이 있으신가요? 로그인"
          onPress={() => router.push('/login')}
          variant="secondary"
          fullWidth
        />
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
  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
  }
}); 
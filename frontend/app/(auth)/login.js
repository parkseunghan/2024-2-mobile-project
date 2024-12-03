import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_lib/hooks';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signupEmail, setSignupEmail, user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: signupEmail || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    return () => {
      setSignupEmail('');
    };
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
      console.log('Login attempt with:', { 
        email: formData.email.trim(), 
        password: formData.password 
      });
      
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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>TipTube에 오신 것을 환영합니다</Text>
      </View>

      <View style={styles.form}>
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
      </View>

      <View style={styles.buttons}>
        <Button
          title={loading ? "로그인 중..." : "로그인"}
          onPress={handleLogin}
          disabled={loading}
          fullWidth
          variant="primary"
        />
        <Button
          title="계정이 없으신가요? 회원가입"
          onPress={() => router.push('/signup')}
          fullWidth
          variant="secondary"
        />
        <Button
          title="비회원으로 이용하기"
          onPress={() => router.replace('/(tabs)/home')}
          fullWidth
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.xl,
    flexGrow: 1,
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
  buttonStyle: {
    backgroundColor: "blue",
  },
});
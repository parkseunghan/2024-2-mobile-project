import React, { useRef } from 'react';
import { View, Image, StyleSheet, Pressable, Text, Animated } from 'react-native'; // 🚀 Image, Pressable, Animated 추가
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons'; // 🚀 벌 아이콘 추가
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // 🚀 각 버튼에 독립적인 애니메이션 효과
  const loginScale = useRef(new Animated.Value(1)).current;
  const signupScale = useRef(new Animated.Value(1)).current;

  // 🚀 버튼 누를 때 애니메이션 작동 (눌렀을 때 작아짐)
  const handlePressIn = (scale) => {
    Animated.spring(scale, {
      toValue: 0.9, // 누를 때 90% 크기로 축소
      useNativeDriver: true, 
    }).start();
  };

  // 🚀 버튼 뗄 때 애니메이션 작동 (다시 원래 크기로 돌아감)
  const handlePressOut = (scale) => {
    Animated.spring(scale, {
      toValue: 1, // 원래 크기로 복구
      friction: 3, // 마찰력으로 자연스러운 복구
      tension: 40, // 긴장감 있는 복구 속도 조절
      useNativeDriver: true, 
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* 🚀 로고 이미지 추가 */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo} 
        />
      </View>

      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: loginScale }] }}>
          <Pressable 
            style={styles.loginButton} 
            onPress={() => router.push('/login')} 
            onPressIn={() => handlePressIn(loginScale)} 
            onPressOut={() => handlePressOut(loginScale)}
          >
            <FontAwesome5 name="sign-in-alt" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>로그인</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: signupScale }] }}>
          <Pressable 
            style={styles.signupButton} 
            onPress={() => router.push('/signup')} 
            onPressIn={() => handlePressIn(signupScale)} 
            onPressOut={() => handlePressOut(signupScale)}
          >
            <FontAwesome5 name="user-plus" size={20} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>회원가입</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150, // 너비 조절
    height: 150, // 높이 조절
    borderRadius: 75, // 🔥 동그랗게 (너비/높이의 절반)
    borderWidth: 4, // 🔥 테두리 두께
    borderColor: '#FFB100', // 🔥 테두리 색상
    overflow: 'hidden', // 🔥 테두리 바깥의 이미지 잘라내기
    resizeMode: 'cover', // 🔥 이미지가 꽉 채워지도록
  },
  
  buttons: {
    gap: spacing.md,
  },
  loginButton: {
    backgroundColor: '#FFB100', // 🍯 꿀 색상
    borderRadius: 25, // 🚀 둥근 버튼
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#FFA000', // 그림자 색상
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  signupButton: {
    backgroundColor: '#FFA500', // 🍯 꿀에 가까운 오렌지 색상
    borderRadius: 25, // 🚀 둥근 버튼
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7F50', // 그림자 색상
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonIcon: {
    marginRight: 8, // 아이콘과 텍스트 간격
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
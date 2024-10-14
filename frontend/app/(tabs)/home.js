// (tabs)/HomeTab.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../(screens)/LoginScreen'; // 추가할 스크린 임포트
import HomeScreen from '../(screens)/HomeScreen'; // 홈 화면 컴포넌트 분리
import SignupScreen from '../(screens)/SignupScreen';
import ProfileScreen from '../(screens)/ProfileScreen';

const Stack = createStackNavigator(); // 스택 내비게이터 생성

const HomeTab = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: '홈' }} // 홈 스크린 옵션
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: '로그인' }} // 로그인 스크린 옵션
            />
            <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ title: '회원가입' }} // 로그인 스크린 옵션
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: '프로필' }} // 로그인 스크린 옵션
            />
        </Stack.Navigator>
    );
};

export default HomeTab;

// app/navigation/AppNavigation.js
import React from 'react'; // React 라이브러리 임포트
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // 하단 탭 내비게이션 임포트
import HomeScreen from '../(screens)/HomeScreen'; // 홈 스크린 임포트
import SettingScreen from '../(screens)/SettingScreen'; // 설정 스크린 임포트

const Tab = createBottomTabNavigator(); // 탭 내비게이터 생성

const AppNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} // 헤더 숨기기
      />

      <Tab.Screen 
        name="Setting" 
        component={SettingScreen} 
        options={{ headerShown: false }} // 헤더 숨기기
      />
    </Tab.Navigator>
  );
};

export default AppNavigation; // AppNavigation 컴포넌트 내보내기

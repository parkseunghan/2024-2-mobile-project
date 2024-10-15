import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingScreen from '../(screens)/SettingScreen';
import AdminScreen from '../(screens)/AdminScreen';

const Stack = createStackNavigator(); // 스택 내비게이터 생성

const SettingTab = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Setting"
                component={SettingScreen}
                options={{ title: '설정' }} // 홈 스크린 옵션
            />
            <Stack.Screen
                name="Admin"
                component={AdminScreen}
                options={{ title: '관리' }} // 홈 스크린 옵션
            />
        </Stack.Navigator>
    );
};

export default SettingTab;

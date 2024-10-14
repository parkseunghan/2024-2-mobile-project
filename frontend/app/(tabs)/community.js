import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../(screens)/CommunityScreen';

const Stack = createStackNavigator(); // 스택 내비게이터 생성

const CommunityTab = () => {
    return (
        <Stack.Navigator >
            <Stack.Screen
                name="Setting"
                component={CommunityScreen}
                options={{ title: '커뮤니티' }} // 홈 스크린 옵션
            />
        </Stack.Navigator>
    );
};

export default CommunityTab;

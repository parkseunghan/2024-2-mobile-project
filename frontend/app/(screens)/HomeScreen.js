// app/screens/HomeScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePostScreen from './CreatePostScreen';
import PostDetailScreen from './PostDetailScreen';
import BoardScreen from './BoardScreen';
import CategoryScreen from './CategoryScreen';


const Stack = createNativeStackNavigator();

const HomeScreen = () => {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name="Category"
                component={CategoryScreen}
                options={{ title: '카테고리' }} // 헤더 이름을 게시판으로 설정
            />
        </Stack.Navigator>

    );
};

export default HomeScreen;

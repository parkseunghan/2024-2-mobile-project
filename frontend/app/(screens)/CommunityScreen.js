import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CreatePostScreen from './CreatePostScreen';
import PostDetailScreen from './PostDetailScreen';
import BoardScreen from './BoardScreen';


const Stack = createNativeStackNavigator();

const CommunityScreen = () => {
    return (

        <Stack.Navigator>
            <Stack.Screen
                name="Board"
                component={BoardScreen}
                options={{ title: '게시판' }} // 헤더 이름을 게시판으로 설정
            />
            <Stack.Screen
                name="CreatePost"
                component={CreatePostScreen}
                options={{ title: '게시물 작성' }} // 헤더 이름을 게시물 작성으로 설정
            />
            <Stack.Screen
                name="PostDetail"
                component={PostDetailScreen}
                options={{ title: '게시물 내용' }} // 헤더 이름을 게시물로 설정
            />
        </Stack.Navigator>

    );
};

export default CommunityScreen;

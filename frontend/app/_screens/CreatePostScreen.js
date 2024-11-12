import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreatePostScreen = () => {
    const [postText, setPostText] = useState('');
    const navigation = useNavigation();

    // 게시글 작성 함수
    const handlePost = () => {
        const newPost = {
            id: Date.now(),
            text: postText,
            media: null, // 미디어 없이 게시글만 작성
            likes: 0,
            dislikes: 0,
            comments: [],
        };
        navigation.navigate('Board', { newPost });
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TextInput
                placeholder="게시글을 작성하세요..."
                value={postText}
                onChangeText={setPostText}
                style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />
            <Button title="게시글 올리기" onPress={handlePost} />
        </View>
    );
};

export default CreatePostScreen;

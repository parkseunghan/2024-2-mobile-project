import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePostScreen = ({ navigation }) => {
    const [newPost, setNewPost] = useState(''); // 새로운 게시물 입력 상태

    const addPost = async () => {
        if (!newPost) return; // 입력이 비어있으면 반환

        // 기존 게시물 불러오기
        const storedPosts = await AsyncStorage.getItem('posts');
        const posts = storedPosts ? JSON.parse(storedPosts) : [];
        
        const updatedPosts = [...posts, { id: Date.now().toString(), content: newPost }];
        
        // 게시물 저장
        try {
            await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
            navigation.navigate('Board', { newPost: { id: Date.now().toString(), content: newPost } }); // 게시판 화면으로 돌아가면서 새 게시물 전달
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="게시물 작성..."
                value={newPost}
                onChangeText={setNewPost}
            />
            <Button title="게시물 올리기" onPress={addPost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default CreatePostScreen;
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostDetailScreen = ({ route, navigation }) => {
    const { post } = route.params;

    const deletePost = async () => {
        const storedPosts = await AsyncStorage.getItem('posts');
        const posts = storedPosts ? JSON.parse(storedPosts) : [];
        const updatedPosts = posts.filter(item => item.id !== post.id);
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
        navigation.goBack(); // 이전 화면으로 돌아가기
    };

    return (
        <View style={styles.container}>
            <Text style={styles.postContent}>{post.content}</Text>
            <Button title="삭제" onPress={deletePost} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    postTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postContent: {
        fontSize: 16,
        marginBottom: 20,
    },
});

export default PostDetailScreen;
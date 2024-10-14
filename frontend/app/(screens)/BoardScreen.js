import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BoardScreen = () => {
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();

    // 게시물 로드 함수
    const loadPosts = async () => {
        try {
            const storedPosts = await AsyncStorage.getItem('posts');
            if (storedPosts) {
                setPosts(JSON.parse(storedPosts));
            }
        } catch (error) {
            console.error('게시물 로드 오류:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadPosts(); // 화면이 포커스될 때마다 게시물 로드
        });

        return unsubscribe; // 클린업 함수
    }, [navigation]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.postItem}
            onPress={() => navigation.navigate('PostDetail', { post: item })}
        >
            <Text style={styles.postContent}>{item.content}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Button
                title="게시물 작성"
                onPress={() => navigation.navigate('CreatePost')}
            />
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    postItem: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
    },
});

export default BoardScreen;
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const LikedPostsScreen = ({ route, navigation }) => {
    const { likedPosts, updatePost } = route.params; // updatePost 전달

    const renderPost = ({ item }) => (
        <TouchableOpacity
            style={styles.postContainer}
            onPress={() => navigation.navigate('PostDetail', { post: item, updatePost })}
        >
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postAuthor}>{item.author}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>좋아요 저장소</Text>
            {likedPosts.length > 0 ? (
                <FlatList
                    data={likedPosts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                <Text style={styles.emptyText}>좋아요를 누른 게시글이 없습니다.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    postContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    postTitle: { fontSize: 16, fontWeight: 'bold' },
    postAuthor: { fontSize: 14, color: 'gray' },
    emptyText: { textAlign: 'center', fontSize: 16, color: 'gray' },
});

export default LikedPostsScreen;

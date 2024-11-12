import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const BoardScreen = () => {
    const [posts, setPosts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if (route.params?.newPost) {
            setPosts((prevPosts) => [
                ...prevPosts,
                { ...route.params.newPost, liked: false, disliked: false, comments: [], favorited: false },
            ]);
        }
    }, [route.params?.newPost]);

    const updatePost = (updatedPost) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
    };

    const toggleFavorite = (post) => {
        const isFavorited = favorites.some((fav) => fav.id === post.id);
        const updatedPost = { ...post, favorited: !isFavorited };
        updatePost(updatedPost);

        const updatedFavorites = isFavorited
            ? favorites.filter((fav) => fav.id !== post.id)
            : [...favorites, updatedPost];

        setFavorites(updatedFavorites);
        navigation.setParams({ favorites: updatedFavorites });
    };

    const filteredPosts = posts.filter((post) =>
        post.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>꿀팁 공유 게시판</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="게시글 검색..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity onPress={() => navigation.navigate('Favorites', { favorites })}>
                    <FontAwesome name="bars" size={24} color="gray" style={styles.menuIcon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.newPostButton}
                onPress={() => navigation.navigate('CreatePost', { addPost: (post) => setPosts((prevPosts) => [...prevPosts, post]) })}
            >
                <Text style={styles.newPostButtonText}>+ 새 게시글 작성</Text>
            </TouchableOpacity>
            <FlatList
                data={filteredPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PostDetail', { post: item, toggleFavorite })}
                        style={styles.postItem}
                    >
                        <Text style={styles.postText}>{item.text}</Text>
                        <TouchableOpacity onPress={() => toggleFavorite(item)}>
                            <FontAwesome name="star" size={16} color={favorites.some(fav => fav.id === item.id) ? 'gold' : 'gray'} style={styles.favoriteStar} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    menuIcon: {
        marginLeft: 10,
    },
    newPostButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    newPostButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    postItem: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    favoriteStar: {
        marginLeft: 10,
    },
});

export default BoardScreen;

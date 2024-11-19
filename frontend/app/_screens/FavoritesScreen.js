import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = ({ route }) => {
    const navigation = useNavigation();
    const favorites = route.params?.favorites || [];
    const toggleFavorite = route.params?.toggleFavorite;

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>즐겨찾기 모아보기</Text>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PostDetail', { post: item, toggleFavorite })}
                        style={styles.postItem}
                    >
                        <Text style={styles.postText}>{item.text}</Text>
                        <FontAwesome name="star" size={16} color="gold" style={styles.favoriteStar} />
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
    },
    favoriteStar: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default FavoritesScreen;

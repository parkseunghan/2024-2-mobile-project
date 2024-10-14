import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, BackHandler, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutModal from '../components/LogoutModal'; // LogoutModal 컴포넌트 임포트


const CategoryScreen = () => {
    const [visible, setVisible] = useState(false);
    const slideAnim = useState(new Animated.Value(300))[0];
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);

    const toggleLogoutModal = () => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setVisible(false));
        } else {
            setVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    useEffect(() => {
        const backAction = () => {
            if (visible) {
                toggleLogoutModal();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [visible]);

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

    const handlePostAdd = (newPost) => {
        setPosts((prevPosts) => [...prevPosts, newPost]);
        AsyncStorage.setItem('posts', JSON.stringify([...posts, newPost]));
    };

    const renderItem = ({ item }) => (
        <View style={styles.boardItem}>
            <Text style={styles.boardContent}>{item.content}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {!visible && (
                <TouchableOpacity style={styles.settingsButton} onPress={toggleLogoutModal}>
                    <View style={styles.line} />
                    <View style={styles.line} />
                    <View style={styles.line} />
                </TouchableOpacity>
            )}

            <View style={styles.buttonContainer}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <TouchableOpacity key={item} style={styles.button}>
                        <Animated.Text style={styles.buttonText}>Button {item}</Animated.Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.boardContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Board', { onPostAdd: handlePostAdd })}>
                    <Text style={styles.boardTitle}>게시판 {'>'}</Text>
                </TouchableOpacity>
                <FlatList
                    data={posts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>

            {visible && <LogoutModal slideAnim={slideAnim} onClose={toggleLogoutModal} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    settingsButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    line: {
        width: 30,
        height: 3,
        backgroundColor: 'black',
        marginVertical: 2,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 100,
    },
    button: {
        width: 100,
        height: 100,
        backgroundColor: 'black',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    boardContainer: {
        marginTop: 250,
        width: '90%',
        paddingTop: 1,
    },
    boardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    boardItem: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    boardContent: {
        fontSize: 14,
        color: '#333',
    },
});

export default CategoryScreen;
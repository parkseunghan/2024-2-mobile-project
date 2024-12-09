import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const posts = [
    { id: '1', title: '겨울 난방비 절약 꿀팁 5가지', content: '겨울철 난방비를 줄일 수 있는 꿀팁을 소개합니다.', media_url: 'https://via.placeholder.com/150' },
    { id: '2', title: '난방비 폭탄 피하는 법', content: '이번 겨울에는 난방비 폭탄을 피하기 위해 몇 가지 팁을 실천하고 있어요.', media_url: 'https://via.placeholder.com/150' },
    { id: '3', title: '보일러 절약의 핵심은 문단속!', content: '문을 열어두면 따뜻한 공기가 쉽게 빠져나가기 때문에, 꼭 문을 닫고 생활하세요!', media_url: 'https://via.placeholder.com/150' }
];

export default function EventDetailScreen() {
    const params = useLocalSearchParams();
    const postId = params.id; // 🔥 URL에서 postId 가져오기
    const router = useRouter();

    // 🔥 postId에 해당하는 게시글 찾기
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>게시글을 찾을 수 없습니다.</Text>
                <Pressable onPress={() => router.back()} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>돌아가기</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Image source={{ uri: post.media_url }} style={styles.mediaImage} />
            <Text style={styles.content}>{post.content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6E3',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#5D4037',
    },
    mediaImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    content: {
        fontSize: 16,
        color: '#6D4C41',
        lineHeight: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#FFDE59',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

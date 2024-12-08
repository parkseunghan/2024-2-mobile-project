import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { FontAwesome5 } from '@expo/vector-icons';

const eventPostsData = [
    {
        id: '1',
        category: '이벤트 공지',
        title: '다가오는 이벤트 일정 안내',
        author: '운영팀',
        authorTier: 'Admin',
        time: '1일 전',
        likes: 50,
        comments: [{ id: 'c1', content: '기대됩니다!', replies: [] }, { id: 'c2', content: '참여할게요!' }],
        content: '다가오는 이벤트 일정에 대한 안내입니다.',
        media: ['https://via.placeholder.com/150'],
    },
    {
        id: '2',
        category: '이벤트 후기',
        title: '지난 이벤트 수상 후기',
        author: '참여자',
        authorTier: 'Gold',
        time: '2일 전',
        likes: 35,
        comments: [],
        content: '지난 이벤트에 참여한 후기입니다.',
        media: [],
    },
    {
        id: '3',
        category: '이벤트 참여',
        title: '이벤트 참여 방법 안내',
        author: '운영팀',
        authorTier: 'Admin',
        time: '3일 전',
        likes: 20,
        comments: [{ id: 'c1', content: '좋은 정보 감사합니다!' }],
        content: '이벤트 참여 방법에 대해 설명드립니다.',
        media: ['https://via.placeholder.com/150'],
    },
];

const EventHomeScreen = () => {
    const router = useRouter();
    const [posts, setPosts] = useState(eventPostsData);
    const [searchText, setSearchText] = useState('');

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const top3Posts = [...posts]
        .filter((post) => post.likes >= 10)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);

    const renderPost = ({ item }) => (
        <Pressable
            style={styles.postContainer}
            onPress={() => router.push(`/post/${item.id}`)}
        >
            {item.media && item.media.length > 0 && (
                <View style={styles.mediaPreviewContainer}>
                    <Image source={{ uri: item.media[0] }} style={styles.postImage} />
                </View>
            )}
            <View style={styles.postContent}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text style={styles.postAuthor}>
                    {`${item.author} (${item.authorTier}) · ${item.time}`}
                </Text>
                <View style={styles.postStats}>
                    <View style={styles.statItem}>
                        <Icon name="thumb-up" size={16} color="#555" />
                        <Text style={styles.statText}>{item.likes}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Icon name="comment" size={16} color="#555" />
                        <Text style={styles.statText}>{item.comments.length}</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    const renderTop3Post = ({ item }) => (
        <Pressable
            style={styles.top3PostContainer}
            onPress={() => router.push(`/post/${item.id}`)}
        >
            <Text style={styles.top3PostTitle}>{item.title}</Text>
            <Text style={styles.top3PostLikes}>{`좋아요 ${item.likes}개`}</Text>
        </Pressable>
    );

    return (
        <ScrollView style={styles.container}>
            {/* 이벤트 배너 */}
            <View style={styles.bannerContainer}>
                <Image
                    source={require('../../../assets/banner.png')}
                    style={styles.bannerImage}
                />
            </View>

            {/* 검색 입력 */}
            <TextInput
                style={styles.searchInput}
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChangeText={setSearchText}
            />
            {/* 이벤트 당첨 후보 TOP3 */}
            {top3Posts.length > 0 && (
                <View style={styles.top3Section}>
                    <Text style={styles.top3Title}>이벤트 당첨 후보 TOP3</Text>
                    <FlatList
                        data={top3Posts}
                        renderItem={renderTop3Post}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}
            {/* 게시글 리스트 */}
            <FlatList
                data={filteredPosts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
            />

            {/* 게시글 작성 버튼 */}
            <Pressable
                style={styles.floatingButton}
                onPress={() => router.push('/post/create')}
            >
                <FontAwesome5 name="plus" size={24} color={colors.background} />
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: colors.background,
    },
    bannerContainer: {
        width: '100%',
        aspectRatio: 16 / 6,  // 비율 설정
        minHeight: 100,       // 최소 높이 보장
        marginBottom: 16,
        overflow: 'hidden',
    },
    
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
    },
    searchInput: {
        borderWidth: 1,
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...typography.body,
    },
    top3Section: {
        padding: 16,
        backgroundColor: colors.background,
        marginBottom: 16,
        borderRadius: 8,
        marginHorizontal: 16,
    },
    top3Title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    top3PostContainer: {
        backgroundColor: colors.primary,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
        borderColor: colors.border,
        padding: spacing.md,
        ...typography.body,
    },
    top3PostTitle: { fontSize: 14, fontWeight: 'bold' },
    top3PostLikes: { fontSize: 12, color: 'gray', marginTop: 4 },
    postContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginHorizontal: 16,
    },
    mediaPreviewContainer: { marginRight: 16 },
    postImage: { width: 50, height: 50, borderRadius: 8 },
    postContent: { flex: 1 },
    postTitle: { fontSize: 16, fontWeight: 'bold' },
    postAuthor: { fontSize: 12, color: 'black' },
    postStats: {
        flexDirection: 'row',
        marginTop: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    statText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#555',
    },
    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: colors.text.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});

export default EventHomeScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const PostDetailScreen = ({ route }) => {
    const { post, toggleFavorite } = route.params;
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [liked, setLiked] = useState(post.liked || false);
    const [disliked, setDisliked] = useState(post.disliked || false);
    const [favorited, setFavorited] = useState(post.favorited || false); // 즐겨찾기 상태
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        // 업데이트된 상태를 부모 컴포넌트로 전달합니다.
        toggleFavorite({ ...post, favorited });
    }, [favorited]);

    const toggleLike = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true);
            if (disliked) {
                setDislikes(dislikes - 1);
                setDisliked(false);
            }
        } else {
            setLikes(likes - 1);
            setLiked(false);
        }
    };

    const toggleDislike = () => {
        if (!disliked) {
            setDislikes(dislikes + 1);
            setDisliked(true);
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
            }
        } else {
            setDislikes(dislikes - 1);
            setDisliked(false);
        }
    };

    const handleFavorite = () => {
        setFavorited(!favorited);
        toggleFavorite(post); // 즐겨찾기 상태 변경
    };

    const addComment = () => {
        if (commentText.trim() !== '') {
            const newComment = {
                id: Date.now().toString(),
                text: commentText,
                likes: 0,
                dislikes: 0,
                liked: false,
                disliked: false,
            };
            setComments([...comments, newComment]);
            setCommentText('');
        }
    };

    const toggleCommentLike = (commentId) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                        liked: !comment.liked,
                        disliked: comment.liked ? comment.disliked : false, // 좋아요 선택 시 싫어요 초기화
                        dislikes: comment.liked ? comment.dislikes : (comment.disliked ? comment.dislikes - 1 : comment.dislikes),
                    }
                    : comment
            )
        );
    };

    const toggleCommentDislike = (commentId) => {
        setComments((prevComments) =>
            prevComments.map((comment) =>
                comment.id === commentId
                    ? {
                        ...comment,
                        dislikes: comment.disliked ? comment.dislikes - 1 : comment.dislikes + 1,
                        disliked: !comment.disliked,
                        liked: comment.disliked ? comment.liked : false, // 싫어요 선택 시 좋아요 초기화
                        likes: comment.disliked ? comment.likes : (comment.liked ? comment.likes - 1 : comment.likes),
                    }
                    : comment
            )
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.postText}>{post.text}</Text>
                <TouchableOpacity onPress={handleFavorite} style={styles.favoriteIcon}>
                    <FontAwesome name="star" size={24} color={favorited ? 'gold' : 'gray'} />
                </TouchableOpacity>
            </View>
            <View style={styles.reactionsContainer}>
                <TouchableOpacity onPress={toggleLike} style={styles.reactionButton}>
                    <FontAwesome name="thumbs-up" size={20} color={liked ? 'blue' : 'gray'} />
                    <Text style={styles.reactionText}>{likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleDislike} style={styles.reactionButton}>
                    <FontAwesome name="thumbs-down" size={20} color={disliked ? 'red' : 'gray'} />
                    <Text style={styles.reactionText}>{dislikes}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.commentInputContainer}>
                <TextInput
                    placeholder="댓글을 입력하세요..."
                    value={commentText}
                    onChangeText={setCommentText}
                    style={styles.commentInput}
                />
                <Button title="댓글 달기" onPress={addComment} />
            </View>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentText}>{item.text}</Text>
                        <View style={styles.reactionsContainer}>
                            <TouchableOpacity onPress={() => toggleCommentLike(item.id)} style={styles.reactionButton}>
                                <FontAwesome name="thumbs-up" size={16} color={item.liked ? 'blue' : 'gray'} />
                                <Text style={styles.reactionText}>{item.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleCommentDislike(item.id)} style={styles.reactionButton}>
                                <FontAwesome name="thumbs-down" size={16} color={item.disliked ? 'red' : 'gray'} />
                                <Text style={styles.reactionText}>{item.dislikes}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        flex: 1,
    },
    favoriteIcon: {
        marginLeft: 10,
    },
    reactionsContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    reactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    reactionText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333',
    },
    commentInputContainer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginRight: 10,
        paddingBottom: 4,
    },
    commentItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
});

export default PostDetailScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@app/_lib/hooks';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Button } from '@app/_components/common/Button';
import { profileApi } from '@app/_lib/api/profile';
import { LoadingState } from '@app/_components/common/LoadingState';
import { ErrorState } from '@app/_components/common/ErrorState';

export default function ProfileScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [nickname, setNickname] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            const [profileRes, postsRes, commentsRes, likedPostsRes] = await Promise.allSettled([
                profileApi.getProfile(),
                profileApi.getUserPosts(),
                profileApi.getUserComments(),
                profileApi.getLikedPosts()
            ]);

            if (profileRes.status === 'fulfilled' && profileRes.value.data.profile) {
                setNickname(profileRes.value.data.profile.nickname || user?.username || '');
                setBio(profileRes.value.data.profile.bio || '');
                setAvatar(profileRes.value.data.profile.avatar);
            }

            if (commentsRes.status === 'fulfilled') {
                const formattedComments = commentsRes.value.data.comments.map(comment => ({
                    id: comment.id,
                    text: comment.content,
                    postId: comment.post_id,
                    createdAt: new Date(comment.created_at).toLocaleDateString()
                }));
                setComments(formattedComments);
            } else {
                setComments([]);
            }

            setPosts(postsRes.status === 'fulfilled' ? postsRes.value.data.posts : []);
            setLikedPosts(likedPostsRes.status === 'fulfilled' ? likedPostsRes.value.data.posts : []);
        } catch (error) {
            console.error('프로필 데이터 로드 에러:', error);
            setError(error.response?.data?.message || '프로필 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            setNickname(user.username || '');
            loadProfileData();
        }
    }, [user]);

    if (!user) {
        return (
            <View style={styles.container}>
                <View style={styles.messageContainer}>
                    <Text style={styles.title}>로그인이 필요합니다</Text>
                    <Text style={styles.subtitle}>
                        프로필을 보려면 로그인이 필요합니다.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            title="로그인"
                            onPress={() => router.push('/login')}
                            variant="primary"
                            fullWidth
                        />
                    </View>
                </View>
            </View>
        );
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    const handleProfileButtonPress = () => {
        setIsEditingProfile(true);
    };

    const handleSaveProfile = async () => {
        try {
            const formData = new FormData();
            
            if (nickname !== user.username) {
                formData.append('nickname', nickname);
            }
            
            if (bio) {
                formData.append('bio', bio);
            }
            
            if (avatar && !avatar.startsWith('http')) {
                const filename = avatar.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';
                
                formData.append('avatar', {
                    uri: avatar,
                    name: filename,
                    type: type
                });
            }

            await profileApi.updateProfile(formData);
            setIsEditingProfile(false);
            loadProfileData();
        } catch (error) {
            console.error('프로필 업데이트 에러:', error);
            Alert.alert('오류', error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
        }
    };

    const pickImage = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('알림', '이미지를 선택하기 위해서는 갤러리 접근 권한이 필요합니다.');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return posts.length > 0 ? (
                    <View>
                        {posts.map((post) => (
                            <Button
                                key={post.id}
                                title={post.title}
                                onPress={() => router.push(`/post/${post.id}`)}
                                variant="secondary"
                                style={styles.postItem}
                                textStyle={styles.postTitle}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>작성한 게시물이 없습니다.</Text>
                    </View>
                );
            case 'comments':
                return comments.length > 0 ? (
                    <View>
                        {comments.map((comment) => (
                            <Button
                                key={comment.id}
                                title={comment.text}
                                subtitle={comment.createdAt}
                                onPress={() => router.push(`/post/${comment.postId}`)}
                                variant="secondary"
                                style={styles.postItem}
                                textStyle={[styles.postTitle, styles.commentText]}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>작성한 댓글이 없습니다.</Text>
                    </View>
                );
            case 'likedPosts':
                return likedPosts.length > 0 ? (
                    <View>
                        {likedPosts.map((post) => (
                            <Button
                                key={post.id}
                                title={post.title}
                                onPress={() => router.push(`/post/${post.id}`)}
                                variant="secondary"
                                style={styles.postItem}
                                textStyle={styles.postTitle}
                            />
                        ))}
                    </View>
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>좋아요를 누른 게시물이 없습니다.</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {isEditingProfile ? (
                    <View style={styles.editProfileContainer}>
                        <Button
                            title="← 뒤로가기"
                            onPress={() => setIsEditingProfile(false)}
                            variant="secondary"
                            style={styles.backButton}
                            textStyle={styles.backButtonText}
                        />

                        <View style={styles.avatarContainer}>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{nickname?.[0] || user?.username?.[0]}</Text>
                                </View>
                            )}
                            <Button
                                title="📷"
                                onPress={pickImage}
                                variant="secondary"
                                style={styles.cameraButton}
                                textStyle={styles.cameraButtonText}
                            />
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>별명</Text>
                            <TextInput
                                style={styles.input}
                                value={nickname}
                                onChangeText={setNickname}
                                placeholder="별명을 입력하세요"
                            />

                            <Text style={styles.label}>소개</Text>
                            <TextInput
                                style={[styles.input, styles.bioInput]}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="자기소개를 입력하세요"
                                multiline
                            />

                            <Button
                                title="완료"
                                onPress={handleSaveProfile}
                                variant="primary"
                                fullWidth
                            />
                        </View>
                    </View>
                ) : (
                    <>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                {avatar ? (
                                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <Text style={styles.avatarText}>{nickname?.[0] || user?.username?.[0]}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.username}>{nickname || user.username}</Text>
                            <Text style={styles.email}>{user.email}</Text>
                            {bio && <Text style={styles.bio}>{bio}</Text>}

                            <Button
                                title="프로필 설정"
                                onPress={handleProfileButtonPress}
                                variant="primary"
                                style={styles.editButton}
                            />
                        </View>

                        <View style={styles.statsContainer}>
                            <Button
                                title={
                                    <View>
                                        <Text style={styles.statText}>작성글</Text>
                                        <Text style={styles.statCount}>{posts.length}</Text>
                                    </View>
                                }
                                onPress={() => setActiveTab('posts')}
                                variant={activeTab === 'posts' ? 'primary' : 'secondary'}
                                style={[styles.statBox, activeTab === 'posts' && styles.activeStatBox]}
                            />
                            <Button
                                title={
                                    <View>
                                        <Text style={styles.statText}>작성댓글</Text>
                                        <Text style={styles.statCount}>{comments.length}</Text>
                                    </View>
                                }
                                onPress={() => setActiveTab('comments')}
                                variant={activeTab === 'comments' ? 'primary' : 'secondary'}
                                style={[styles.statBox, activeTab === 'comments' && styles.activeStatBox]}
                            />
                            <Button
                                title={
                                    <View>
                                        <Text style={styles.statText}>좋아요한 글</Text>
                                        <Text style={styles.statCount}>{likedPosts.length}</Text>
                                    </View>
                                }
                                onPress={() => setActiveTab('likedPosts')}
                                variant={activeTab === 'likedPosts' ? 'primary' : 'secondary'}
                                style={[styles.statBox, activeTab === 'likedPosts' && styles.activeStatBox]}
                            />
                        </View>

                        <View style={styles.contentContainer}>
                            {renderContent()}
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl,
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 400,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarText: {
        ...typography.h1,
        color: colors.background,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        padding: 0,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cameraButtonText: {
        fontSize: 16,
    },
    username: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    email: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    bio: {
        ...typography.body,
        color: colors.text.secondary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    editButton: {
        marginTop: spacing.md,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.lg,
    },
    statBox: {
        flex: 1,
        margin: spacing.xs,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStatBox: {
        backgroundColor: `${colors.primary}15`,
    },
    statText: {
        ...typography.caption,
        textAlign: 'center',
        color: colors.text.secondary,
    },
    statCount: {
        ...typography.h3,
        textAlign: 'center',
        color: colors.text.primary,
    },
    contentContainer: {
        flex: 1,
    },
    postItem: {
        marginBottom: spacing.sm,
        backgroundColor: colors.surface,
    },
    postTitle: {
        ...typography.body,
        marginBottom: spacing.xs,
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    editProfileContainer: {
        flex: 1,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: spacing.lg,
        backgroundColor: 'transparent',
    },
    backButtonText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    form: {
        gap: spacing.md,
    },
    label: {
        ...typography.body,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...typography.body,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    commentText: {
        ...typography.body,
        fontSize: 14,
        color: colors.text.secondary,
    },
}); 
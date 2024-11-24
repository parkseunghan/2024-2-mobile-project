import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '@app/_utils/hooks/useAuth';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { Button } from '@app/_components/common/Button';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nickname, setNickname] = useState(user?.username || '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>현재 비회원으로 이용 중입니다.</Text>
          <Text style={styles.subtitle}>
            추가 서비스를 이용하시려면 로그인이 필요합니다.
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

  const handleProfileButtonPress = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    // TODO: API 호출하여 프로필 업데이트
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('이미지를 선택하기 위해서는 갤러리 접근 권한이 필요합니다.');
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

  const posts = [];
  const comments = [];
  const likedPosts = [];

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return posts.length > 0 ? (
          posts.map((post, index) => (
            <Button
              key={index}
              title={post.title}
              onPress={() => router.push(`/post/${post.id}`)}
              variant="secondary"
              style={styles.postItem}
              textStyle={styles.postTitle}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>작성한 게시물이 없습니다.</Text>
        );
      case 'comments':
        return comments.length > 0 ? (
          comments.map((comment, index) => (
            <Button
              key={index}
              title={comment.text}
              onPress={() => router.push(`/post/${comment.postId}`)}
              variant="secondary"
              style={styles.postItem}
              textStyle={styles.postTitle}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>작성한 댓글이 없습니다.</Text>
        );
      case 'likedPosts':
        return likedPosts.length > 0 ? (
          likedPosts.map((post, index) => (
            <Button
              key={index}
              title={post.title}
              onPress={() => router.push(`/post/${post.id}`)}
              variant="secondary"
              style={styles.postItem}
              textStyle={styles.postTitle}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>좋아요를 누른 게시물이 없습니다.</Text>
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
                  <Text style={styles.avatarText}>{nickname[0] || user.username[0]}</Text>
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
                    <Text style={styles.avatarText}>{nickname[0] || user.username[0]}</Text>
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
                title={`작성글\n${posts.length}`}
                onPress={() => setActiveTab('posts')}
                variant={activeTab === 'posts' ? 'primary' : 'secondary'}
                style={[styles.statBox, activeTab === 'posts' && styles.activeStatBox]}
                textStyle={styles.statText}
              />
              <Button
                title={`작성댓글\n${comments.length}`}
                onPress={() => setActiveTab('comments')}
                variant={activeTab === 'comments' ? 'primary' : 'secondary'}
                style={[styles.statBox, activeTab === 'comments' && styles.activeStatBox]}
                textStyle={styles.statText}
              />
              <Button
                title={`좋아요한 글\n${likedPosts.length}`}
                onPress={() => setActiveTab('likedPosts')}
                variant={activeTab === 'likedPosts' ? 'primary' : 'secondary'}
                style={[styles.statBox, activeTab === 'likedPosts' && styles.activeStatBox]}
                textStyle={styles.statText}
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
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    padding: spacing.xl,
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
}); 
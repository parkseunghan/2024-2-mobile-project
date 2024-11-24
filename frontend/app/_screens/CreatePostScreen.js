import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { communityApi } from '@app/_utils/api/community';

export default function CreatePostScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '일반',
    media: null,
  });
  const [loading, setLoading] = useState(false);

  const handleMediaPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm(prev => ({
        ...prev,
        media: result.assets[0].uri
      }));
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      Alert.alert('알림', '제목과 내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('content', form.content.trim());
      formData.append('category', form.category);
      
      if (form.media) {
        const fileName = form.media.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('media', {
          uri: form.media,
          name: fileName,
          type
        });
      }

      console.log('Sending form data:', {
        title: form.title,
        content: form.content,
        category: form.category,
        hasMedia: !!form.media
      });

      const response = await communityApi.createPost(formData);
      router.back();
      Alert.alert('성공', '게시글이 작성되었습니다.');
    } catch (error) {
      console.error('게시글 작성 에러:', error);
      Alert.alert('오류', error.response?.data?.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Input
        label="제목"
        value={form.title}
        onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
        placeholder="제목을 입력하세요"
      />

      <Input
        label="내용"
        value={form.content}
        onChangeText={(text) => setForm(prev => ({ ...prev, content: text }))}
        placeholder="내용을 입력하세요"
        multiline
        numberOfLines={5}
        style={styles.contentInput}
      />

      <View style={styles.buttons}>
        <Button
          title="미디어 추가"
          onPress={handleMediaPick}
          variant="secondary"
          icon={<FontAwesome5 name="image" size={20} color={colors.primary} />}
        />
        <Button
          title={loading ? "게시 중..." : "게시하기"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  buttons: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});

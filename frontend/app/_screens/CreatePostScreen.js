import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import { Button } from '@app/_components/common/Button';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { communityApi } from '@app/_lib/api';

export default function CreatePostScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '일반',
    media: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const handleMediaPick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('알림', '미디어 라이브러리 접근 권한이 필요합니다.');
        return;
      }

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
        setSelectedMedia([...selectedMedia, { uri: result.assets[0].uri }]);
      }
    } catch (error) {
      console.error('미디어 선택 에러:', error);
      Alert.alert('오류', '미디어 선택 중 오류가 발생했습니다.');
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
        
        if (Platform.OS === 'web') {
          const response = await fetch(form.media);
          const blob = await response.blob();
          formData.append('media', blob, fileName);
        } else {
          formData.append('media', {
            uri: form.media,
            type: type,
            name: fileName
          });
        }
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await communityApi.createPost(formData);
      
      if (response.success) {
        router.back();
        Alert.alert('성공', response.message || '게시글이 작성되었습니다.');
      } else {
        throw new Error(response.message || '게시글 생성 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 에러:', error);
      Alert.alert('오류', error.response?.data?.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color={colors.text.secondary} />
        </Pressable>
        <Text style={styles.headerTitle}>게시글 작성</Text>
        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={[
            styles.submitText,
            loading && styles.submitTextDisabled
          ]}>
            {loading ? "작성 중..." : "등록"}
          </Text>
        </Pressable>
      </View>

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
        placeholder="내용을 입력하세요 (#태그를 활용해보세요)"
        multiline
        numberOfLines={5}
        style={styles.contentInput}
      />

      {selectedMedia.length > 0 && (
        <ScrollView 
          horizontal 
          style={styles.mediaPreview}
          showsHorizontalScrollIndicator={false}
        >
          {selectedMedia.map((media, index) => (
            <View key={index} style={styles.mediaItem}>
              <Pressable
                style={styles.mediaDeleteButton}
                onPress={() => {
                  setSelectedMedia(prev => prev.filter((_, i) => i !== index));
                  if (index === 0) setForm(prev => ({ ...prev, media: null }));
                }}
              >
                <FontAwesome5 name="times-circle" size={20} color={colors.error} />
              </Pressable>
              {/* 여기에 이미지 미리보기 추가 */}
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.toolbar}>
        <Pressable
          style={styles.toolbarButton}
          onPress={handleMediaPick}
        >
          <FontAwesome5 name="image" size={20} color={colors.text.secondary} />
        </Pressable>
        <Pressable style={styles.toolbarButton}>
          <FontAwesome5 name="hashtag" size={20} color={colors.text.secondary} />
        </Pressable>
        <Pressable style={styles.toolbarButton}>
          <FontAwesome5 name="font" size={20} color={colors.text.secondary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h2,
  },
  backButton: {
    padding: spacing.sm,
  },
  submitButton: {
    padding: spacing.sm,
  },
  submitText: {
    ...typography.button,
    color: colors.primary,
  },
  submitTextDisabled: {
    color: colors.text.disabled,
  },
  contentInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  mediaPreview: {
    padding: spacing.md,
  },
  mediaItem: {
    width: 100,
    height: 100,
    marginRight: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  mediaDeleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  toolbar: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  toolbarButton: {
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '@app/_components/common/Input';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { postsApi } from '@app/_lib/api/posts';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { colors } from '@app/_styles/colors';
import { spacing } from '@app/_styles/spacing';
import { typography } from '@app/_styles/typography';
import { useAuth } from '@app/_context/AuthContext';



export default function CreatePostScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({
        title: '',
        content: '',
        category: '일반',
        media: null,
        poll_options: [],
    });
    const [loading, setLoading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [newPollOption, setNewPollOption] = useState('');

    // 카테고리 목록 조회
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: postsApi.fetchCategories,
        initialData: [{ id: 'general-1', name: '일반' }]
    });

    // 게시글 작성 mutation
    const createPostMutation = useMutation({
        mutationFn: async (postData) => {
            try {
                // 미디어 파일이 있는 경우 먼저 업로드
                let media_url = null;
                if (postData.media) {
                    const formData = new FormData();
                    const filename = postData.media.split('/').pop();
                    
                    // 파일 타입 추출 및 설정
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : 'image/jpeg';
                    
                    // FormData에 파일 추가
                    formData.append('media', {
                        uri: postData.media,
                        name: filename,
                        type
                    });
                    
                    try {
                        const uploadResponse = await postsApi.uploadMedia(formData);
                        media_url = uploadResponse.data.url;
                    } catch (uploadError) {
                        console.error('미디어 업로드 에러:', uploadError);
                        throw new Error('미디어 파일 업로드에 실패했습니다.');
                    }
                }
                
                // 게시글 생성
                const response = await postsApi.createPost({
                    ...postData,
                    media_url,
                    user_id: user.id
                });
                
                return response.data;
            } catch (error) {
                console.error('게시글 작성 에러:', error);
                throw new Error(error.response?.data?.message || '게시글 작성에 실패했습니다.');
            }
        },
        onSuccess: () => {
            Alert.alert('성공', '게시글이 작성되었습니다.');
            router.back();
            // 게시글 목록 캐시 무효화
            queryClient.invalidateQueries(['posts']);
        },
        onError: (error) => {
            Alert.alert('오류', error.message);
        }
    });

    // 미디어 선택 함수
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
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled) {
                const asset = result.assets[0];
                // 파일 이름 생성
                const filename = asset.uri.split('/').pop() || 'image.jpg';
                
                // Blob 생성
                const response = await fetch(asset.uri);
                const blob = await response.blob();
                
                // FormData 생성
                const formData = new FormData();
                formData.append('media', {
                    uri: Platform.OS === 'web' ? blob : asset.uri,
                    type: 'image/jpeg',
                    name: filename
                });

                setForm(prev => ({
                    ...prev,
                    media: asset.uri
                }));
                setSelectedMedia([...selectedMedia, { uri: asset.uri }]);
            }
        } catch (error) {
            console.error('미디어 선택 에러:', error);
            Alert.alert('오류', '미디어 선택 중 오류가 발생했습니다.');
        }
    };

    // 투표 옵션 추가
    const handleAddPollOption = () => {
        if (newPollOption.trim()) {
            setForm(prev => ({
                ...prev,
                poll_options: [...prev.poll_options, { text: newPollOption.trim(), votes: 0 }]
            }));
            setNewPollOption('');
        }
    };

    // 투표 옵션 삭제
    const handleRemovePollOption = (index) => {
        setForm(prev => ({
            ...prev,
            poll_options: prev.poll_options.filter((_, i) => i !== index)
        }));
    };

    // 게시글 작성
    const handleSubmit = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            Alert.alert('알림', '제목과 내용을 입력해주세요.');
            return;
        }

        if (!user) {
            Alert.alert('알림', '로그인이 필요합니다.');
            return;
        }

        createPostMutation.mutate(form);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <FontAwesome5 name="arrow-left" size={20} color="#666" />
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

            {/* 카테고리 선택 추가 */}
            <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>카테고리</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryList}
                >
                    {categories.map((category) => {
                        const uniqueKey = category.id || `category-${category.name}-${Math.random()}`;
                        
                        return (
                            <Pressable
                                key={uniqueKey}
                                style={[
                                    styles.categoryButton,
                                    form.category === category.name && styles.categoryButtonActive
                                ]}
                                onPress={() => setForm(prev => ({ 
                                    ...prev, 
                                    category: category.name 
                                }))}
                            >
                                <Text style={[
                                    styles.categoryButtonText,
                                    form.category === category.name && styles.categoryButtonTextActive
                                ]}>
                                    {category.name}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <Input
                label="내용"
                value={form.content}
                onChangeText={(text) => setForm(prev => ({ ...prev, content: text }))}
                placeholder="내용을 입력하세요 (#태그를 활용해보세요)"
                multiline
                numberOfLines={5}
                style={styles.contentInput}
            />

            {/* 투표 옵션 섹션 */}
            <View style={styles.pollSection}>
                <Text style={styles.sectionTitle}>투표 옵션</Text>
                <View style={styles.pollInputContainer}>
                    <Input
                        value={newPollOption}
                        onChangeText={setNewPollOption}
                        placeholder="투표 항목 입력"
                        style={styles.pollInput}
                    />
                    <Pressable 
                        style={styles.addButton}
                        onPress={handleAddPollOption}
                    >
                        <FontAwesome5 name="plus" size={16} color="#fff" />
                    </Pressable>
                </View>

                {form.poll_options.map((option, index) => (
                    <View key={index} style={styles.pollOption}>
                        <Text style={styles.pollOptionText}>{option.text}</Text>
                        <Pressable
                            style={styles.removeButton}
                            onPress={() => handleRemovePollOption(index)}
                        >
                            <FontAwesome5 name="times" size={16} color="#ff4444" />
                        </Pressable>
                    </View>
                ))}
            </View>

            {/* 미디어 미리보기 */}
            {selectedMedia.length > 0 && (
                <ScrollView 
                    horizontal 
                    style={styles.mediaPreview}
                    showsHorizontalScrollIndicator={false}
                >
                    {selectedMedia.map((media, index) => (
                        <View key={index} style={styles.mediaItem}>
                            <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                            <Pressable
                                style={styles.mediaDeleteButton}
                                onPress={() => {
                                    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
                                    if (index === 0) setForm(prev => ({ ...prev, media: null }));
                                }}
                            >
                                <FontAwesome5 name="times-circle" size={20} color="#ff4444" />
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* 도구 모음 */}
            <View style={styles.toolbar}>
                <Pressable
                    style={styles.toolbarButton}
                    onPress={handleMediaPick}
                >
                    <FontAwesome5 name="image" size={20} color="#666" />
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
    pollSection: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    pollInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    pollInput: {
        flex: 1,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
    },
    pollOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
    },
    pollOptionText: {
        fontSize: 14,
    },
    removeButton: {
        padding: 8,
    },
    mediaPreview: {
        marginTop: 16,
    },
    mediaItem: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
    },
    mediaDeleteButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#fff',
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
    categorySection: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    categoryList: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    categoryButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    categoryButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoryButtonText: {
        color: '#666',
        fontSize: 14,
    },
    categoryButtonTextActive: {
        color: '#fff',
    },
});

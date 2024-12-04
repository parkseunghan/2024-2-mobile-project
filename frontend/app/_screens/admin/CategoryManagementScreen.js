import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@app/_lib/api/admin';
import { useAuth } from '@app/_context/AuthContext';

export default function CategoryManagement() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    // 카테고리 목록 조회
    const { data: categories, isLoading } = useQuery({
        queryKey: ['admin', 'categories'],
        queryFn: async () => {
            const response = await adminApi.getCategories();
            return response.data.categories;
        }
    });

    // 카테고리 생성/수정 mutation
    const categoryMutation = useMutation({
        mutationFn: async (data) => {
            if (editingId) {
                return adminApi.updateCategory(editingId, data);
            }
            return adminApi.createCategory(data);
        },
        onSuccess: () => {
            Alert.alert('성공', `카테고리가 ${editingId ? '수정' : '생성'}되었습니다.`);
            setForm({ name: '', description: '' });
            setEditingId(null);
            queryClient.invalidateQueries(['admin', 'categories']);
        },
        onError: (error) => {
            console.error('카테고리 처리 에러:', error);
            Alert.alert('오류', error.response?.data?.message || '카테고리 처리에 실패했습니다.');
        }
    });

    // 카테고리 삭제 mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => adminApi.deleteCategory(id),
        onSuccess: () => {
            Alert.alert('성공', '카테고리가 삭제되었습니다.');
            queryClient.invalidateQueries(['admin', 'categories']);
        },
        onError: (error) => {
            console.error('카테고리 삭제 에러:', error);
            Alert.alert('오류', error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
        }
    });

    // 삭제 확인 핸들러
    const handleDeleteCategory = async (categoryId) => {
        console.log('삭제 시도:', categoryId);

        try {
            console.log('삭제 요청 시작:', categoryId);
            await deleteMutation.mutateAsync(categoryId);
            console.log('삭제 성공:', categoryId);
        } catch (error) {
                console.error('카테고리 삭제 중 에러:', error);
                Alert.alert('오류', '카테고리 삭제에 실패했습니다.');
        }
    };

    // 관리자 권한 체크
    if (user?.role !== 'admin' && user?.role !== 'god') {
        return (
            <View style={styles.container}>
                <Text>접근 권한이 없습니다.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>카테고리 관리</Text>

            {/* 카테고리 입력 폼 */}
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="카테고리 이름"
                    value={form.name}
                    onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="카테고리 설명"
                    value={form.description}
                    onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
                />
                <Pressable
                    style={styles.submitButton}
                    onPress={() => categoryMutation.mutate(form)}
                >
                    <Text style={styles.submitButtonText}>
                        {editingId ? '수정하기' : '추가하기'}
                    </Text>
                </Pressable>
            </View>

            {/* 카테고리 목록 */}
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <View style={styles.list}>
                    {categories?.map((category) => (
                        <View key={category.id} style={styles.categoryItem}>
                            <View>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryDescription}>
                                    {category.description}
                                </Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <Pressable
                                    style={[styles.button, styles.editButton]}
                                    onPress={() => {
                                        setForm({
                                            name: category.name,
                                            description: category.description
                                        });
                                        setEditingId(category.id);
                                    }}
                                >
                                    <Text style={styles.buttonText}>수정</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteCategory(category.id)}
                                >
                                    <Text style={[styles.buttonText, styles.deleteButtonText]}>삭제</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    formContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        gap: 10,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryDescription: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    deleteButtonText: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
}); 
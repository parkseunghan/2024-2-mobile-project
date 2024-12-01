import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import { adminApi } from '@app/_lib/api';

export default function CategoryManagementScreen() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await adminApi.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert('오류', '카테고리 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
        Alert.alert('성공', '카테고리가 수정되었습니다.');
      } else {
        await adminApi.createCategory(form);
        Alert.alert('성공', '카테고리가 생성되었습니다.');
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      loadCategories();
    } catch (error) {
      Alert.alert('오류', '카테고리 처리에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteCategory(id);
      Alert.alert('성공', '카테고리가 삭제되었습니다.');
      loadCategories();
    } catch (error) {
      Alert.alert('오류', '카테고리 삭제에 실패했습니다.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryDescription}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.button}
          onPress={() => {
            setForm({ name: item.name, description: item.description });
            setEditingId(item.id);
          }}
        >
          <Text style={styles.buttonText}>수정</Text>
        </Pressable>
        <Pressable 
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {editingId ? '수정하기' : '추가하기'}
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryDescription: {
    marginTop: 4,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  button: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
  },
}); 
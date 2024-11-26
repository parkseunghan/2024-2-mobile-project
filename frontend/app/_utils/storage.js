/**
 * 저장소 유틸리티
 * - 웹과 네이티브 플랫폼에서 일관된 저장소 API 제공
 * - 웹에서는 localStorage, 네이티브에서는 SecureStore 사용
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storage = {
  /**
   * 데이터 저장
   * @param {string} key - 저장할 데이터의 키
   * @param {string} value - 저장할 값
   * @returns {Promise<boolean>} 저장 성공 여부
   */
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return true;
      }
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Storage setItem error:', error);
      return false;
    }
  },
  
  /**
   * 데이터 조회
   * @param {string} key - 조회할 데이터의 키
   * @returns {Promise<string|null>} 저장된 값 또는 null
   */
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  },
  
  /**
   * 데이터 삭제
   * @param {string} key - 삭제할 데이터의 키
   * @returns {Promise<boolean>} 삭제 성공 여부
   */
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return true;
      }
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return false;
    }
  }
};

export default storage; 
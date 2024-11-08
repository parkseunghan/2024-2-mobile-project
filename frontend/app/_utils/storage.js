import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const storage = {
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
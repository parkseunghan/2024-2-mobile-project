import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
    getItem: async (key) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('Storage getItem error:', error);
            return null;
        }
    },
    
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Storage setItem error:', error);
        }
    },
    
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Storage removeItem error:', error);
        }
    }
};

export default storage; 
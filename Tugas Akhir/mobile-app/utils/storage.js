import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback in-memory storage jika AsyncStorage tidak tersedia (misal di Expo Go tanpa module native)
const inMemoryStorage = {};

const storage = {
  getItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn('Storage getItem fallback to memory. Error:', e.message);
      return inMemoryStorage[key] || null;
    }
  },
  setItem: async (key, value) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage setItem fallback to memory. Error:', e.message);
      inMemoryStorage[key] = value;
    }
  },
  removeItem: async (key) => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Storage removeItem fallback to memory. Error:', e.message);
      delete inMemoryStorage[key];
    }
  }
};

export default storage;

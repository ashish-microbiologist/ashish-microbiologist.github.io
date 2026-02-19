import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { STORAGE_KEYS } from '../utils/constants';

class LocalStorage {
  // ========== USER PREFERENCES ==========
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.log('Error saving preferences:', error);
      return false;
    }
  }

  async getPreferences() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log('Error getting preferences:', error);
      return null;
    }
  }

  // ========== DOWNLOADS HISTORY ==========
  async saveDownload(downloadData) {
    try {
      const existing = await this.getDownloads();
      const downloads = existing ? [...existing, downloadData] : [downloadData];
      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
      return true;
    } catch (error) {
      console.log('Error saving download:', error);
      return false;
    }
  }

  async getDownloads() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOADS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.log('Error getting downloads:', error);
      return [];
    }
  }

  async clearDownloads() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.DOWNLOADS);
      return true;
    } catch (error) {
      console.log('Error clearing downloads:', error);
      return false;
    }
  }

  // ========== CACHE MANAGEMENT ==========
  async getCacheSize() {
    try {
      const cacheDir = RNFS.CachesDirectoryPath;
      const files = await RNFS.readDir(cacheDir);
      let totalSize = 0;
      files.forEach(file => {
        totalSize += file.size;
      });
      return totalSize;
    } catch (error) {
      console.log('Error getting cache size:', error);
      return 0;
    }
  }

  async clearCache() {
    try {
      const cacheDir = RNFS.CachesDirectoryPath;
      const files = await RNFS.readDir(cacheDir);
      await Promise.all(
        files.map(file => RNFS.unlink(file.path))
      );
      return true;
    } catch (error) {
      console.log('Error clearing cache:', error);
      return false;
    }
  }

  // ========== THEME ==========
  async saveTheme(theme) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.log('Error saving theme:', error);
      return false;
    }
  }

  async getTheme() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    } catch (error) {
      console.log('Error getting theme:', error);
      return null;
    }
  }

  // ========== LANGUAGE ==========
  async saveLanguage(language) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
      return true;
    } catch (error) {
      console.log('Error saving language:', error);
      return false;
    }
  }

  async getLanguage() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
    } catch (error) {
      console.log('Error getting language:', error);
      return null;
    }
  }

  // ========== USER ID ==========
  async saveUserId(userId) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
      return true;
    } catch (error) {
      console.log('Error saving user ID:', error);
      return false;
    }
  }

  async getUserId() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    } catch (error) {
      console.log('Error getting user ID:', error);
      return null;
    }
  }

  // ========== FILE OPERATIONS ==========
  async fileExists(path) {
    try {
      return await RNFS.exists(path);
    } catch (error) {
      return false;
    }
  }

  async deleteFile(path) {
    try {
      await RNFS.unlink(path);
      return true;
    } catch (error) {
      console.log('Error deleting file:', error);
      return false;
    }
  }

  async getFileInfo(path) {
    try {
      const exists = await this.fileExists(path);
      if (exists) {
        const stat = await RNFS.stat(path);
        return stat;
      }
      return null;
    } catch (error) {
      console.log('Error getting file info:', error);
      return null;
    }
  }

  // ========== STORAGE INFO ==========
  async getStorageInfo() {
    try {
      const fsInfo = await RNFS.getFSInfo();
      return {
        freeSpace: fsInfo.freeSpace,
        totalSpace: fsInfo.totalSpace,
        usedSpace: fsInfo.totalSpace - fsInfo.freeSpace
      };
    } catch (error) {
      console.log('Error getting storage info:', error);
      return null;
    }
  }

  // ========== CLEAR ALL ==========
  async clearAll() {
    try {
      await AsyncStorage.clear();
      await this.clearCache();
      return true;
    } catch (error) {
      console.log('Error clearing all:', error);
      return false;
    }
  }
}

export default new LocalStorage();
import { Alert, Linking, Platform } from 'react-native';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

class UpdateService {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateCheckInterval = null;
  }

  // Check for updates
  async checkForUpdates(showNoUpdateMessage = false) {
    try {
      const versionRef = ref(db, 'app_config/version');
      
      onValue(versionRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          await this.handleVersionCheck(data, showNoUpdateMessage);
        }
      }, { onlyOnce: true });

    } catch (error) {
      console.log('Error checking updates:', error);
    }
  }

  // Handle version check
  async handleVersionCheck(versionData, showNoUpdateMessage) {
    const {
      currentVersion,
      minimumVersion,
      latestVersion,
      updateMessage,
      forceUpdate,
      updateUrl,
      changelog
    } = versionData;

    // Compare versions
    const isUpdateAvailable = this.compareVersions(latestVersion, this.currentVersion);
    const isMinimumMet = this.compareVersions(this.currentVersion, minimumVersion) >= 0;

    if (!isMinimumMet) {
      // Force update required
      this.showUpdateDialog({
        title: 'Update Required',
        message: updateMessage || 'A mandatory update is required to continue using the app.',
        forceUpdate: true,
        updateUrl
      });
    } else if (isUpdateAvailable > 0) {
      // Update available
      this.showUpdateDialog({
        title: 'Update Available',
        message: updateMessage || 'A new version is available!',
        forceUpdate: forceUpdate || false,
        updateUrl,
        changelog
      });
    } else if (showNoUpdateMessage) {
      Alert.alert('Up to Date', 'You have the latest version!');
    }

    // Save last check time
    await AsyncStorage.setItem('lastUpdateCheck', Date.now().toString());
  }

  // Compare versions
  compareVersions(v1, v2) {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const part1 = v1Parts[i] || 0;
      const part2 = v2Parts[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    return 0;
  }

  // Show update dialog
  showUpdateDialog({ title, message, forceUpdate, updateUrl, changelog }) {
    let fullMessage = message;
    
    if (changelog && changelog.length > 0) {
      fullMessage += '\n\nWhat\'s new:\n• ' + changelog.join('\n• ');
    }

    Alert.alert(
      title,
      fullMessage,
      [
        {
          text: forceUpdate ? 'Update Now' : 'Update',
          onPress: () => this.openUpdateUrl(updateUrl)
        },
        ...(forceUpdate ? [] : [{ text: 'Later', style: 'cancel' }])
      ],
      { cancelable: !forceUpdate }
    );
  }

  // Open update URL
  openUpdateUrl(updateUrl) {
    const url = Platform.OS === 'android' 
      ? updateUrl?.android 
      : updateUrl?.ios;

    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Cannot open store');
      });
    } else {
      Alert.alert('Error', 'Update URL not available');
    }
  }

  // Schedule periodic checks
  startPeriodicChecks(intervalHours = 24) {
    // Check every intervalHours
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, intervalHours * 60 * 60 * 1000);
  }

  // Stop periodic checks
  stopPeriodicChecks() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }
  }

  // Check on app start
  async checkOnStart() {
    const lastCheck = await AsyncStorage.getItem('lastUpdateCheck');
    const now = Date.now();
    
    // Check if last check was more than 24 hours ago
    if (!lastCheck || now - parseInt(lastCheck) > 24 * 60 * 60 * 1000) {
      this.checkForUpdates();
    }
  }

  // Download update (for in-app updates on Android)
  async downloadUpdate(apkUrl) {
    try {
      const fileName = `update_${Date.now()}.apk`;
      const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      const download = RNFS.downloadFile({
        fromUrl: apkUrl,
        toFile: downloadPath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log('Download progress:', progress);
        }
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        // Install APK (Android only)
        if (Platform.OS === 'android') {
          this.installApk(downloadPath);
        }
        return { success: true, path: downloadPath };
      }
    } catch (error) {
      console.log('Error downloading update:', error);
      return { success: false, error: error.message };
    }
  }

  // Install APK (Android)
  installApk(apkPath) {
    // This requires additional permissions and intent
    // Implementation depends on your needs
    console.log('Install APK at:', apkPath);
  }

  // Get current version
  getCurrentVersion() {
    return this.currentVersion;
  }
}

export default new UpdateService();
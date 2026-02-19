import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { db, auth } from './firebase';
import { ref, push, set, update } from 'firebase/database';

class DownloadManager {
  constructor() {
    this.downloads = [];
    this.listeners = [];
    this.downloadQueue = [];
    this.isProcessing = false;
  }

  // Request storage permission
  async requestStoragePermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs storage permission to download videos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true; // iOS doesn't need permission
  }

  // Generate random filename without username
  generateFileName(extension = 'mp4') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `video_${timestamp}_${random}.${extension}`;
  }

  // Get download directory path
  getDownloadDirectory() {
    if (Platform.OS === 'android') {
      return RNFS.DownloadDirectoryPath;
    } else {
      return RNFS.DocumentDirectoryPath;
    }
  }

  // Start download
  async startDownload(video, callbacks = {}) {
    try {
      const hasPermission = await this.requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Cannot download without storage permission');
        return null;
      }

      const fileName = this.generateFileName();
      const downloadPath = `${this.getDownloadDirectory()}/${fileName}`;

      const downloadId = `download_${Date.now()}`;
      
      const download = RNFS.downloadFile({
        fromUrl: video.url,
        toFile: downloadPath,
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          const speed = this.calculateSpeed(res.bytesWritten, res.contentLength, res);
          
          if (callbacks.onProgress) {
            callbacks.onProgress(progress, speed);
          }
          
          this.notifyListeners({
            id: downloadId,
            videoId: video.id,
            progress,
            speed,
            status: 'downloading'
          });
        },
        progressDivider: 5,
        begin: (res) => {
          if (callbacks.onStart) {
            callbacks.onStart(res);
          }
        },
      });

      this.downloads.push({
        id: downloadId,
        jobId: download.jobId,
        videoId: video.id,
        fileName,
        path: downloadPath,
        status: 'downloading',
        progress: 0
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        // Update video download count
        await update(ref(db, `videos/${video.id}`), {
          downloads: (video.downloads || 0) + 1
        });

        // Save to downloads history
        const downloadData = {
          videoId: video.id,
          userId: auth.currentUser?.uid || 'anonymous',
          fileName: fileName,
          filePath: downloadPath,
          downloadedAt: Date.now(),
          status: 'completed',
          fileSize: result.bytesWritten
        };

        const downloadsRef = ref(db, 'downloads');
        const newDownloadRef = push(downloadsRef);
        await set(newDownloadRef, downloadData);

        if (callbacks.onComplete) {
          callbacks.onComplete(fileName, downloadPath);
        }

        this.notifyListeners({
          id: downloadId,
          status: 'completed',
          fileName,
          path: downloadPath
        });

        return { success: true, fileName, path: downloadPath };
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError(error.message);
      }
      
      this.notifyListeners({
        id: `download_${Date.now()}`,
        status: 'failed',
        error: error.message
      });

      return { success: false, error: error.message };
    }
  }

  // Calculate download speed
  calculateSpeed(bytesWritten, contentLength, res) {
    const elapsed = res ? (Date.now() - res.startTime) / 1000 : 1;
    const speed = bytesWritten / elapsed / 1024; // KB/s
    
    if (speed > 1024) {
      return `${(speed / 1024).toFixed(2)} MB/s`;
    }
    return `${speed.toFixed(2)} KB/s`;
  }

  // Cancel download
  cancelDownload(downloadId) {
    const download = this.downloads.find(d => d.id === downloadId);
    if (download && download.jobId) {
      RNFS.stopDownload(download.jobId);
      this.downloads = this.downloads.filter(d => d.id !== downloadId);
      return true;
    }
    return false;
  }

  // Get all downloads
  getDownloads() {
    return this.downloads;
  }

  // Add listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  // Notify listeners
  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }

  // Clear completed downloads
  clearCompleted() {
    this.downloads = this.downloads.filter(d => d.status !== 'completed');
  }

  // Add to queue
  addToQueue(video) {
    this.downloadQueue.push(video);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Process queue
  async processQueue() {
    if (this.downloadQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const video = this.downloadQueue.shift();
    
    await this.startDownload(video, {
      onComplete: () => {
        this.processQueue();
      },
      onError: () => {
        this.processQueue();
      }
    });
  }

  // Get file size
  async getFileSize(url) {
    try {
      const info = await RNFS.exists(url);
      if (info) {
        const stat = await RNFS.stat(url);
        return stat.size;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  // Delete downloaded file
  async deleteFile(path) {
    try {
      await RNFS.unlink(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get storage info
  async getStorageInfo() {
    try {
      const freeSpace = await RNFS.getFSInfo();
      return {
        free: freeSpace.freeSpace,
        total: freeSpace.totalSpace,
        used: freeSpace.totalSpace - freeSpace.freeSpace
      };
    } catch (error) {
      return null;
    }
  }
}

export default new DownloadManager();
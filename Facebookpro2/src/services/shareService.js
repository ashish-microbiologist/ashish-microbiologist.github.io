import { Share, Platform, Alert, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import { db } from './firebase';
import { ref, push, set, update } from 'firebase/database';

class ShareService {
  constructor() {
    this.supportedApps = {
      whatsapp: 'whatsapp://',
      instagram: 'instagram://',
      facebook: 'fb://',
      telegram: 'tg://',
      messenger: 'fb-messenger://',
      twitter: 'twitter://'
    };
  }

  // Share video to any app
  async shareVideo(video, options = {}) {
    try {
      const shareOptions = {
        title: options.title || 'Share Video',
        message: options.message || `Check out this video: ${video.title || 'Untitled'}`,
        url: video.url,
        subject: options.subject || 'Video Share',
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        // Track share
        await this.trackShare(video, 'system');
        
        return {
          success: true,
          action: 'shared',
          data: result
        };
      } else if (result.action === Share.dismissedAction) {
        return {
          success: false,
          action: 'dismissed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Share to specific app
  async shareToApp(video, appName) {
    try {
      const appScheme = this.supportedApps[appName];
      
      if (!appScheme) {
        Alert.alert('Error', `${appName} is not supported`);
        return { success: false };
      }

      // Check if app is installed
      const isInstalled = await Linking.canOpenURL(appScheme);
      
      if (!isInstalled) {
        Alert.alert(
          'App Not Installed',
          `${appName} is not installed on your device. Would you like to install it?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Install', 
              onPress: () => this.openAppStore(appName)
            }
          ]
        );
        return { success: false };
      }

      // Create share message
      const message = `Check out this video: ${video.title || 'Untitled'}\n${video.url}`;
      
      // Encode for URL
      const encodedMessage = encodeURIComponent(message);
      
      // Create share URL based on app
      let shareUrl = '';
      switch(appName) {
        case 'whatsapp':
          shareUrl = `whatsapp://send?text=${encodedMessage}`;
          break;
        case 'telegram':
          shareUrl = `tg://msg?text=${encodedMessage}`;
          break;
        case 'twitter':
          shareUrl = `twitter://post?message=${encodedMessage}`;
          break;
        default:
          shareUrl = appScheme;
      }

      // Open app
      await Linking.openURL(shareUrl);

      // Track share
      await this.trackShare(video, appName);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Track share in Firebase
  async trackShare(video, method) {
    try {
      const shareData = {
        videoId: video.id,
        sharedAt: Date.now(),
        shareMethod: method,
        videoTitle: video.title || 'Untitled'
      };

      const sharesRef = ref(db, 'shares');
      const newShareRef = push(sharesRef);
      await set(newShareRef, shareData);

      // Update video share count
      await update(ref(db, `videos/${video.id}`), {
        shares: (video.shares || 0) + 1
      });

      return true;
    } catch (error) {
      console.log('Error tracking share:', error);
      return false;
    }
  }

  // Create shareable link
  async createShareLink(video) {
    try {
      const linkData = {
        videoId: video.id,
        createdAt: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        clicks: 0
      };

      const linksRef = ref(db, 'shareLinks');
      const newLinkRef = push(linksRef);
      await set(newLinkRef, linkData);

      const shareLink = `https://fbpro2.com/share/${newLinkRef.key}`;
      
      return {
        success: true,
        link: shareLink,
        id: newLinkRef.key
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get share history
  async getShareHistory(userId) {
    try {
      // Implementation depends on your database structure
      return [];
    } catch (error) {
      return [];
    }
  }

  // Open app store for installation
  openAppStore(appName) {
    const stores = {
      whatsapp: Platform.OS === 'ios' 
        ? 'https://apps.apple.com/app/whatsapp-messenger/id310633997'
        : 'market://details?id=com.whatsapp',
      instagram: Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/instagram/id389801252'
        : 'market://details?id=com.instagram.android',
      facebook: Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/facebook/id284882215'
        : 'market://details?id=com.facebook.katana',
      telegram: Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/telegram-messenger/id686449807'
        : 'market://details?id=org.telegram.messenger',
    };

    const url = stores[appName];
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Cannot open store');
      });
    }
  }

  // Get available share options
  getShareOptions() {
    return [
      { id: 'system', name: 'More Apps', icon: 'share-social' },
      { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp' },
      { id: 'telegram', name: 'Telegram', icon: 'paper-plane' },
      { id: 'instagram', name: 'Instagram', icon: 'logo-instagram' },
      { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
      { id: 'messenger', name: 'Messenger', icon: 'logo-messenger' },
      { id: 'twitter', name: 'Twitter', icon: 'logo-twitter' },
    ];
  }
}

export default new ShareService();
export const SOCIAL_LINKS = {
  whatsapp: "https://chat.whatsapp.com/Bmm46aZWjTm3UehpBnTrfL?mode=gi_t",
  instagram: "https://instagram.com/_op_ashiah_yt__",
  telegram: "https://t.me/op_ashish_yt_channel",
  website: "https://ashish-microbiologiat.github.io",
  email: "opashishytff@gmail.com",
  youtube: "https://youtube.com/@op_ashish_yt"
};

export const APP_INFO = {
  name: "Facebook Pro 2",
  version: "1.0.0",
  developer: "OP Ashish YT",
  email: "opashishytff@gmail.com",
  description: "Watch stories, download videos without username"
};

export const COLORS = {
  primary: '#1877F2',
  secondary: '#42B72A',
  background: '#FFFFFF',
  text: '#000000',
  gray: '#F0F2F5',
  darkGray: '#65676B',
  whatsapp: '#25D366',
  instagram: '#E4405F',
  telegram: '#0088CC',
  website: '#4285F4',
  youtube: '#FF0000',
  facebook: '#1877F2',
  messenger: '#0084FF',
  twitter: '#1DA1F2',
  danger: '#dc3545',
  success: '#28a745',
  warning: '#ffc107',
  info: '#17a2b8'
};

export const STORY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const MAX_STORY_DURATION = 60000; // 60 seconds max
export const MIN_STORY_DURATION = 3000; // 3 seconds min

export const VIDEO_QUALITIES = {
  '240': '240p',
  '480': '480p', 
  '720': '720p',
  '1080': '1080p'
};

export const DOWNLOAD_PATHS = {
  videos: '/videos',
  stories: '/stories',
  thumbnails: '/thumbnails'
};

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'trending', name: 'Trending', icon: 'flame' },
  { id: 'new', name: 'New', icon: 'newspaper' },
  { id: 'music', name: 'Music', icon: 'musical-notes' },
  { id: 'comedy', name: 'Comedy', icon: 'happy' },
  { id: 'education', name: 'Education', icon: 'school' },
  { id: 'sports', name: 'Sports', icon: 'football' },
  { id: 'gaming', name: 'Gaming', icon: 'game-controller' }
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'mr', name: 'मराठी' }
];

export const THEMES = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    card: '#F0F2F5',
    border: '#DDDDDD',
    icon: '#65676B'
  },
  dark: {
    background: '#18191A',
    text: '#E4E6EB',
    card: '#242526',
    border: '#3E4042',
    icon: '#B0B3B8'
  }
};

export const STORAGE_KEYS = {
  THEME: '@app_theme',
  LANGUAGE: '@app_language',
  PREFERENCES: '@user_preferences',
  DOWNLOADS: '@downloads_history',
  USER_ID: '@anonymous_user_id'
};

export const API_ENDPOINTS = {
  share: 'https://fbpro2.com/share',
  update: 'https://fbpro2.com/update'
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  PERMISSION: 'Permission denied. Please grant required permissions.',
  DOWNLOAD_FAILED: 'Download failed. Please try again.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  STORY_EXPIRED: 'This story has expired.',
  VIDEO_NOT_FOUND: 'Video not found.'
};

export const SUCCESS_MESSAGES = {
  DOWNLOADED: 'Video downloaded successfully!',
  UPLOADED: 'Story uploaded successfully!',
  SHARED: 'Shared successfully!',
  SAVED: 'Saved successfully!'
};
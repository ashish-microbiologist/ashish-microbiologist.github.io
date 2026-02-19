import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 3;

const StoryCard = ({ story, onPress, showUserInfo = true }) => {
  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  const getMediaIcon = (type) => {
    return type === 'video' ? 'videocam' : 'camera';
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(story)}
      activeOpacity={0.8}
    >
      <View style={styles.card}>
        {/* Story Thumbnail */}
        <Image 
          source={{ uri: story.mediaUrl }} 
          style={styles.thumbnail}
          defaultSource={require('../../assets/images/placeholder.jpg')}
        />
        
        {/* Media Type Indicator */}
        <View style={styles.mediaType}>
          <Icon 
            name={getMediaIcon(story.mediaType)} 
            size={12} 
            color="white" 
          />
        </View>

        {/* Viewed Overlay (if needed) */}
        {story.viewed && (
          <View style={styles.viewedOverlay}>
            <Icon name="checkmark" size={16} color="white" />
          </View>
        )}

        {/* User Info */}
        {showUserInfo && (
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>
                {getInitials(story.userName)}
              </Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {story.userName || 'Anonymous'}
            </Text>
          </View>
        )}

        {/* Time Badge */}
        <View style={styles.timeBadge}>
          <Icon name="time-outline" size={10} color="white" />
          <Text style={styles.timeText}>
            {getTimeAgo(story.createdAt)}
          </Text>
        </View>

        {/* Expiry Indicator */}
        {story.expiryTime && story.expiryTime - Date.now() < 3600000 && (
          <View style={styles.expiringBadge}>
            <Icon name="alert-circle" size={10} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Alternative Compact Version
export const StoryAvatar = ({ story, onPress, size = 60 }) => (
  <TouchableOpacity 
    style={[styles.avatarContainer, { width: size, height: size }]}
    onPress={() => onPress(story)}
  >
    <Image 
      source={{ uri: story.mediaUrl }} 
      style={[styles.avatarImage, { width: size, height: size }]}
    />
    <View style={[styles.avatarBorder, { width: size + 4, height: size + 4 }]} />
    <Text style={styles.avatarName} numberOfLines={1}>
      {story.userName?.split(' ')[0] || 'User'}
    </Text>
  </TouchableOpacity>
);

// Story Row Component
export const StoryRow = ({ stories, onPress }) => (
  <View style={styles.rowContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {stories.map((story) => (
        <StoryAvatar 
          key={story.id} 
          story={story} 
          onPress={onPress}
          size={70}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    margin: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    resizeMode: 'cover',
  },
  mediaType: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  viewedOverlay: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#1877F2',
    borderRadius: 12,
    padding: 4,
  },
  userInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  timeBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timeText: {
    color: 'white',
    fontSize: 9,
    marginLeft: 2,
  },
  expiringBadge: {
    position: 'absolute',
    top: 5,
    right: 30,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    padding: 4,
  },
  // Avatar styles
  avatarContainer: {
    marginHorizontal: 8,
    alignItems: 'center',
  },
  avatarImage: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#1877F2',
  },
  avatarBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#1877F2',
  },
  avatarName: {
    fontSize: 11,
    color: '#65676B',
    marginTop: 4,
    maxWidth: 70,
    textAlign: 'center',
  },
  rowContainer: {
    paddingVertical: 10,
    backgroundColor: 'white',
  },
});

export default StoryCard;

// Usage:
// <StoryCard story={story} onPress={handlePress} />
// <StoryAvatar story={story} onPress={handlePress} size={80} />
// <StoryRow stories={stories} onPress={handlePress} />
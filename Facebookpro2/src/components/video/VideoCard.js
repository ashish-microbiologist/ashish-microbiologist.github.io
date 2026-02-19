import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 20;
const CARD_HEIGHT = 250;

const VideoCard = ({ 
  video, 
  onPress, 
  onDownload, 
  onShare, 
  onLike,
  showActions = true,
  variant = 'grid'
}) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paused, setPaused] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(video.id, !liked);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(video);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(video);
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(video);
    }
  };

  const togglePlay = () => {
    setShowVideo(!showVideo);
    setPaused(!paused);
  };

  // Grid View Card
  if (variant === 'grid') {
    return (
      <TouchableOpacity 
        style={styles.gridCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: video.thumbnail }} style={styles.gridThumbnail} />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gridOverlay}
        >
          <View style={styles.gridContent}>
            <Text style={styles.gridTitle} numberOfLines={2}>
              {video.title || 'Untitled Video'}
            </Text>
            
            <View style={styles.gridStats}>
              <View style={styles.statItem}>
                <Icon name="eye" size={12} color="white" />
                <Text style={styles.statText}>{formatNumber(video.views)}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="heart" size={12} color="white" />
                <Text style={styles.statText}>{formatNumber(video.likes)}</Text>
              </View>
              <View style={styles.statItem}>
                <Icon name="download" size={12} color="white" />
                <Text style={styles.statText}>{formatNumber(video.downloads)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.durationBadge}>
            <Icon name="time" size={12} color="white" />
            <Text style={styles.durationText}>{formatDuration(video.duration)}</Text>
          </View>

          {video.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{video.category}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // List View Card
  if (variant === 'list') {
    return (
      <TouchableOpacity 
        style={styles.listCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.listThumbnailContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.listThumbnail} />
          <View style={styles.listDurationBadge}>
            <Icon name="time" size={10} color="white" />
            <Text style={styles.listDurationText}>{formatDuration(video.duration)}</Text>
          </View>
        </View>

        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {video.title || 'Untitled Video'}
          </Text>
          
          <View style={styles.listMeta}>
            <Text style={styles.listCategory}>{video.category || 'Video'}</Text>
            <Text style={styles.listDot}>•</Text>
            <Icon name="eye" size={12} color="#65676B" />
            <Text style={styles.listViews}>{formatNumber(video.views)}</Text>
          </View>

          {showActions && (
            <View style={styles.listActions}>
              <TouchableOpacity style={styles.listAction} onPress={handleLike}>
                <Icon 
                  name={liked ? 'heart' : 'heart-outline'} 
                  size={20} 
                  color={liked ? '#E4405F' : '#65676B'} 
                />
                <Text style={styles.listActionText}>{formatNumber(video.likes)}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listAction} onPress={handleDownload}>
                <Icon name="download-outline" size={20} color="#65676B" />
                <Text style={styles.listActionText}>{formatNumber(video.downloads)}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listAction} onPress={handleShare}>
                <Icon name="share-outline" size={20} color="#65676B" />
                <Text style={styles.listActionText}>{formatNumber(video.shares)}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Featured View Card
  return (
    <View style={styles.featuredCard}>
      <TouchableOpacity 
        style={styles.featuredVideoContainer}
        onPress={togglePlay}
        activeOpacity={0.9}
      >
        {showVideo ? (
          <Video
            source={{ uri: video.url }}
            style={styles.featuredVideo}
            paused={paused}
            resizeMode="cover"
            repeat={true}
          />
        ) : (
          <Image source={{ uri: video.thumbnail }} style={styles.featuredVideo} />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.featuredOverlay}
        >
          <View style={styles.featuredTop}>
            <View style={styles.featuredCategory}>
              <Text style={styles.featuredCategoryText}>
                {video.category || 'Featured'}
              </Text>
            </View>
            <TouchableOpacity style={styles.featuredMenu}>
              <Icon name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.featuredBottom}>
            <Text style={styles.featuredTitle}>{video.title}</Text>
            
            <View style={styles.featuredStats}>
              <View style={styles.featuredStat}>
                <Icon name="eye" size={14} color="white" />
                <Text style={styles.featuredStatText}>{formatNumber(video.views)}</Text>
              </View>
              <View style={styles.featuredStat}>
                <Icon name="heart" size={14} color="white" />
                <Text style={styles.featuredStatText}>{formatNumber(video.likes)}</Text>
              </View>
              <Text style={styles.featuredDuration}>{formatDuration(video.duration)}</Text>
            </View>

            <View style={styles.featuredActions}>
              <TouchableOpacity style={styles.featuredAction} onPress={handleLike}>
                <Icon name={liked ? 'heart' : 'heart-outline'} size={24} color="white" />
                <Text style={styles.featuredActionText}>Like</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featuredAction} onPress={handleDownload}>
                <Icon name="download-outline" size={24} color="white" />
                <Text style={styles.featuredActionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.featuredAction} onPress={handleShare}>
                <Icon name="share-outline" size={24} color="white" />
                <Text style={styles.featuredActionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {!showVideo && (
          <View style={styles.playButton}>
            <Icon name="play-circle" size={50} color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Grid View Styles
  gridCard: {
    width: (width - 30) / 2,
    height: 200,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gridThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  gridContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  gridTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 5,
  },
  gridStats: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3,
  },
  durationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 3,
  },
  categoryBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '600',
  },

  // List View Styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listThumbnailContainer: {
    width: 100,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  listThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listDurationBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  listDurationText: {
    color: 'white',
    fontSize: 8,
    marginLeft: 2,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1E21',
    marginBottom: 4,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  listDot: {
    marginHorizontal: 4,
    color: '#65676B',
  },
  listViews: {
    fontSize: 12,
    color: '#65676B',
    marginLeft: 2,
  },
  listActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  listAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  listActionText: {
    fontSize: 12,
    color: '#65676B',
    marginLeft: 4,
  },

  // Featured View Styles
  featuredCard: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#000',
  },
  featuredVideoContainer: {
    width: '100%',
    height: '100%',
  },
  featuredVideo: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredCategory: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  featuredCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuredMenu: {
    padding: 5,
  },
  featuredBottom: {
    marginBottom: 20,
  },
  featuredTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featuredStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  featuredStatText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  featuredDuration: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginLeft: 'auto',
  },
  featuredActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  featuredAction: {
    alignItems: 'center',
  },
  featuredActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default VideoCard;

// Usage:
// <VideoCard video={video} variant="grid" onPress={handlePress} />
// <VideoCard video={video} variant="list" onPress={handlePress} />
// <VideoCard video={video} variant="featured" onPress={handlePress} />
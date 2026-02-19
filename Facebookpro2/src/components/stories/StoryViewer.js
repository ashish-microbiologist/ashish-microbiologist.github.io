import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Animated,
  PanResponder
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const StoryViewer = ({ visible, stories, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      startProgress();
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    setProgress(0);
    setLoading(true);
    startProgress();
  }, [currentIndex]);

  const startProgress = () => {
    const duration = currentStory?.duration || 5000;
    progressAnim.setValue(0);
    
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  };

  const pauseProgress = () => {
    progressAnim.stopAnimation();
    setPaused(true);
    if (videoRef.current) {
      videoRef.current.pause?.();
    }
  };

  const resumeProgress = () => {
    const remaining = (1 - progress) * (currentStory?.duration || 5000);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: remaining,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
    setPaused(false);
    if (videoRef.current) {
      videoRef.current.resume?.();
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTap = (evt) => {
    const x = evt.nativeEvent.locationX;
    if (x < width / 3) {
      goToPrevious();
    } else if (x > (width * 2) / 3) {
      goToNext();
    } else {
      // Middle tap - toggle pause
      if (paused) {
        resumeProgress();
      } else {
        pauseProgress();
      }
    }
  };

  const handleLongPress = () => {
    pauseProgress();
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleLongPressOut = () => {
    resumeProgress();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 50) {
        onClose();
      }
    },
  });

  const handleVideoLoad = () => {
    setLoading(false);
  };

  const handleVideoProgress = (data) => {
    const progressPercent = data.currentTime / data.playableDuration;
    setProgress(progressPercent);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  if (!visible || !currentStory) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container} {...panResponder.panHandlers}>
        {/* Progress Bars */}
        <View style={styles.progressContainer}>
          {stories.map((story, index) => (
            <View key={index} style={styles.progressBarWrapper}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: index === currentIndex ? ['0%', '100%'] : 
                                   index < currentIndex ? '100%' : '0%',
                    }),
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.header}
        >
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentStory.userName?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{currentStory.userName}</Text>
              <Text style={styles.time}>
                {new Date(currentStory.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setMuted(!muted)} style={styles.headerButton}>
              <Icon name={muted ? 'volume-mute' : 'volume-high'} size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Story Content */}
        <Animated.View 
          style={[styles.storyContent, { opacity: fadeAnim }]}
          onTouchStart={handleLongPress}
          onTouchEnd={handleLongPressOut}
          onTouchCancel={handleLongPressOut}
          onTouchMove={handleTap}
        >
          {currentStory.mediaType === 'video' ? (
            <>
              <Video
                ref={videoRef}
                source={{ uri: currentStory.mediaUrl }}
                style={styles.media}
                paused={paused}
                muted={muted}
                resizeMode="contain"
                repeat={false}
                onLoad={handleVideoLoad}
                onProgress={handleVideoProgress}
                onEnd={goToNext}
              />
              {loading && (
                <View style={styles.loader}>
                  <ActivityIndicator size="large" color="white" />
                </View>
              )}
            </>
          ) : (
            <Image 
              source={{ uri: currentStory.mediaUrl }} 
              style={styles.media}
              onLoad={() => setLoading(false)}
            />
          )}
        </Animated.View>

        {/* Footer */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.footer}
        >
          <View style={styles.storyInfo}>
            <Text style={styles.storyCaption}>
              {currentStory.caption || 'No caption'}
            </Text>
            <View style={styles.storyStats}>
              <Icon name="eye" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statsText}>{currentStory.views || 0} views</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Pause Indicator */}
        {paused && (
          <View style={styles.pauseIndicator}>
            <Icon name="pause-circle" size={60} color="rgba(255,255,255,0.7)" />
          </View>
        )}

        {/* Navigation Hints */}
        <View style={styles.navHints}>
          <Text style={styles.navHint}>← Tap left edge for previous</Text>
          <Text style={styles.navHint}>Tap right edge for next →</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    zIndex: 10,
  },
  progressBarWrapper: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 9,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: width,
    height: height,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingBottom: 40,
    paddingTop: 20,
    zIndex: 9,
  },
  storyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyCaption: {
    color: 'white',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  storyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 5,
  },
  pauseIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  navHints: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    opacity: 0.5,
  },
  navHint: {
    color: 'white',
    fontSize: 11,
  },
});

export default StoryViewer;

// Usage:
// <StoryViewer 
//   visible={visible}
//   stories={stories}
//   initialIndex={0}
//   onClose={() => setVisible(false)}
// />
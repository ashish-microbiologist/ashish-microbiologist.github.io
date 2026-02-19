import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated
} from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../utils/constants';

const DownloadProgress = ({
  visible = false,
  progress = 0,
  fileName = '',
  speed = '',
  onCancel
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const getStatusText = () => {
    if (progress >= 100) return 'Completed';
    if (progress > 0) return 'Downloading...';
    return 'Starting...';
  };

  const getProgressColor = () => {
    if (progress >= 100) return COLORS.success;
    return COLORS.primary;
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.progressBox}>
          <View style={styles.header}>
            <Icon name="download" size={24} color={COLORS.primary} />
            <Text style={styles.title}>Downloading Video</Text>
          </View>

          <Text style={styles.fileName} numberOfLines={1}>
            {fileName || 'video.mp4'}
          </Text>

          <View style={styles.progressContainer}>
            <Progress.Bar
              progress={progress / 100}
              width={null}
              height={8}
              color={getProgressColor()}
              unfilledColor="#E4E6EB"
              borderWidth={0}
              borderRadius={4}
              animated={true}
            />
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.percentage}>
              {Math.round(progress)}%
            </Text>
            {speed ? (
              <Text style={styles.speed}>
                {speed}
              </Text>
            ) : null}
          </View>

          <Text style={styles.status}>
            {getStatusText()}
          </Text>

          {progress < 100 && (
            <View style={styles.buttonContainer}>
              <View style={styles.cancelButton} onTouchEnd={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </View>
            </View>
          )}

          {progress >= 100 && (
            <View style={styles.completedIcon}>
              <Icon name="checkmark-circle" size={50} color={COLORS.success} />
              <Text style={styles.completedText}>Download Complete</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1C1E21',
  },
  fileName: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 15,
  },
  progressContainer: {
    marginVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1877F2',
  },
  speed: {
    fontSize: 14,
    color: '#65676B',
  },
  status: {
    fontSize: 14,
    color: '#65676B',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#F0F2F5',
  },
  cancelText: {
    fontSize: 16,
    color: '#65676B',
    fontWeight: '600',
  },
  completedIcon: {
    alignItems: 'center',
    marginTop: 10,
  },
  completedText: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 5,
  },
});

export default DownloadProgress;
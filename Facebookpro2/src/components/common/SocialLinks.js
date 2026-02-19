import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SOCIAL_LINKS, COLORS, APP_INFO } from '../../utils/constants';

const SocialLinks = ({ variant = 'grid', onLinkPress }) => {
  const socialLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'logo-whatsapp',
      url: SOCIAL_LINKS.whatsapp,
      color: '#25D366',
      username: 'Join Group'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'logo-instagram',
      url: SOCIAL_LINKS.instagram,
      color: '#E4405F',
      username: '@_op_ashiah_yt__'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: 'paper-plane',
      url: SOCIAL_LINKS.telegram,
      color: '#0088CC',
      username: 'OP Ashish YT Channel'
    },
    {
      id: 'website',
      name: 'Website',
      icon: 'globe',
      url: SOCIAL_LINKS.website,
      color: '#4285F4',
      username: 'ashish-microbiologiat.github.io'
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'mail',
      url: `mailto:${SOCIAL_LINKS.email}`,
      color: '#EA4335',
      username: APP_INFO.email
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: 'logo-youtube',
      url: SOCIAL_LINKS.youtube,
      color: '#FF0000',
      username: '@op_ashish_yt'
    }
  ];

  const openLink = async (url, name) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        if (onLinkPress) {
          onLinkPress(name);
        }
      } else {
        Alert.alert('Error', `Cannot open ${name} link`);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const GridView = () => (
    <View style={styles.gridContainer}>
      {socialLinks.map((link) => (
        <TouchableOpacity
          key={link.id}
          style={[styles.gridItem, { backgroundColor: link.color }]}
          onPress={() => openLink(link.url, link.name)}
        >
          <Icon name={link.icon} size={30} color="white" />
          <Text style={styles.gridName}>{link.name}</Text>
          <Text style={styles.gridUsername} numberOfLines={1}>
            {link.username}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const ListView = () => (
    <View style={styles.listContainer}>
      {socialLinks.map((link) => (
        <TouchableOpacity
          key={link.id}
          style={[styles.listItem, { borderLeftColor: link.color, borderLeftWidth: 4 }]}
          onPress={() => openLink(link.url, link.name)}
        >
          <View style={[styles.listIconContainer, { backgroundColor: link.color }]}>
            <Icon name={link.icon} size={22} color="white" />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listName}>{link.name}</Text>
            <Text style={styles.listUsername}>{link.username}</Text>
          </View>
          <Icon name="open-outline" size={20} color={COLORS.darkGray} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const HorizontalView = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalContainer}
    >
      {socialLinks.map((link) => (
        <TouchableOpacity
          key={link.id}
          style={[styles.horizontalItem, { backgroundColor: link.color }]}
          onPress={() => openLink(link.url, link.name)}
        >
          <Icon name={link.icon} size={24} color="white" />
          <Text style={styles.horizontalName}>{link.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const getVariant = () => {
    switch (variant) {
      case 'grid':
        return <GridView />;
      case 'list':
        return <ListView />;
      case 'horizontal':
        return <HorizontalView />;
      default:
        return <ListView />;
    }
  };

  return (
    <View style={styles.container}>
      {getVariant()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  // Grid View Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  gridItem: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  gridUsername: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  // List View Styles
  listContainer: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  listIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1E21',
  },
  listUsername: {
    fontSize: 13,
    color: '#65676B',
    marginTop: 2,
  },
  // Horizontal View Styles
  horizontalContainer: {
    paddingHorizontal: 10,
  },
  horizontalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    elevation: 2,
  },
  horizontalName: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SocialLinks;

// Usage Examples:
// <SocialLinks variant="grid" />
// <SocialLinks variant="list" />
// <SocialLinks variant="horizontal" />
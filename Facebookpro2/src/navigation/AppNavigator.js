import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import BottomTabNavigator from './BottomTabNavigator';
import VideoDetailScreen from '../screens/VideoDetailScreen';
import StoryViewerScreen from '../screens/StoryViewerScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={BottomTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="VideoDetail" 
          component={VideoDetailScreen} 
          options={{ 
            title: '',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#000' }
          }}
        />
        <Stack.Screen 
          name="StoryViewer" 
          component={StoryViewerScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
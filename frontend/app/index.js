import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import YouTubeSearch from './YouTubeSearch';
import VideoDetail from './VideoDetail';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="YouTubeSearch">
        <Stack.Screen name="YouTubeSearch" component={YouTubeSearch} options={{ title: 'YouTube Search' }} />
        <Stack.Screen name="VideoDetail" component={VideoDetail} options={{ title: 'Video Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

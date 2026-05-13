import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import PlacesScreen from '../screens/PlacesScreen';
import RecommendationScreen from '../screens/RecommendationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0d0f12' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Places" component={PlacesScreen} />
        <Stack.Screen name="Recommendation" component={RecommendationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

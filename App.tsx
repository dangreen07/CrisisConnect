import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from './MainPage';
import AnnouncementsPage from './AnnouncementsPage';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
          headerShown: false
        }}>
        <Tab.Screen name="Main" component={MainPage} />
        <Tab.Screen name="Announcements" component={AnnouncementsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

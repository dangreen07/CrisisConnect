import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from './MainPage';
import AnnouncementsPage from './AnnouncementsPage';
import { theme } from './Constants';

const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.backgroundColor,
    text: theme.textColor,
    primary: theme.primaryColor, 
    card: theme.navigatorColor,
    border: theme.backgroundColor,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Main" component={MainPage} />
        <Tab.Screen name="Announcements" component={AnnouncementsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

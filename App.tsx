import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnnouncementsPage from './AnnouncementsPage';
import { theme } from './Constants';
import MainPageNavigator from './MainPageNavigator';

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
        <Tab.Screen name="MainNavigator" component={MainPageNavigator} />
        <Tab.Screen name="Announcements" component={AnnouncementsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

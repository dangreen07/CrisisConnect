import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MainPage from './MainPage';
import AnnouncementsPage from './AnnouncementsPage';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Main" component={MainPage} />
        <Tab.Screen name="Announcements" component={AnnouncementsPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomTabNavigator;

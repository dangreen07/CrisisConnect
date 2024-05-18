import 'react-native-gesture-handler';
import { theme } from "../Constants";
import MainPageNavigator from "./tasks-manager-pages/MainPageNavigator";
import AnnouncementsPage from "./AnnouncementsPage";
import UserPage from "./UserPage";
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Icon } from 'react-native-paper';
import MapNavigator from './map-page/MapPageNavigator';

const Tab = createMaterialBottomTabNavigator();

export default function MainAppNavigator() {
    return (
        <Tab.Navigator barStyle={{backgroundColor: theme.navigatorColor}}  >
          <Tab.Screen name="MainNavigator" component={MainPageNavigator} options={{tabBarLabel: "Home", tabBarIcon: ({ color }) => (
            <Icon source="home" color={color} size={30} />
          ),}} />
          <Tab.Screen name="Announcements" component={AnnouncementsPage} options={{tabBarLabel: "Announcements", tabBarIcon: ({ color }) => (
            <Icon source="message-alert-outline" color={color} size={30} />
          ),}}/>
          <Tab.Screen name="MapNavigator" component={MapNavigator} options={{tabBarLabel: "Map", tabBarIcon: ({ color }) => (
            <Icon source="map" color={color} size={30} />
          ),}}/>
          <Tab.Screen name="User" component={UserPage} options={{tabBarLabel: "User", tabBarIcon: ({ color }) => (
            <Icon source="account" color={color} size={30} />
          ),}}/>
        </Tab.Navigator>
    );
}
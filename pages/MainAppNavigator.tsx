import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { theme } from "../Constants";
import MainPageNavigator from "./tasks-manager-pages/MainPageNavigator";
import AnnouncementsPage from "./AnnouncementsPage";
import Map from "./MapPage";
import UserPage from "./UserPage";
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Icon } from 'react-native-paper';

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
          <Tab.Screen name="Map" component={Map} options={{tabBarLabel: "Map", tabBarIcon: ({ color }) => (
            <Icon source="map" color={color} size={30} />
          ),}}/>
          <Tab.Screen name="User" component={UserPage} options={{tabBarLabel: "User", tabBarIcon: ({ color }) => (
            <Icon source="account" color={color} size={30} />
          ),}}/>
        </Tab.Navigator>
    );
}
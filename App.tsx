import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnnouncementsPage from './AnnouncementsPage';
import { theme } from './Constants';
import MainPageNavigator from './MainPageNavigator';
import Map from './MapPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetupUser from './SetupUserPage';

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
  const [loggedIn, setLoggedIn] = useState(false);

  const checkLoggedIn = async () => {
    try {
      const value = await AsyncStorage.getItem("sessionID");
      if (value !== null) {
        // Value previously stored
        setLoggedIn(true);
      }
      else {
        // Value never stored (definitely know not logged in)
        setLoggedIn(false);
      }
    } catch (e) {
      // Error reading value
    }
  }

  useEffect(() => {
    checkLoggedIn();
  }, []);

  if(!loggedIn){
    return (
      <SetupUser />
    )
  }
  else {
    return (
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator screenOptions={{
            headerShown: false,
          }}>
          <Tab.Screen name="MainNavigator" component={MainPageNavigator} />
          <Tab.Screen name="Announcements" component={AnnouncementsPage} />
          <Tab.Screen name="Map" component={Map} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
};

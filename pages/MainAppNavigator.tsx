import 'react-native-gesture-handler';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { theme } from "../Constants";
import MainPageNavigator from "./tasks-manager-pages/MainPageNavigator";
import AnnouncementsPage from "./AnnouncementsPage";
import Map from "./MapPage";
import UserPage from "./UserPage";

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

export default function MainAppNavigator() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
          }}>
          <Tab.Screen name="MainNavigator" component={MainPageNavigator} />
          <Tab.Screen name="Announcements" component={AnnouncementsPage} />
          <Tab.Screen name="Map" component={Map} />
          <Tab.Screen name="User" component={UserPage} />
        </Tab.Navigator>
    );
}
import 'react-native-gesture-handler';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetupUser from './pages/login-pages/SetupUserPage';
import MainAppNavigator from './pages/MainAppNavigator';
import { theme } from './Constants';
import GroupSignin from './pages/login-pages/GroupLoginPage';
import Signup from './pages/login-pages/Signup';

const Stack = createNativeStackNavigator();

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
      <Stack.Navigator screenOptions={{
            headerShown: false,
            animation: 'none'
          }}>
        <Stack.Screen name="Login" component={SetupUser} />
        <Stack.Screen name="GroupSignin" component={GroupSignin} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainSection" component={MainAppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

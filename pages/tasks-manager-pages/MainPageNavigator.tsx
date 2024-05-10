import 'react-native-gesture-handler';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './MainPage';
import AddTask from './AddTaskPage';

const Stack = createNativeStackNavigator();

export default function MainPageNavigator() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Main" component={MainPage} />
            <Stack.Screen name="AddTask" component={AddTask} />
        </Stack.Navigator>
    )
}
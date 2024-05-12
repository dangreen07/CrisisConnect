import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import TaskItem from '../../Components/TaskItem';
import { api, theme } from '../../Constants';
import { useIsFocused } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';

const addSymbol = require("../../assets/add.png");
const reloadSymbol = require('../../assets/reload.png');

SplashScreen.preventAutoHideAsync();

export default function MainPage({navigation}) {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  const getTasksFromAPI = () => {
    // In the real world this would connect to a cloud hosted API and not something on a local network
    fetch(`${api.address}/getTasks?group=1`, {
      method: 'GET',
    }).then(response => response.json()).then(json => {
      setTasks(json);
      SplashScreen.hideAsync();
    }).catch(error => {
      console.error(error);
    });
  }

  const addTask = () => {
    navigation.navigate("AddTask");
  }

  useEffect(() => {
    getTasksFromAPI();
    
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
        <View style={styles.topbar}>
          <Text style={styles.title}>Current Tasks</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={getTasksFromAPI}>
            <Image style={styles.reloadIcon} source={reloadSymbol} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {tasks.map((task) => {
            return (
              <TaskItem key={task.task_id} taskName={task.task_name} taskId={task.task_id} reloadFunction={getTasksFromAPI}/>
            )
          })}
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          {/* Attribution to author of add.png <a href="https://www.flaticon.com/free-icons/plus" title="plus icons">Plus icons created by srip - Flaticon</a> */}
          <Image style={styles.addIcon} source={addSymbol} />
        </TouchableOpacity>
      </SafeAreaView>
      <StatusBar style="auto"/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize:36,
    alignSelf: 'center',
    marginLeft: 10,
    color: theme.textColor,
  },
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reloadButton:{
    padding: 5,
    marginRight: 10,
  },
  reloadIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: theme.newTaskColor,
    padding: 20,
    borderRadius: 40,
  },
  addIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  }
});

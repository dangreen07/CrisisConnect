import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import TaskItem from '../../Components/TaskItem';
import { api, theme } from '../../Constants';
import { useIsFocused } from '@react-navigation/native';
import { SplashScreen } from 'expo-router';
import { Icon } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();

export default function MainPage({navigation}) {
  const [tasks, setTasks] = useState([]);
  const isFocused = useIsFocused();

  const getTasksFromAPI = () => {
    // In the real world this would connect to a cloud hosted API and not something on a local network
    fetch(`${api.address}/getTasks?session_id=${global.sessionID}`, {
      method: 'GET',
    }).then(response => response.json()).then(json => {
      setTasks(json["result"]);
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
        <View style={{flex: 1}}>
          <Text style={styles.title}>Current Tasks</Text>
          <TouchableOpacity style={styles.reloadButton} onPress={getTasksFromAPI}>
              <Icon source="reload" size={40} />
          </TouchableOpacity>
          <ScrollView>
            {tasks.map((task) => {
              return (
                <TaskItem key={task.task_id} taskName={task.task_name} taskId={task.task_id} reloadFunction={getTasksFromAPI}/>
              )
            })}
          </ScrollView>
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Icon source="plus" size={50} />
          </TouchableOpacity>
        </View>
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
    marginRight: 10,
    position: 'absolute',
    right: 5,
    top: 0,
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: theme.newTaskColor,
    padding: 15,
    borderRadius: 40,
  }
});

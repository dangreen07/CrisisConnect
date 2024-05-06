import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import TaskItem from './TaskItem';
import { theme } from './Constants';

export default function MainPage() {
  const [tasks, setTasks] = useState([]);

  const getTasksFromAPI = () => {
    // In the real world this would connect to a cloud hosted API and not something on a local network
    fetch("http://192.168.86.101:3000/getTasks?group=1", {
      method: 'GET',
    }).then(response => response.json()).then(json => {
      console.log(json);
      setTasks(json);
    }).catch(error => {
      console.error(error);
    });
  }

  useEffect(() => {
    getTasksFromAPI();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
        <View style={styles.topbar}>
          <Text style={styles.title}>Current Tasks</Text>
          <Pressable onPress={getTasksFromAPI}>
            <Image style={styles.reloadIcon} source={require('./assets/reload.png')} />
          </Pressable>
        </View>
        <ScrollView>
          {tasks.map((task) => {
            return (
              <TaskItem key={task.task_id} taskName={task.task_name} taskId={task.task_id} reloadFunction={getTasksFromAPI}/>
            )
          })}
        </ScrollView>
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
  reloadIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  }
});

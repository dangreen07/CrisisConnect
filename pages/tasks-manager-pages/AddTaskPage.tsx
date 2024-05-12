import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { api, theme } from '../../Constants';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AddTask({navigation}) {
    const [taskName, setTaskName] = useState('');

    const addNewTaskToDatabase = () => [
        fetch(`${api.address}/addTask?name=${taskName}&group=1`, {
            method: 'POST',
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.error(error);
        })
    ]

    const confirmNewTask = {
        text: 'Confirm',
        onPress: () => {
            addNewTaskToDatabase();
            navigation.navigate("Main");
        }
    }

    const cancelNewTask = {
        text: 'Cancel',
        onPress: () => console.log("New Task Cancelled!"),
        style: 'cancel',
    }

    const addNewTask = () => {
        if(taskName != '') {
            Alert.alert("Create Task", `Are you sure you want to create a task called: ${taskName}`,[
                cancelNewTask,
                confirmNewTask,
            ]);
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <Text style={styles.title}>Add New Task</Text>
                <View style={styles.inputRow}>
                    <Text style={styles.inputText}>Task Name: </Text>
                    <TextInput style={styles.inputBox} placeholder='Here...' onChangeText={newText => setTaskName(newText)} defaultValue={taskName} />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={addNewTask}>
                    <Text style={{fontSize: 18,}}>Submit</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
        fontSize: 36,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    inputBox: {
        height: 50,
        fontSize: 24,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    inputText: {
        fontSize: 24,
    },
    submitButton: {
        alignSelf: 'center',
        backgroundColor: theme.foregroundColor,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 15,
    }
});
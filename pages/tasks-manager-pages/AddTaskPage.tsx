import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { api, theme } from '../../Constants';
import { LogBox } from 'react-native';
import { Icon } from 'react-native-paper';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function AddTask({navigation}) {
    const [taskName, setTaskName] = useState('');

    const addNewTaskToDatabase = () => [
        fetch(`${api.address}/addTask?name=${taskName}&session_id=${global.sessionID}`, {
            method: 'POST',
        }).then(response => {
            navigation.navigate("Main");
        }).catch(error => {
            console.error(error);
        })
    ]

    const confirmNewTask = {
        text: 'Confirm',
        onPress: () => {
            addNewTaskToDatabase();
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

    const backButton = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>Add New Task</Text>
                    <TouchableOpacity style={{position: 'absolute', top: 0, left: 10}} onPress={backButton}>
                            <Icon source="arrow-left" size={40} />
                    </TouchableOpacity>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Task Name' onChangeText={newText => setTaskName(newText)} defaultValue={taskName} />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={addNewTask}>
                        <Text style={{fontSize: 18,}}>Submit</Text>
                    </TouchableOpacity>
                </View>
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
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 20,
    },
    submitButton: {
        alignSelf: 'center',
        backgroundColor: theme.foregroundColor,
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 15,
        marginTop: 15,
    }
});
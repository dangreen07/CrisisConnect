import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { api, theme } from '../Constants';
import React from 'react';


export default function Task( {taskName="G".repeat(35), taskId, reloadFunction} : {taskName?: string, taskId, reloadFunction: any} ) {
    const completeTask = () => {
        fetch(`${api.address}/completedTask?task=${taskId}`, {
            method: 'POST',
        }).then(response => {
            reloadFunction();
        }).catch(error => {
            console.error(error);
        })
    }

    const confirmTaskComplete = {
        text: 'Confirm',
        onPress: () => completeTask()
    }

    const cancelTaskComplete = {
        text: 'Cancel',
        onPress: () => console.log("Cancel Pressed!"),
        style: 'cancel',
    }

    const taskComplete = () => {
        console.log("Completed Task!");
        Alert.alert("Check off Task", "Press Confirm to check off: " + taskName, [
            cancelTaskComplete,
            confirmTaskComplete,
        ])
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{taskName}</Text>
            <TouchableOpacity
            onPress={taskComplete}
            style={styles.button}
            >
                <Image style={styles.taskComplete} source={require('../assets/task-complete.png')} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        backgroundColor: theme.foregroundColor,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 10,
    },
    title: {
        fontSize: 26,
        marginHorizontal: 10,
        paddingVertical: 25,
        flex: 1,
        color: theme.textColor,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        padding: 10,
    },
    taskComplete: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        marginRight: 10,
    }
});
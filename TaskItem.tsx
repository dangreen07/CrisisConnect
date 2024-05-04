import { View, Text, StyleSheet, Pressable, Animated, Image, Alert } from 'react-native';
import { theme } from './Constants';
import React from 'react';

const fadeInAnimationConfig = {
    toValue: .7,
    duration: 100,
    useNativeDriver: true,
}

const fadeOutAnimationConfig = {
    toValue: 0,
    duration: 100,
    useNativeDriver: true,
}

export default function Task( {taskName="Task Name Here"} : {taskName?: string} ) {
    const opacityValue = React.useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        Animated.timing(opacityValue, fadeInAnimationConfig).start();
    };

    const fadeOut = () => {
        Animated.timing(opacityValue, fadeOutAnimationConfig).start();
    }

    const confirmTaskComplete = {
        text: 'Confirm',
        onPress: () => console.log("Confirm Pressed!"),
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
            <Pressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            onPress={taskComplete}
            style={styles.button}
            >
                <Image style={styles.taskComplete} source={require('./assets/task-complete.png')} />
            </Pressable>
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
    },
    title: {
        fontSize: 26,
        marginHorizontal: 10,
        paddingVertical: 25,
        flex: 1,
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
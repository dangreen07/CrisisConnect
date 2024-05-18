import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { api, theme } from "../../Constants";
import { useState } from "react";
import * as Crypto from 'expo-crypto';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup({route, navigation}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");

    const { groupId } = route.params;

    const saveSessionID = (sessionID: string) => {
        try {
            AsyncStorage.setItem("sessionID", sessionID).then(() => {
                navigation.replace('MainSection'); // Used replace to ensure that the user cannot go back with a swipe or back button
            });
        } catch (e) {
            // Error reading value
            console.error(e);
        }
    }

    const signup = (hashedPassword: string) => {
        fetch(`${api.address}/signup`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hashedPassword,
                groupId: groupId
            })
        }).then(response => response.json()).then(json => {
            if(json["successful"] == true) {
                console.log(json);
                setUsernameMessage("");
                const sessionID = json["sessionID"];
                saveSessionID(sessionID);
            }
            else {
                console.log(json);
                const reason = json["reason"];
                if (reason == "Username already in use!") {
                    setUsernameMessage("Username already in use!");
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const signupAttempt = () => {
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password).then((hash) => {
            signup(hash);
        });
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <Text style={styles.title}>Signup</Text>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='First Name' onChangeText={newText => setFirstName(newText)} defaultValue={firstName} />
                </View>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Last Name' onChangeText={newText => setLastName(newText)} defaultValue={lastName} />
                </View>
                <Text style={{fontSize: 18, marginHorizontal: 10, alignSelf: 'center', marginTop: 10, marginBottom: -10, color: 'red'}}>{usernameMessage}</Text>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Username' onChangeText={newText => setUsername(newText)} defaultValue={username} />
                </View>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Password' onChangeText={newText => setPassword(newText)} defaultValue={password} />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={signupAttempt}>
                        <Text style={{fontSize: 24,}}>Signup</Text>
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
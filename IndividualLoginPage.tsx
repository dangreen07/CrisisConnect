import { useState } from "react";
import { api, theme } from "./Constants";
import { View, StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity } from "react-native";
import { CONSTANTS, JSHash } from 'react-native-hash';
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";

const hashAlgorithm = CONSTANTS.HashAlgorithms.sha256; // Used to ensure no password sent over internet. Note: Same hashing function as bitcoin uses

export default function IndividualLoginPage(ReCheckLogin) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const saveSessionID = async (sessionID: string) => {
        try {
            await AsyncStorage.setItem("sessionID", sessionID);
            ReCheckLogin();
        } catch (e) {
            // Error reading value
            console.error(e);
        }
    }

    const doRequestForLogin = (hashifiedPassword) => {
        fetch(`${api.address}/login`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: hashifiedPassword,
            })
        }).then(response => response.json()).then(json => {
            // TODO: Handle Server Response
            if(json["successful"] == true) {
                // Successful login
                console.log("Successful Login!");
                saveSessionID(json["session_id"]);
            }
            else {
                // Incorrect Login
            }
        }).catch(error => {
            console.error(error);
        });
    }

    const attemptLogin = () => {
        JSHash(password, hashAlgorithm)
        .then(hash => {
            doRequestForLogin(hash);
        })
        .catch(e => console.log(e));
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Username' onChangeText={newText => setUsername(newText)} defaultValue={username} />
                </View>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Password' onChangeText={newText => setPassword(newText)} defaultValue={password} />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={attemptLogin}>
                        <Text style={{fontSize: 18,}}>Login</Text>
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
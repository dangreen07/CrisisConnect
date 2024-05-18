import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { api, theme } from "../Constants";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Crypto from 'expo-crypto';

export default function UserPage({route, navigation}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [retypeNewPassword, setRetypeNewPassword] = useState("");

    // Assume true so error doesn't automatically show
    const [passwordsMatching, setPasswordsMatching] = useState(true);
    const isFocused = navigation.isFocused();

    const saveGroup = async (groupId: BigInteger) => {
        try {
            await AsyncStorage.setItem("groupId", groupId.toString());
        } catch (e) {
            // Error reading value
            console.error(e);
        }
    }

    const getUserData = () => {
        fetch(`${api.address}/userInfo?session_id=${global.sessionID}`, {
            method: 'GET'
        }).then(response => response.json()).then(json => {
            if(json["successful"] == true) {
                setFirstName(json["first_name"]);
                setLastName(json["last_name"]);
                setUserName(json["username"]);
                saveGroup(json["group_id"]);
            }
            else {
                // Failed to get info from session ID
                // TODO: Implement wrong session ID functionality
                console.log("Failed Session ID");
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const logout = async () => {
        await AsyncStorage.setItem("sessionID", "removed");
        navigation.replace('Login');
    }

    const changePassword = async () => {
        if(newPassword == retypeNewPassword) {
            setPasswordsMatching(true);
            const hashedOldPassword: string = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, oldPassword);
            const hashedNewPasssword: string = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, newPassword);
            fetch(`${api.address}/changePassword`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userName.toLowerCase(),
                    password: hashedOldPassword,
                    newPassword: hashedNewPasssword
                })
            }).then(response => response.json()).then(json => {
                if(json["successful"] == true) {
                    // TODO: Add popup to tell the user this
                    Alert.alert("Password Changed Successfuly");
                    setOldPassword("");
                    setNewPassword("");
                    setRetypeNewPassword("");
                }
                else if (json["reason"] == "Wrong credentials!") {
                    // TODO: Popup message that the user put in the wrong credentials
                    Alert.alert("Wrong Password!");
                }
            }).catch(error => {
                // TODO: Implement error handling
                console.log(error);
            });
        }
        else {
            setPasswordsMatching(false);
        }
    }

    useEffect(() => {
        getUserData();
    },[isFocused]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <KeyboardAwareScrollView>
                    <Text style={styles.title}>Account Settings</Text>
                    <Text style={styles.info}>First Name: {firstName}</Text>
                    <Text style={styles.info}>Last Name: {lastName}</Text>
                    <Text style={styles.info}>Username: {userName.toLowerCase()}</Text>
                    <Text style={styles.info}>Password: ********</Text>
                    <TouchableOpacity style={styles.submitButton} onPress={logout}>
                        <Text style={{fontSize: 24,}}>Logout</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Change Password</Text>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Old Password' onChangeText={newText => setOldPassword(newText)} defaultValue={oldPassword}/>
                    </View>
                    {!passwordsMatching && <Text style={styles.errorMessage}>New Passwords Do Not Match!</Text>}
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='New Password' onChangeText={newText => setNewPassword(newText)} defaultValue={newPassword}/>
                    </View>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Retype New Password' onChangeText={newText => setRetypeNewPassword(newText)} defaultValue={retypeNewPassword}/>
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={changePassword}>
                        <Text style={{fontSize: 24,}}>Change Password</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
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
    },
    info: {
        marginLeft: 10,
        fontSize: 32,
        marginTop: 10,
    },
    errorMessage: {
        color: 'red',
        fontSize: 28,
        textAlign: 'center',
        marginTop: 5,
        marginBottom: -15,
    }
});
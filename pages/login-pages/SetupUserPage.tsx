import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { api, theme } from '../../Constants';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SplashScreen from 'expo-splash-screen';
import { useIsFocused } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function SetupUser({ navigation }) {
    const [groupId, setGroupID] = useState(BigInt(-1));

    // Individual login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const isFocused = useIsFocused();

    const checkLoggedIn = async () => {
        try {
        const value = await AsyncStorage.getItem("sessionID");
        if (value !== null) {
            // Value previously stored
            if (value !== "removed") {
                setLoggedIn(true);
                global.sessionID = value;
                navigation.replace("MainSection");
            }
            else {
                setLoggedIn(false);
                SplashScreen.hideAsync();
            }
        }
        else {
            // Value never stored (definitely know not logged in)
            setLoggedIn(false);
        }
        } catch (e) {
        // Error reading value
        }
    }

    useEffect(() => {
        checkLoggedIn();
    }, [isFocused]);


    const saveSessionID = (sessionID: string) => {
        try {
            AsyncStorage.setItem("sessionID", sessionID).then(() => {
                global.sessionID = sessionID;
                navigation.replace('MainSection'); // Used replace to ensure that the user cannot go back with a swipe or back button
            });
        } catch (e) {
            // Error reading value
            console.error(e);
        }
    }

    const checkIfGroupAlreadyLoggedIn = async () => {
        try {
            const value = BigInt(await AsyncStorage.getItem("groupId"));
            if (value !== null) {
                // Value previously stored
                setGroupID(value);
            }
        } catch (e) {
            // Error reading value
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
                console.log(json);
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
        Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password).then((hash) => {
            doRequestForLogin(hash);
        });
    }

    useEffect(() => {
        // Runs on start of page
        checkIfGroupAlreadyLoggedIn();
    }, []);

    const signup = () => {
        console.log("Signup!");
        navigation.navigate("GroupSignin");
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
                <TouchableOpacity style={styles.submitButton} onPress={signup}>
                        <Text style={{fontSize: 18,}}>Signup</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
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
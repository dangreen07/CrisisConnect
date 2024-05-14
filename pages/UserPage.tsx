import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { api, theme } from "../Constants";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserPage({route, navigation}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
                saveGroup(json["group_id"]);
            }
            else {
                // Failed to get info from session ID
                // TODO: Implement wrong session ID functionality
                console.log("Failed Session ID");
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const logout = async () => {
        await AsyncStorage.setItem("sessionID", "removed");
        navigation.replace('Login');
    }

    useEffect(() => {
        getUserData();
    },[isFocused]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <Text style={styles.title}>Account Settings</Text>
                <TouchableOpacity style={styles.submitButton} onPress={logout}>
                        <Text style={{fontSize: 24,}}>Logout</Text>
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
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { api, theme } from './Constants';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IndividualLoginPage from './IndividualLoginPage';

export default function SetupUser(ReCheckLogin) {
    const [groupName, setGroupName] = useState(""); // Get input for group name
    const [groupPassword, setGroupPassword] = useState(""); // Get input for password
    const [success, setSuccess] = useState(true); // Used for incorrect name/password info
    const [groupId, setGroupID] = useState(BigInt(-1));

    const saveGroup = async (groupId: BigInteger) => {
        try {
            await AsyncStorage.setItem("groupId", groupId.toString());
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

    useEffect(() => {
        // Runs on start of page
        checkIfGroupAlreadyLoggedIn();
    }, []);

    const groupLogin = () => {
        fetch(`${api.address}/groupLogin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                groupName: groupName,
                groupPass: groupPassword
            })
        }).then(response => response.json()).then(json => {
            setSuccess(json["successful"]);
            if(success == true) {
                const groupId = json["groupID"];
                console.log("Success!");
                saveGroup(groupId);
            }
        }).catch(error => {
            console.error(error);
        })
    }

    if(groupId == BigInt(-1)) {
        // Not logged into group
        return (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                    <Text style={styles.title}>Group Setup</Text>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Group Name' onChangeText={newText => setGroupName(newText)} defaultValue={groupName} />
                    </View>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Group Password' onChangeText={newText => setGroupPassword(newText)} defaultValue={groupPassword} />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={groupLogin}>
                        <Text style={{fontSize: 18,}}>Submit</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </View>
        );
    }
    else {
        return (
            <IndividualLoginPage ReCheckLogin={ReCheckLogin} />
        )
    }
    
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
import { SafeAreaView, View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { api, theme } from "../../Constants";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GroupSignin() {
    const [groupName, setGroupName] = useState("");
    const [groupPassword, setGroupPassword] = useState("");

    const saveGroup = async (groupId: BigInteger) => {
        try {
            await AsyncStorage.setItem("groupId", groupId.toString());
        } catch (e) {
            // Error reading value
            console.error(e);
        }
    }

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
            if(json["successful"] == true) {
                const groupId = json["groupID"];
                console.log("Success!");
                saveGroup(groupId);
            }
        }).catch(error => {
            console.error(error);
        })
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <Text style={styles.title}>Login To Group</Text>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Group Name' onChangeText={newText => setGroupName(newText)} defaultValue={groupName} />
                </View>
                <View style={styles.inputRow}>
                    <TextInput style={styles.inputBox} placeholder='Group Password' onChangeText={newText => setGroupPassword(newText)} defaultValue={groupPassword} />
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={groupLogin}>
                        <Text style={{fontSize: 24,}}>Login</Text>
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
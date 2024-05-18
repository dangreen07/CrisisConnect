import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { api, theme } from "../../Constants";
import { Icon } from "react-native-paper";
import { SelectList } from "react-native-dropdown-select-list";

export default function AddMarker({route, navigation}) {
    const {latitude, longitude} = route.params;

    const [markerTitle, setMarkerTitle] = useState("");
    const [markerDescription, setMarkerDescription] = useState("");
    const [selected, setSelected] = useState("");

    const markerIcon = {
        "Hospital": {icon: "hospital", color: "red"},
        "Base of Operations": {icon: "home-circle", color: "black"},
        "People Who Need Priority": {icon: "alert-circle", color: "red"},
    }

    const data = [
        {key:'1', value:'Hospital'},
        {key:'2', value:'Base of Operations'},
        {key:'3', value:'People Who Need Priority'},
    ]

    const backButton = () => {
        navigation.goBack();
    }

    const requestAddMarker = () => {
        if(selected != "" && markerTitle != "" && markerDescription != "")
        {
            fetch(`${api.address}/addMarker`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionID: global.sessionID,
                    latitude: latitude,
                    longitude: longitude,
                    title: markerTitle,
                    description: markerDescription,
                    iconSource: markerIcon[selected].icon,
                    iconColor: markerIcon[selected].color
                })
            }).then(response => response.json()).then(json => {
                if(json["successful"] == true) {
                    backButton();
                }
                else if (json["reason"] == "sessionID invalid!") [
                    // TODO: Logout user and send back to login page
                ]
            }).catch(error => {
                // TODO: Implement error handling
                console.log(error);
            });
        }
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>Add New Marker</Text>
                    <TouchableOpacity style={{position: 'absolute', top: 0, left: 10}} onPress={backButton}>
                            <Icon source="arrow-left" size={40} />
                    </TouchableOpacity>
                    <View style={styles.inputRow}>
                        <TextInput style={styles.inputBox} placeholder='Marker Name' onChangeText={newText => setMarkerTitle(newText)} defaultValue={markerTitle} maxLength={45}/>
                    </View>
                    <View style={styles.descriptionBox}>
                        <TextInput style={styles.descriptionInputBox} placeholder='Marker Description' onChangeText={newText => setMarkerDescription(newText)} defaultValue={markerDescription} multiline={true} maxLength={250}/>
                    </View>
                    <View style={{marginHorizontal: 10, marginTop: 15}}>
                        <SelectList 
                            setSelected={(val) => setSelected(val)} 
                            data={data} 
                            save="value"
                            placeholder="Marker Icon"
                        />
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={requestAddMarker}>
                        <Text style={{fontSize: 24,}}>Add Marker</Text>
                    </TouchableOpacity>
                </View>
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
    descriptionBox: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginTop: 20,
    },
    descriptionInputBox: {
        height: 100,
        fontSize: 24,
        flex: 1,
        borderWidth: 1,
        borderRadius: 5,
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
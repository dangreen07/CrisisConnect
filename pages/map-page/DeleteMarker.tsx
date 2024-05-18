import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { api, theme } from "../../Constants";
import { Icon } from "react-native-paper";
import { useEffect, useState } from "react";

export default function DeleteMarker({navigation}) {
    const [markers, setMarkers] = useState([]);

    const backButton = () => {
        navigation.goBack();
    }

    const getMarkers = () => {
        fetch(`${api.address}/getMarkers?session_id=${global.sessionID}`, {
            method: 'GET'
        }).then(response => response.json()).then(json => {
            if(json["successful"] == true) {
                setMarkers(json["results"]);
            }
            else if (json["reason"] == "sessionID invalid!") {
                // TODO: Logout user and send back to login page
            }
        }).catch(error => {
            // TODO: Implement error handling
            console.log(error);
        });
    }

    function sendDeleteMarker (locationid: any) {
        fetch(`${api.address}/deleteMarker`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionID: global.sessionID,
                locationid: locationid,
            })
        }).then(response => response.json()).then(json => {
            console.log(json);
            getMarkers();
        }).catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        getMarkers();
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <View style={{flex: 1}}>
                    <Text style={styles.title}>Delete Marker</Text>
                    <TouchableOpacity style={{position: 'absolute', top: 0, left: 10}} onPress={backButton}>
                            <Icon source="arrow-left" size={40} />
                    </TouchableOpacity>
                    <ScrollView>
                        {markers.map((marker, index) => (
                            <View key={index} style={{paddingVertical: 20, marginHorizontal: 10, borderWidth: 2, borderColor: "black", borderRadius: 15, marginTop: 15}}>
                                <Text key={index} style={{fontSize: 24, marginLeft: 5}}>{marker["title"]}</Text>
                                <TouchableOpacity style={styles.deleteMarker} onPress={() => sendDeleteMarker(marker["locationid"])}>
                                        <Icon source="delete" size={40} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
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
    deleteMarker: {
        position: 'absolute',
        right: 10,
        top: 7,
        backgroundColor: theme.deleteColor,
        borderRadius: 30,
        padding: 5
    }
});
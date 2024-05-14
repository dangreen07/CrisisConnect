import { useEffect, useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import MapView, { Details, Region } from "react-native-maps";
import { api, theme } from "../Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';

const saveIcon = require('../assets/save-icon.png');

SplashScreen.preventAutoHideAsync();

export default function Map({navigation}) {
    // This is San Francisco as default area.
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const isFocused = useIsFocused();
    const mapRef = useRef(null);

    const regionChanged = (region: Region, details: Details) => {
        setRegion(region);
    }

    const saveRegionToStorage = async (region: Region) => {
        try {
            AsyncStorage.setItem("GroupRegion", JSON.stringify(region));
        }
        catch (error) {
            console.log(error);
        }
    }

    const getRegion = () => {
        fetch(`${api.address}/getRegion`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionID: global.sessionID
            })
        }).then(response => response.json()).then(json => {
            if(json["successful"] == true) {
                const regionToSet: Region = {
                    latitude: json["latitude"],
                    longitude: json["longitude"],
                    latitudeDelta: json["latitudeDelta"],
                    longitudeDelta: json["longitudeDelta"]
                };
                setRegion(regionToSet);
                mapRef.current.animateToRegion(regionToSet,10);
                saveRegionToStorage(regionToSet);
            }
        }).catch (error => {
            // Handle error
            console.log(error);
        });
    }

    const getInitialInfo = async () => {
        // Getting saved location in case no signal and to avoid loading times to talk to the server
        try {
            const value = await AsyncStorage.getItem("GroupRegion");
            if(value !== null) {
                setRegion(JSON.parse(value));
            }
        }
        catch (e) {
            // Handle error
        }
        // Need to wait till group id and region id are read from storage
        getRegion();
    }

    const setNewMap = () => {
        fetch(`${api.address}/setRegion`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionID: global.sessionID,
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta
            })
        }).then(response => response.json()).then(json => {
            console.log(json);
        }).catch(error => {
            console.log(error);
        })
    }

    const confirmNewMap = {
        text: 'Confirm',
        onPress: () => {
            setNewMap();
        }
    }

    const cancelNewMap = {
        text: 'Cancel',
        onPress: () => console.log("Map Save Cancelled!"),
        style: 'cancel',
    }

    const setMap = () => {
        Alert.alert("Set New Map", "Are you sure you want to save this as the new map for the whole group?", [
            cancelNewMap,
            confirmNewMap,
        ]);
    }

    useEffect(() => {
        getInitialInfo();
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <MapView style={styles.map} region={region} onRegionChange={regionChanged} mapType="hybrid" ref={mapRef}/>
            </SafeAreaView>
            <TouchableOpacity style={styles.saveMap} onPress={setMap}>
                    <Image style={styles.saveImage} source={saveIcon} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    saveMap: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: theme.newTaskColor,
        borderRadius: 50,
        padding: 10,
    },
    saveImage: {
        width: 80,
        height: 80,
        resizeMode: 'contain'
    }
});
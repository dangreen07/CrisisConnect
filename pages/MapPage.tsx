import { SafeAreaView, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function Map({navigation}) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={{flex: 1, width: '100%', margin: 'auto'}}>
                <MapView style={styles.map} region={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }} />
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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
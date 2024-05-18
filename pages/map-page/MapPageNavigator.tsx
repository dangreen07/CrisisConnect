import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./MapPage";
import AddMarker from "./AddMarker";
import DeleteMarker from "./DeleteMarker";

const Stack = createNativeStackNavigator();

export default function MapNavigator({navigation}) {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="AddMarker" component={AddMarker} />
            <Stack.Screen name="DeleteMarker" component={DeleteMarker} />
        </Stack.Navigator>
    )
}
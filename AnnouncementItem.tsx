import { View, Text, StyleSheet } from 'react-native';
import { theme } from './Constants';

const defaultTitle: string = "Title Not Set!";
const defaultContents: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id libero bibendum, cursus diam eu, finibus magna. Donec volutpat tempus urna, vel ullamcorper est mollis nec. Integer id purus mollis, sollicitudin neque eu, tristique lacus. Nullam dignissim odio sem, nec hendrerit leo pellentesque ac. Curabitur ultrices sagittis tristique. Integer condimentum.";

export default function Announcement({title = defaultTitle, contents = defaultContents}: {title?: string, contents?: string}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.contents}>{contents}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        backgroundColor: theme.foregroundColor,
        borderRadius: 15,
    },
    title: {
        fontSize: 24,
        marginHorizontal: 10,
        marginVertical:5,
    },
    contents: {
        fontSize:16,
        marginHorizontal: 10,
        marginBottom: 8,
    }
});

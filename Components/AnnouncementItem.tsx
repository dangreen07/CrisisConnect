import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../Constants';

const defaultTitle: string = "Title Not Set!";
const defaultContents: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nunc ligula, volutpat vel elit vitae, suscipit pharetra enim. Suspendisse tincidunt ultrices mauris, vel mollis lectus tristique sed. Mauris urna leo, facilisis eu cursus et, varius sit amet neque. Nulla ultrices arcu vel suscipit fermentum. Curabitur in tortor ac leo orci aliquam.";

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

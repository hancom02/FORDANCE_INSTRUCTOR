import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


const MyAppBar = (props) => {
    const {handleGoBack, headerTitle} = props;

    return (
        <><View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <Icon name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View><View style={styles.separator} /></>
    )
}
export default MyAppBar;

const styles = StyleSheet.create({
    backButton: {
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginVertical: 16,
      },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    separator: {
        height: 1,
        backgroundColor: 'lightgray',
        marginBottom: 0,
        elevation: 1,
      },
});
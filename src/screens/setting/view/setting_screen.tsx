import { Colors } from "react-native/Libraries/NewAppScreen";
import TextButton from "../../../components/button/text_button";
import MyColor from "../../../constants/color";
import { useAuth } from "../../../store/auth_slice";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MyAppBar from "../../../components/app_bar/app_bar";
import { useNavigation } from "@react-navigation/core";
import Icon from 'react-native-vector-icons/FontAwesome';
import SizedBox from "../../../components/size_box/size_box";

const SettingScreen = () => {
    const {uuid, logout} = useAuth();
    const navigation = useNavigation();
    const handleLogOut = async () => {
        await logout().then(() => {
            navigation.navigate('LoginScreen');
        });
    };
    const handleNavProfile = async () => {   
            navigation.navigate('ProfileScreen');
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Setting</Text>
            </View>
            <View style={styles.separator}/>

            <View style={styles.contentContainer}>
                <View style={styles.logOutContainer}>
                    <Icon name="user" size={24} color={MyColor.black} />
                    <SizedBox width={16}/>
                    <TextButton title={"Profile"} onPress={handleNavProfile} textStyle={styles.buttonLogount}/>
                </View>
                <SizedBox/>
                <View style={styles.logOutContainer}>
                    <Icon name="sign-out" size={24} color={MyColor.black} />
                    <SizedBox width={16}/>
                    <TextButton title={"Log out"} onPress={handleLogOut} textStyle={styles.buttonLogount}/>

                </View>
            </View>

        </SafeAreaView>
    );
};

export default SettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColor.white,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
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
    logOutContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    buttonLogount: {
        color: MyColor.black,
        fontSize: 16,
        fontWeight: 'medium',
    }
});
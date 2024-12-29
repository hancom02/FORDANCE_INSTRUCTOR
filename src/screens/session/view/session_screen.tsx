import { ScrollView, StyleSheet, Text, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import { SafeAreaView } from "react-native-safe-area-context";
import PropTypes from 'prop-types';

interface SessionScreenProps {
    session: ISession;   
  }

const Sessionscreen = ({session} : SessionScreenProps) => {
    return (
        <SafeAreaView>
            <MyAppBar title="SESSION DETAIL" />
            <ScrollView>
                <Text>{session.id}</Text>
                <Text>Session Screen</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Sessionscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
import { ScrollView, StyleSheet, Text, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import { SafeAreaView } from "react-native-safe-area-context";
import PropTypes from 'prop-types';

interface SessionScreenProps {
    session: Session;   // Prop session có kiểu là Session
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

Sessionscreen.propTypes = {
    // session: PropTypes.shape({
    //   title: PropTypes.string.isRequired,   // Giả sử title là string và là bắt buộc
    //   date: PropTypes.string.isRequired,    // Giả sử date là string và là bắt buộc
    //   description: PropTypes.string,        // description là optional
    //   id: PropTypes.number,                 // Giả sử id là number
    // }).isRequired,
    session: Session
  };

export default Sessionscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
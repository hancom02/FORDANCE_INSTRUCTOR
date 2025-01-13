import { RouteProp, useRoute } from "@react-navigation/core";
import StudentTable from "../../session/view/student_table";
import { SafeAreaView, StyleSheet, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";

const StudentListSession = () => {
    const route = useRoute<RouteProp<{ params: { joinedDataList : IJoin[] } }, 'params'>>();
    const { joinedDataList } = route.params;

    console.log('joinedDataList: ', joinedDataList);

    return (
        <SafeAreaView style={styles.container}>
            <MyAppBar headerTitle='Student List'/>
            <View style={styles.contentContainer}>
                <StudentTable studentList={joinedDataList} isShort={false} />

            </View>

        </SafeAreaView>
    );
}

export default StudentListSession;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center'
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 16
    }
})
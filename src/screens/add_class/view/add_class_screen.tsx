import { StyleSheet, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import MyColor from "../../../constants/color";
import EditableText from "../../../components/text_field/editable_text";
import { useState } from "react";


const AddClassScreen = () => {
    const [className, setClassName] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [whatLearn, setWhatLearn] = useState('');
    const [whatPrepare, setWhatPrepare] = useState(''); 
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    return (
        <View style={styles.container}>
            <MyAppBar title="Add Class" />
            <View style={styles.contentContainer}>
                <EditableText title="Class Name" onTextChange={undefined} />
            </View>
        </View>
    );
}

export default AddClassScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColor.white,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    }
});
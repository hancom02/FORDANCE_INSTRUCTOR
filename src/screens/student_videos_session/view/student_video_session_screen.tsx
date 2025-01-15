import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { Alert, FlatList, KeyboardAvoidingView, SafeAreaView, StyleSheet, View } from "react-native";
import { useRef, useState } from "react";
import MyAppBar from "../../../components/app_bar/app_bar";
import Video from "react-native-video";
import { Text } from "react-native-paper";
import MyColor from "../../../constants/color";
import EditableText from "../../../components/text_field/editable_text";
import { useStudentVideo } from "../store/student_videos_slice";
import BottomButton from "../../../components/button/bottom_button";

const StudentVideosScreen = () => {
    const route = useRoute<RouteProp<{ params: { joinedDataList : IJoin[] } }, 'params'>>();
    const { joinedDataList } = route.params;

    const navigation = useNavigation();

    const playerRef = useRef(null);

    const {insertFeedback} = useStudentVideo();

    
    // Tạo state để lưu trữ rating của từng video dưới dạng chuỗi
    const [teacherFeedbacks, setTeacherFeedbacks] = useState<{ [key: string]: string }>(
        joinedDataList.reduce((acc, item) => {
            acc[item.user_id] = item.teacher_feedback; // Lưu rating mặc định ban đầu (dưới dạng chuỗi)
            return acc;
        }, {} as { [key: string]: string })
    );

    // Cập nhật rating khi người dùng thay đổi
    const handleChangeRating = (user_id: string, teacher_feedback: string) => {
        setTeacherFeedbacks(prevRatings => ({
            ...prevRatings,
            [user_id]: teacher_feedback
        }));
    }

    // Gửi dữ liệu feedback lên server
    const handleSubmitFeedback = async () => {
        const updatedFeedbackList = joinedDataList.map(item => ({
            ...item,
            // Kiểm tra nếu có teacher_feedback mới trong teacherFeedbacks, nếu không giữ nguyên giá trị cũ
            teacher_feedback: teacherFeedbacks[item.user_id] || item.teacher_feedback, 
        }));
        console.log('After update feedback: ', updatedFeedbackList);
    
        try {
            await insertFeedback('instructor_id_example', updatedFeedbackList);
            Alert.alert('Successfully', 'Feedback submitted successfully!');

            navigation.goBack();
        } catch (error) {
            Alert.alert('Failed', 'Failed to submit feedback');
        }
    };

    return (
        <View style={styles.container}>
            <MyAppBar headerTitle='Student Videos Result'/>
            <KeyboardAvoidingView style={styles.contentContainer}>
                <FlatList 
                    data={joinedDataList}
                    renderItem={({ item, index }) => (
                        <View style={styles.student_video}>
                          <Video 
                            source={{ uri: item.result_video_url }}
                            ref={playerRef}
                            controls={true}             
                            style={{ height: 160, marginBottom: 8 }}
                          />
                          <EditableText 
                            title='Your rating' 
                            placeHolder="Enter rating and score here"
                            content={item.teacher_feedback}
                            onTextChange={(text : string) => handleChangeRating(item.user_id, text)} 
                            />
                        </View>
                      )}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                />
            </KeyboardAvoidingView>
            <BottomButton title={'Save Feedback'} onPress={handleSubmitFeedback} />
            {/* <View style={styles.submitButtonContainer}>
                    <Button title="Submit Feedback" onPress={handleSubmitFeedback} />
                </View> */}
        </View>
    );
}

export default StudentVideosScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        paddingHorizontal: 16, 
        paddingTop: 16,
        paddingBottom: 40
    },
    student_video: {
        marginBottom: 16
    },
    teacher_comment: {
        fontSize: 16,
        fontWeight: '700',
        color: MyColor.black,
        marginTop: 8,
    },
    teacher_score: {
        fontSize: 16,
        fontWeight: '400',
        // color: MyColor.primary,
        marginTop: 4,
    },
})
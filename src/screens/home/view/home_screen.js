import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeHeader from "../component/home_header";
import LessonCard from "../../../components/lession/lession_card";
import LessonMoreCard from "../../../components/lession/lession_more_card";
import ClassWiderCard from "../../../components/class/class_wider_card";
import { useInstructorData } from "../store/home_slice";
import { useAuth } from "../../../store/auth_slice";
import { useNavigation } from '@react-navigation/native';
import MyColor from "../../../constants/color";

const MyLessons = "My Lessons";
const MyPrograms = "My Programs"

const HomeScreen = () => {

    const [classes, setClasses] = useState(null);
    const [sessions, setSessions] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const {uuid} = useAuth();
    // console.log("UUID: ", uuid);

    const {getClassByInstructor, getSessionByInstructor, error} = useInstructorData();
    console.log('getSessionByInstructor ', getSessionByInstructor);

    const fetchDataOutsideEffect = async () => {
        try {
            const classData = await getClassByInstructor(uuid);
            setClasses(classData);

            const sessionData = await getSessionByInstructor(uuid);
            setSessions(sessionData);
        } catch (err) {
            console.error("Error fetching data outside useEffect: ", err);
        }
    }; 

    useEffect(() => {
        console.log('useEffect triggered');
        setLoading(true);

        fetchDataOutsideEffect();
        setLoading(false);
    }, []);

    console.log("MY SESSIONS: ", sessions);
    console.log("MY CLASSES: ", classes);

    const [content, setContent] = useState("My Lessons");

    const [expandedItem, setExpandedItem] = useState(null);
    const onPressOpenMoreAction = (id) => {
        setExpandedItem(id);
    };
    const onPressCloseMoreAction = () => {
        setExpandedItem(null);
    };

    const [isShowMoreAction, setisShowMoreAction] = useState(false);

    const handleNavNotification = () =>
    {
        navigation.navigate('Notifications')
    }

    const handleNavSearch = () => {
        navigation.navigate('Search')
    }
    const handleNavDetailSession = (session) => {
        navigation.navigate('SessionScreen', { session });
    }

    const handleNavDetailInstructorProgram = (
        programData
    ) => {
        // console.log("PROGRAM DATA AFTER PROPS FROM LIBRARY MAIN VIEW: ", programData);
        navigation.navigate('ClassScreen', {
            // tabBarVisible: false,
            // program: programData
        });
    }

    const handleNavPostLesson = () => {
        navigation.navigate('AddSessionScreen');
    }

    const handleNavPostProgram = () => {
        navigation.navigate('AddClassScreen');
    }

    return (
        <SafeAreaView style={styles.container}>
            <HomeHeader 
                onPressButton={setContent} 
                onPressPostClass={handleNavPostLesson} 
                onPressPostProgram={handleNavPostProgram} 
                onPressNotification={handleNavNotification}
                onPressSearch={handleNavSearch}
            />
            <View style={styles.contentContainer}>
                {content === "My Lessons" &&
                    <View style={styles.manageContainer}>
                        <Text style={styles.text}>{MyLessons}</Text>
                        {/* <TouchableOpacity onPress={fetchDataOutsideEffect}>
                            <Text>Fetch data</Text>
                        </TouchableOpacity> */}
                        <View style={styles.classesContainer}>
                        {loading && (
                            <ActivityIndicator size="large" color={MyColor.blue} />
                        )}
                            <FlatList
                                data={sessions}
                                renderItem={({ item, index }) =>
                                    <View style={{ marginBottom: 16, width: '100%', }}>
                                        <View>
                                            <LessonCard
                                                session={item}
                                                handleNav={() => handleNavDetailSession(item)}
                                                onPressOpenMoreAction={() => onPressOpenMoreAction(item.id)}
                                                onPressCloseMoreAction={onPressCloseMoreAction}
                                            />
                                        </View>
                                        {expandedItem === item.id && (
                                            <View style={styles.lessonMoreContainer}>
                                                <LessonMoreCard onClose={onPressCloseMoreAction} />
                                            </View>
                                        )}
                                    </View>
                                }
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                }
                {content === "My Programs" &&
                    <View style={styles.manageContainer}>
                        <Text style={styles.text}>{MyPrograms}</Text>
                        <View style={styles.programsContainer}>
                            <FlatList
                                data={classes}
                                renderItem={({ item, index }) =>
                                    <View key={index} style={{ marginBottom: 24, width: '100%' }}>
                                        <ClassWiderCard
                                            classData={item}
                                            handleNav={() => handleNavDetailInstructorProgram(
                                                // classData = item
                                            )}
                                        />
                                    </View>
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                }
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        backgroundColor: 'white'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    manageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: 16,
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        alignSelf: 'flex-start',
    },
    classesContainer: {
        flex: 1,
        marginTop: 56,
        paddingHorizontal: 16,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    programsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructorContainer: {
        flex: 1,
        // flexDirection: 'column',
        paddingHorizontal: 16,
        marginTop: 70,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lessonMoreContainer: {
        position: 'absolute',
        height: '200%',
        width: '50%',
        top: 0,
        left: '50%',
        right: 0,
        bottom: 0,
    }
});

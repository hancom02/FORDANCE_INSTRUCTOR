import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View, StyleSheet, Dimensions, SafeAreaView
} from 'react-native';

// ICON
import Icon from 'react-native-vector-icons/FontAwesome';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { useAuth } from '../../../store/auth_slice';
import { useClass } from '../store/class_slice';
import ProgramDetailHeader from '../component/class_header';
import LessonCard from '../../../components/lession/lession_card';
import MyColor from '../../../constants/color';
import LessonMoreCard from '../../../components/lession/lession_more_card';

const aboutInstructor = 'About Instructor';
const experience = 'Experience';
const aboutProgram = 'About This Program';
const whatLearnText = 'What you will learn';
const whatNeedText = 'What you will need';

const ClassScreen = () => {
    const route = useRoute<RouteProp<{ params: { class_id: string } }, 'params'>>();
    const { class_id } = route.params;
    const navigation = useNavigation();

//   const {data} = useQuery({
//     queryKey: ['detail-program', programId],
//     queryFn: getDetailProgram,
//   });

  const {uuid} = useAuth();
  const {getClass, getSessionOfClass} = useClass();

  const [classData, setClassData] = useState<IClass>();
  const [sessions, setSessions] = useState<ISession[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [introduce, setIntroduce] = useState('');
  const [whatLearn, setWhatLearn] = useState('');
  const [whatPrepare, setWhatPrepare] = useState('');

  const [content, setContent] = useState('Overview'); 
  const [expandedItem, setExpandedItem] = useState(null);

  const fetchClass = async () => {
    await getClass(class_id).then((data) => {
        setClassData(data);
        setWhatLearn(data.what_learn);
        setWhatPrepare(data.what_prepare);
    }).catch((err) => {
        console.log('Error:', err);
    });
  };
  const fetchSessionClass = async () => {
    await getSessionOfClass(class_id, uuid).then((data) => {
        setSessions(data);
    }).catch((err) => {
        console.log('Error:', err);
    });
  };

  useEffect(() => {
    fetchClass();
    fetchSessionClass();
  }, []);

  console.log('classData:', classData);
  console.log('sessions:', sessions);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    //Goi ham update tai day
  };
  const handleCancel = () => setIsEditing(false);

  const onPressOpenMoreAction = (id) => {
    setExpandedItem(id);
};
const onPressCloseMoreAction = () => {
    setExpandedItem(null);
};

  const handleNavDetailLesson = (session) => {
    // navigation.navigate('SessionScreen', {isOwner: true, lesson}); //Truyền vào lesson với isOwner = true
    navigation.navigate('SessionScreen', {session});
  };
  const handleDelete = () => {
    //Goi ham delete lesson o day
  };
  const handleAddNewSession = (classData: IClass) => {
    navigation.navigate('AddSessionClassScreen', {classData});
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      {/* ẢNH DEMO */}
      <View style={styles.videoContainer}>
        <ImageBackground
          style={styles.video}
          source={{uri: classData?.image_cover_url}}></ImageBackground>
      </View>

      <ProgramDetailHeader onButtonPress={setContent} />

      <View style={styles.contentContainer}>
        {content === 'Overview' && (
          <SafeAreaView>
            <ScrollView
              style={styles.overviewContainer}
              showsVerticalScrollIndicator={false}>
              {/* EDIT */}
              {!isEditing && (
                <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
                  <Text style={styles.editBtnText}>EDIT</Text>
                </TouchableOpacity>
              )}

              {isEditing && (
                <View style={styles.profileFooter}>
                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>SAVE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}>
                    <Text style={styles.cancelBtnText}>CANCEL</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ABOUT INSTRUCTOR */}
              <View style={styles.instructorContainer}>
                <Text style={styles.titileOverviewText}>{aboutInstructor}</Text>
                <View>
                  <Text style={styles.textInstructor}>
                    {classData?.class_name}
                  </Text>
                  {classData?.image_cover_url ? (
                    <Image
                      source={{uri: classData?.image_cover_url}}
                      style={styles.imageInstructor}
                    />
                  ) : null}
                </View>
                {/* {data?.instructor.prizes ? (
                  <View style={{marginTop: 16}}>
                    <Text
                      style={{fontWeight: '500', color: 'black', fontSize: 16}}>
                      {experience}
                    </Text>
                    <View>
                      <Text
                        numberOfLines={4}
                        ellipsizeMode="tail"
                        style={styles.textNomal}>
                        - Redbull Confest 2021
                                            {'\n'}- 2th winner Supper Dance Champion 2019 
                                            {'\n'}- ...
                        {data?.instructor.prizes}
                      </Text>
                    </View>
                  </View>
                ) : null} */}
              </View>

              {/* ABOUT THIS PROGRAM */}
              {/* <View style={styles.aboutProgramContainer}>
                <Text style={styles.titileOverviewText}>{aboutProgram}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={introduce}
                    onChangeText={setIntroduce}
                  />
                ) : (
                  <Text
                    style={styles.textNomal}
                    numberOfLines={5}
                    ellipsizeMode="clip">
                    {data?.introduce}
                  </Text>
                )}
              </View> */}

              {/* WHAT YOU WILL LEARN */}
              <View style={styles.whatLearnContainer}>
                <Text style={styles.titileOverviewText}>{whatLearnText}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={whatLearn}
                    onChangeText={setWhatLearn}
                    // color="black"
                  />
                ) : (
                  <Text
                    style={styles.textNomal}
                    numberOfLines={5}
                    ellipsizeMode="clip">
                    {classData?.what_learn}
                  </Text>
                )}
              </View>

              {/* WHAT YOU WILL NEED */}
              <View style={styles.whatNeedContainer}>
                <Text style={styles.titileOverviewText}>{whatNeedText}</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={whatPrepare}
                    onChangeText={setWhatPrepare}
                  />
                ) : (
                  <Text
                    style={styles.textNomal}
                    numberOfLines={5}
                    ellipsizeMode="clip">
                    {classData?.what_prepare}
                  </Text>
                )}
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
        {content === 'Lessons' && (
          <View style={styles.lessonContainer}>
            {sessions.length === 0 ? 
            <Text>This class has no sesion, plese add new session</Text> :
                <FlatList
                data={sessions}
                renderItem={({item, index}) => (
                <View style={{marginBottom: 16, flex: 1}}>
                    <View>
                        <LessonCard 
                            session={item} 
                            handleNav={() => handleNavDetailLesson(item)} 
                            onPressOpenMoreAction={() => onPressOpenMoreAction(item.id)}
                            onPressCloseMoreAction={onPressCloseMoreAction}       />
                    </View>
                    {expandedItem === item.id && (
                        <View style={styles.lessonMoreContainer}>
                            <LessonMoreCard 
                                onClose={onPressCloseMoreAction} 
                                session={item} 
                            />
                        </View>
                )}
                </View>
                )}
                />
            }
            <TouchableOpacity onPress={() => classData && handleAddNewSession(classData)} style={styles.buttonAdd}>
                <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ClassScreen;


const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 120
    // marginBottom: 180,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 999,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderRadius: 50,
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    // paddingHorizontal: 16,
    // paddingTop: 24,
    paddingBottom: 120,
    marginBottom: 180,
    backgroundColor: MyColor.white
  },
  videoContainer: {
    paddingHorizontal: 0,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: 'blue',
  },
  overviewContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 24,
    paddingHorizontal: 16,

    backgroundColor: 'white',
  },
  lessonContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 24,
    paddingHorizontal: 16,

    backgroundColor: MyColor.white,

    // paddingHorizontal: 16,
  },
  instructorContainer: {
    width: '100%',
    paddingBottom: 32,
    // height: 'auto'
  },
  instructorContent: {
    marginTop: 16,
  },
  textInstructor: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 5,
    width: '100%',
  },
  textNomal: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
  },
  imageInstructor: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  aboutProgramContainer: {
    paddingBottom: 32,
  },
  whatLearnContainer: {
    paddingBottom: 32,
  },
  whatNeedContainer: {
    paddingBottom: 32,
  },
  editBtn: {
    // marginTop: 8,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 80,
    marginBottom: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#bbb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 70,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  titileOverviewText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    marginBottom: 8,
  },
  lessonMoreContainer: {
    position: 'absolute',
    height: '200%',
    width: '50%',
    top: 0,
    left: '50%',
    right: 0,
    bottom: 0,
    },
    buttonAdd: {
        position: 'absolute',
        bottom: 60,
        right: 16,
        backgroundColor: MyColor.primary, // Màu tím
        width: 60,
        height: 60,
        borderRadius: 30, // Để tạo hình tròn
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    }
});

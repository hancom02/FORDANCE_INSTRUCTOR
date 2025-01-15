import { Alert, FlatList, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from 'react-native-element-dropdown';
import { useAuth } from "../../../store/auth_slice";
import React, { useEffect, useRef, useState } from "react";
import EditableText from "../../../components/text_field/editable_text";
import { useSession } from "../store/session_slice";
import MyColor from "../../../constants/color";
import SizedBox from "../../../components/size_box/size_box";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/core";
import Video, { VideoRef } from 'react-native-video';
import TextButton from "../../../components/button/text_button";
import StudentTable from "./student_table";
import CommentCard from "../../../components/comment/comment_card";
import BottomButton from "../../../components/button/bottom_button";
import { ActivityIndicator } from "react-native-paper";
import { EStatus } from "../../../types/status_enum";
import VideoPickerOld from "../../../components/picker/video_picker_old";
import UploadVideoToSupabase from "../../../utils/update_video_util";
import UploadImageToSupabase from "../../../utils/update_image_util";
import ImagePicker from "../../../components/picker/image_picker";

const Sessionscreen = () => {
    const route = useRoute<RouteProp<{ params: { session: ISession } }, 'params'>>();
    const { session } = route.params;

    console.log('session: ', session);

    const playerRef = useRef<VideoRef>(null);
    const navigation = useNavigation();

    const {uuid} = useAuth();
    const {
      getClass, 
      getSession,
      getEnumLevelValues, 
      getEnumGenreValues, 
      fetchClass, 
      fetchJoinedData,
      fetchComments,
      updateSession
    } = useSession();
    
    const [classData, setClassData] = useState<IClass>();
    // const [sessionDta, setSessionDta] = useState<ISession>();
    const [joinedDataList, setJoinedDataList] = useState<IJoin[]>([]);
    const [commentDataList, setCommentDataList] = useState<IComment[]>([]);
    const [enumLevelList, setEnumLevelList] = useState<string[]>([]);
    const [enumGenreList, setEnumGenreList] = useState<string[]>([]);

    const [isFocusClass, setIsFocusClass] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(session.level);
    const [isFocusLevel, setIsFocusLevel] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(session.genre);
    const [isFocusGenre, setIsFocusGenre] = useState(false);

    const [sessionName, setSessionName] = useState('');
    const [selectedVideo, setSelectedVideo] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [reloading, setReloading] = useState(false);
    const isCanEdit = session.status === EStatus.Waiting ? true : false;

    const fetchClassData = async () => {
        await fetchClass(session.class_id).then((data) => {
            setClassData(data);
        }).catch((error) => {
          console.error(error);
          });
    };
    const fetchEnumLevelValues = async () => {
        await getEnumLevelValues().then((data) => {
        setEnumLevelList(data);
        }).catch((error) => {
        console.error(error);
        });
    };
    const fetchEnumGenreValues = async () => {
        await getEnumGenreValues('genre').then((data) => {
        setEnumGenreList(data);
        }).catch((error) => {
        console.error(error);
        });
    };
    const fetchJoinedStudents = async () => {
      await fetchJoinedData(session.id).then((data) => {
        setJoinedDataList(data);
        
      }).catch((error) => {
        console.error(error);
        });
    };
    const fetchCommentsData = async () => {
      await fetchComments(session.id, uuid).then((data) => {
        setCommentDataList(data);
      }).catch((error) => {
        console.error(error);
        });
    };

    useEffect(() => {
        fetchClassData();
        fetchJoinedStudents();
        fetchEnumLevelValues();
        fetchEnumGenreValues();
        fetchCommentsData();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
          fetchJoinedStudents();
          fetchCommentsData();
      }, [])
  );

    // console.log('classData: ', classData);
    // console.log('Session dta: ', sessionDta);
    console.log('name: ', sessionName);
    // console.log('session dta name: ', sessionDta?.session_name);

    // console.log('student: ', joinedDataList);

    const handleGoBack = () => {
        navigation.goBack();
    }
    const handleTextChange = (text) => {
      setSessionName(text);
    };
    const handleChoseVideo = (uri) => {
      setSelectedVideo(uri);
    }
    const handleChooseThumnail = (uri) => {
      setSelectedImage(uri);
    }
    const handleNavStudentVideos = () => {
      navigation.navigate('StudentVideosScreen', {joinedDataList});
    }
    const handleNavStudentList = () => {
      navigation.navigate('StudentListSession', {joinedDataList});
    }
    const handleNavigateCommunityDetail = () => {
      navigation.navigate('CommunityScreen', {session_id: session.id});
    };
    const handleSaveChangeSession = async () => {
      console.log('Press save change session');

      setLoading(true);

      let videoUrl = session.video_url;
      if (selectedVideo && selectedVideo !== session.video_url) {
        videoUrl = await UploadVideoToSupabase(selectedVideo, uuid);
      }
      let thumbnailUrl = session.thumbnail_url;
      if (selectedImage && selectedImage !== session.thumbnail_url) {
        thumbnailUrl = await UploadImageToSupabase(selectedImage, uuid);
      };

      await updateSession(session.id, sessionName, selectedLevel, selectedGenre, videoUrl, thumbnailUrl).then((data) => {
        Alert.alert('Save change successfully!');

        navigation.setParams({ reloading: true });
        navigation.goBack();
      }).catch((err) => {
        throw new Error(err.message);
      });

      setLoading(false);
    };
    const isFormValid = () => {
      if (!sessionName) {
        return false;
      }
      if (!selectedVideo) {
        return false;
      }
      if (!selectedImage) {
        return false;
      }
      if (!selectedLevel) {
        return false;
      }
      if (!selectedGenre) {
        return false;
      }
    }

    return (
        <View style={styles.container}>
            <MyAppBar title="SESSION DETAIL" handleGoBack={handleGoBack} />
            {loading ? <View style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}><ActivityIndicator color={MyColor.primary} /></View> :
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>Class</Text>
                <Dropdown
                    style={[styles.dropdown, , styles.disableColor, isFocusClass && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={classData ? [classData] : []}
                    search
                    maxHeight={300}
                    labelField="class_name"
                    valueField="id"
                    placeholder={!isFocusClass ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={classData}
                    onFocus={() => setIsFocusClass(true)}
                    onBlur={() => setIsFocusClass(false)}
                    onChange={item => {
                    }}
                    disable={true}
                />
                <SizedBox height={16}/>
                <EditableText 
                    title='Session Name' 
                    onTextChange={handleTextChange} 
                    content={session.session_name}
                    editable={isCanEdit}
                />
                <View style={styles.level_genre_container}>
                  {/* LEVEL */}
                  <View style={styles.level_container}>
                    <Text style={styles.title}>Level</Text>
                    <Dropdown
                        style={[
                            styles.dropdown, 
                            classData?.level !== 'mutilevel' && styles.disableColor, 
                            isFocusLevel && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={enumLevelList}
                        search
                        maxHeight={300}
                        labelField="value"
                        valueField="value"
                        placeholder={!isFocusLevel ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        value={session.level}
                        onFocus={() => setIsFocusLevel(true)}
                        onChange={item => {
                            setSelectedLevel(item.value);
                            setIsFocusLevel(false);

                            console.log('Selected level:', item.value);
                        }}
                        disable={isCanEdit ? false : classData?.level !== 'mutilevel'}
                    />
                    </View>
                    {/* GENRE */}
                    <View style={styles.genre_container}>
                      <Text style={styles.title}>Genre</Text>
                      <Dropdown
                          style={[
                            styles.dropdown, 
                            classData?.genre !== 'mutigenre' && styles.disableColor, 
                            isFocusGenre && { borderColor: 'blue' 
                            }]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={enumGenreList}
                          search
                          maxHeight={300}
                          labelField="value"
                          valueField="value"
                          placeholder={!isFocusGenre ? 'Select item' : '...'}
                          searchPlaceholder="Search..."
                          value={session.genre}
                          onFocus={() => setIsFocusGenre(true)}
                          onChange={item => {
                              setSelectedGenre(item.value);
                              setIsFocusGenre(false);

                              console.log('Selected genre:', item.value);

                          }}
                          disable={isCanEdit ? false : classData?.genre !== 'mutigenre'}
                      />
                    </View>
                </View>
                <SizedBox height={32}/>
                <Video
                  source={{uri: session.video_url}}   // Can be a URL or a local file.
                  ref={playerRef}                                      
                  onBuffer={() => {}}                // Callback when remote video is buffering
                  onEnd={() => {}}                      // Callback when playback finishes
                  onError={() => {}}               
                  controls={true}             
                  style={styles.backgroundVideo}
                />
                <SizedBox/>
                <VideoPickerOld onVideoSelected={handleChoseVideo} title="Choose other video?"/>
                <SizedBox height={32}/>
                <ImagePicker onImageSelected={handleChooseThumnail} imageUrl={session.thumbnail_url}/>

                {/* RESULT VIDEOS */}
                <SizedBox height={32}/>
                <View style={styles.student_video_container}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}> 
                    <Text style={styles.title}>Student result video</Text>
                    <TextButton title="See all" onPress={handleNavStudentVideos} />
                  </View>
                  {joinedDataList.length == 0 ? 
                    <Text style={styles.normalText}>There have no video result</Text> :
                    <FlatList
                      data={joinedDataList}
                      renderItem={({ item, index }) =>
                          <View style={styles.student_video}>
                            <Video 
                              source={{uri: item.result_video_url}}   // Can be a URL or a local file.
                              ref={playerRef}                                      
                              onBuffer={() => {}}                // Callback when remote video is buffering
                              onEnd={() => {}}                      // Callback when playback finishes
                              onError={() => {}}               
                              controls={true}             
                              style={{height: 120}}
                            />
                          </View>
                      }
                      horizontal={true}
                      showsVerticalScrollIndicator={false}
                    />
                  }
                </View>

                {/* STUDENTS */}
                <SizedBox height={32}/>
                <View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <Text style={styles.title}>Students</Text>
                    <TextButton title="See all" onPress={handleNavStudentList} />
                  </View>
                  {joinedDataList.length == 0 ? 
                  <Text>There are no student</Text> :
                  <StudentTable studentList={joinedDataList} isShort={true} />}
                </View>

                {/* COMMUNITY */}
                <SizedBox height={32}/>
                <View style={{}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <Text style={styles.title}>Community</Text>
                      <TextButton title="Join Here" onPress={handleNavigateCommunityDetail} />
                  </View>
                  {commentDataList.length == 0 ? 
                    <Text style={styles.normalText}>There have no comment</Text>
                  : <CommentCard comments={commentDataList.slice(0, 2) || []} />}
                </View>
                <SizedBox height={140}/>
              </ScrollView> }
              {isCanEdit && <BottomButton title="Save change" onPress={handleSaveChangeSession} />}
        </View>
    );
};

export default Sessionscreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColor.white

        // justifyContent: 'center',
        // alignItems: 'center',
    },
    scrollContainer: {        
        // height: '100%',
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: MyColor.white
      },
      normalText: {

      },
      dropdown: {
          height: 50,
          borderColor: 'gray',
          borderWidth: 0.5,
          borderRadius: 8,
          paddingHorizontal: 8,
        },
        disableColor: {
            backgroundColor: MyColor.lightGrey
        },
        icon: {
          marginRight: 5,
        },
        label: {
          position: 'absolute',
          backgroundColor: 'white',
          left: 22,
          top: 8,
          zIndex: 999,
          paddingHorizontal: 8,
          fontSize: 14,
        },
        placeholderStyle: {
          fontSize: 16,
        },
        selectedTextStyle: {
          fontSize: 16,
        },
        iconStyle: {
          width: 20,
          height: 20,
        },
        inputSearchStyle: {
          height: 40,
          fontSize: 16,
        },
        title: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 8,
        },
        level_genre_container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        level_container: {
          flex: 1,
          paddingRight: 8,
        },
        dropdown_level: {
          height: 50,
          borderColor: 'gray',
          borderWidth: 0.5,
          borderRadius: 8,
          paddingHorizontal: 8,
        },
        genre_container: {
          flex: 1,
          paddingLeft: 8,
        },
  backgroundVideo: {
    width: '100%',
    height: 200,   
  },
  video_resume_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  student_video_container: {
  },
  student_video: {
    height: 120,
    width: 240,
    marginRight: 8
  },
      
});
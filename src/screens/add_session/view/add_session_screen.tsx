import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Alert, ActivityIndicator } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import MyColor from "../../../constants/color";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dropdown } from 'react-native-element-dropdown';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { useAddSession } from "../store/add_session_slice";
import { useAuth } from "../../../store/auth_slice";
import EditableText from "../../../components/text_field/editable_text";
import SizedBox from "../../../components/size_box/size_box";
import BottomButton from "../../../components/button/bottom_button";
import VideoPickerOld from "../../../components/picker/video_picker_old";
import ImagePicker from "../../../components/picker/image_picker";
import RNFS from 'react-native-fs';
import { getImageUrl, getVideoUrl, supabase, uploadImage, uploadVideo } from "../../../supabase_config/supabase";
import { decode } from "base64-arraybuffer";
import { EStatus } from "../../../types/status_enum";

const AddSessionScreen = (props) => {
    const {session} = props;
    const [classList, setClassList] = useState<Class[]>([]);
    const [enumLevelList, setEnumLevelList] = useState<string[]>([]);
    const [enumGenreList, setEnumGenreList] = useState<string[]>([]);

    const {uuid} = useAuth();
    const {getClass, getEnumLevelValues, getEnumGenreValues, addSession} = useAddSession();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedImage, setselectedImage] = useState<string | null>(null);

    const [selectedClass, setSelectedClass] = useState<Class>();
    const [isFocusClass, setIsFocusClass] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [isFocusLevel, setIsFocusLevel] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isFocusGenre, setIsFocusGenre] = useState(false);

    const [inputText, setInputText] = useState('');
    const [inputFees, setInputFees] = useState('');

    const [loading, setLoading] = useState(false);

    const fetchClassList = async () => { 
      await getClass(uuid).then((data) => {
        setClassList(data);
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

    useEffect(() => {
      fetchClassList();
      fetchEnumLevelValues();
      fetchEnumGenreValues();
    }, []);

    // console.log('Class list:', classList);
    // console.log('Formatted class list:', formattedClassList);
    // console.log('Enum level list:', enumLevelList);
    // console.log('Enum genre list:', enumGenreList);

    const handleVideoSelected = (uri) => {
      setSelectedVideo(uri);
      console.log('Video đã chọn:', uri);
      // Làm gì đó với URI video, ví dụ: upload lên server
    };
    
    const handleImageSelected = (uri) => {
      setselectedImage(uri);
      console.log('Image đã chọn:', uri);
      // Làm gì đó với URI ảnh, ví dụ: upload lên server
    }

    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    }
    const handleTextChange = (text) => {
      setInputText(text);
    };
    const handleFeesChange = (text) => {
      setInputFees(text);
    };
    const handleAddSesion = async () => {
      if(isFormValid()) {
        setLoading(true);

        const videoUrl = await uploadVideoToStorage();
        const thumnailUrl = await uploadThumbnailToStorage();

        console.log('Video URL:', videoUrl);
        console.log('Thumbnail URL:', thumnailUrl);

        const newSession: ISession = {
          class_id: selectedClass?.id || '',
          instructor_id: uuid,
          session_name: inputText,
          level: selectedLevel,
          genre: selectedGenre,
          price: inputFees,
          video_url: videoUrl || '',
          thumbnail_url: thumnailUrl || '',
          created_at: new Date().toISOString(),
          duration: "",
          status: EStatus.Waiting,
        };
  
        addSession(newSession).then((data) => {
          setLoading(false);

          console.log('New session:', data);
          Alert.alert('Session added successfully');
          navigation.goBack();
        }).catch((error) => {
          console.error(error);
          Alert.alert('Failed to add session');});
      };      
    };
    const uploadVideoToStorage = async () => {      
      try {
        const base64 = await RNFS.readFile(selectedVideo!, 'base64');
        const filePath = `videos/${uuid}${new Date().getTime()}_${selectedVideo!.split('/').pop()}`;
        const {data, error} = await supabase.storage.from('hancom02').upload(filePath, decode(base64), { contentType: 'video/mp4' });

        if (data) {
          // const publicUrl = supabase.storage.from('videos').getPublicUrl(data.path);

          return `https://dkasnzwgahkgoczktpfe.supabase.co/storage/v1/object/public/hancom02/${filePath}`;
        } else {
          console.error('Error uploading video:', error);
        }
      } catch (error) {
        console.error("Error uploading video:", error);
        Alert.alert("Failed to upload video.");
        return '';
      }
    };
    const uploadThumbnailToStorage = async () => {    
      try {
        const base64 = await RNFS.readFile(selectedImage!, 'base64');
        const filePath = `images/${uuid}${new Date().getTime()}_${selectedImage!.split('/').pop()}`;
        const {data, error} = await supabase.storage.from('hancom02').upload(filePath, decode(base64), { contentType: 'image/jpg' });
        
        if (data) {
          // const publicUrl = supabase.storage.from('images').getPublicUrl(data.path).data.publicUrl;
          // console.log('Thumbnail URL:', publicUrl);

          return `https://dkasnzwgahkgoczktpfe.supabase.co/storage/v1/object/public/hancom02/${filePath}`;
        } else {
          console.error('Error uploading thumbnail:', error);
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error);
        Alert.alert("Failed to upload thumbnail.");
        return '';
      }
    };
    
    const isFormValid = () => {
      if (!selectedClass) {
        Alert.alert("Class is required");
        return false;
      }
      if (!inputText) {
        Alert.alert("Session name is required");
        return false;
      }
      if (!selectedLevel) {
        Alert.alert("Level is required");
        return false;
      }
      if (!selectedGenre) {
        Alert.alert("Genre is required");
        return false;
      }
      if (!inputFees) {
        Alert.alert("Session fees are required");
        return false;
      }
      if (!selectedVideo) {
        Alert.alert("Video is required");
        return false;
      }
      if (!selectedImage) {
        Alert.alert("Image is required");
        return false;
      }
      return true;
    };

    return (
        <View style={styles.container}>
            <MyAppBar headerTitle='Add Session' handleGoBack={handleGoBack}/>
            {loading ? <ActivityIndicator style={styles.indicator} color={MyColor.blue} size={40}/> : 
            <ScrollView style={styles.scrollContainer}>
                <Text style={styles.title}>Class</Text>
                <Dropdown
                    style={[styles.dropdown, isFocusClass && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={classList}
                    search
                    maxHeight={300}
                    labelField="class_name"
                    valueField="id"
                    placeholder={!isFocusClass ? 'Select item' : '...'}
                    searchPlaceholder="Search..."
                    value={selectedClass}
                    onFocus={() => setIsFocusClass(true)}
                    onBlur={() => setIsFocusClass(false)}
                    onChange={item => {
                        setSelectedClass(item);
                        setSelectedLevel(item.level);
                        setSelectedGenre(item.genre);
                        setIsFocusClass(false);

                        console.log('Selected class:', item.id);

                    }}
                />
                <SizedBox height={16}/>
                <EditableText title='Session Name' onTextChange={handleTextChange}/>
                <View style={styles.level_genre_container}>
                  {/* LEVEL */}
                  <View style={styles.level_container}>
                    <Text style={styles.title}>Level</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocusLevel && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={selectedClass?.level !== 'mutivevel' ? enumLevelList : selectedClass.level}
                        search
                        maxHeight={300}
                        labelField="value"
                        valueField="value"
                        placeholder={!isFocusLevel ? 'Select item' : '...'}
                        searchPlaceholder="Search..."
                        value={selectedLevel}
                        onFocus={() => setIsFocusLevel(true)}
                        onChange={item => {
                            setSelectedLevel(item.value);
                            setIsFocusLevel(false);

                            console.log('Selected level:', item.value);
                        }}
                        disable={selectedClass?.level !== 'mutilevel'}
                    />
                    </View>
                    {/* GENRE */}
                    <View style={styles.genre_container}>
                      <Text style={styles.title}>Genre</Text>
                      <Dropdown
                          style={[styles.dropdown, isFocusGenre && { borderColor: 'blue' }]}
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
                          value={selectedGenre}
                          onFocus={() => setIsFocusGenre(true)}
                          onChange={item => {
                              setSelectedGenre(item.value);
                              setIsFocusGenre(false);

                              console.log('Selected genre:', item.value);

                          }}
                          disable={selectedClass?.genre !== 'mutigenre'}
                      />
                    </View>
                </View>
                <SizedBox height={16}/>
                <EditableText title='Session Fees' onTextChange={handleFeesChange}/>
                <VideoPickerOld onVideoSelected={handleVideoSelected} />
                <SizedBox height={16}/>
                <ImagePicker onImageSelected={handleImageSelected} />
                <SizedBox height={140}/>
            </ScrollView>
            }
            <BottomButton title='Add Session' onPress={handleAddSesion}/>
        </View>
    )
  };

export default AddSessionScreen;

const styles = StyleSheet.create({
    container: {
        // paddingHorizontal: 16,
        // paddingVertical: 16,
        flex: 1,
        backgroundColor: MyColor.white
    },
    indicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {        
      // height: '100%',
      flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: MyColor.white
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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
      dropdown_genre: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
      },
})


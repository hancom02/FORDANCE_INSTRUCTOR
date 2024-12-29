import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import MyAppBar from "../../../components/app_bar/app_bar";
import MyColor from "../../../constants/color";
import EditableText from "../../../components/text_field/editable_text";
import { useEffect, useState } from "react";
import SizedBox from "../../../components/size_box/size_box";
import { Dropdown } from 'react-native-element-dropdown';
import { useAddClass } from "../store/add_class_slice";
import BottomButton from "../../../components/button/bottom_button";
import { useAuth } from "../../../store/auth_slice";
import ImagePicker from "../../../components/picker/image_picker";
import { supabase } from "../../../supabase_config/supabase";
import RNFS from 'react-native-fs';
import { decode } from "base64-arraybuffer";



const AddClassScreen = () => {
    const [className, setClassName] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [whatLearn, setWhatLearn] = useState('');
    const [whatPrepare, setWhatPrepare] = useState(''); 
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [levelValues, setLevelValues] = useState<string[]>([]);
    const [genreValues, setGenreValues] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const { uuid } = useAuth();
    const { getEnumLevelValues, getEnumGenreValues, addClass } = useAddClass();

    const [isFocusLevel, setIsFocusLevel] = useState(false);
    const [isFocusGenre, setIsFocusGenre] = useState(false);

    const fetchLevelValues = async () => {
        await getEnumLevelValues().then((data) => {
          setLevelValues(data);
        }).catch((error) => {
          console.error(error);
        });
      };
    const fetchGenreValues = async () => {
        await getEnumGenreValues('genre').then((data) => {
            setGenreValues(data);
        }).catch((error) => {
            console.error(error);
        });
    };

    useEffect(() => {
    fetchLevelValues();
    fetchGenreValues();
    }, []);

    // console.log('Level values:', levelValues);
    // console.log('Genre values:', genreValues);
    // console.log('Selected level:', selectedLevel);
    // console.log('Selected genre:', selectedGenre);
    // console.log('Class name:', className);
    // console.log('Introduce:', introduce);
    // console.log('What learn:', whatLearn);

    const handleAddClass = async () => {
        isFormValid();

        const imageURL = await uploadImageCoverToStorage();

        console.log('Image cover URL: ', imageURL);

        const newClass: IClass = {
            class_name: className,
            introduce: introduce,
            what_learn: whatLearn,
            what_prepare: whatPrepare,
            level: selectedLevel,
            genre: selectedGenre,
            instructor_id: uuid,
            instructor_username: 'Hoai Thuong',
            image_cover_url: imageURL || DefaultImage.imageCover,
            session_count: 0,
        };

        addClass(newClass).then((data) => {
            setLoading(false);
    
            console.log('New class:', data);
            Alert.alert('Class added successfully');
        }).catch((error) => {
            console.error(error);
            Alert.alert('Failed to add class');
        })
        

    };

    const uploadImageCoverToStorage = async () => {    
        try {
        const base64 = await RNFS.readFile(selectedImage!, 'base64');
        const filePath = `images/${uuid}${new Date().getTime()}_${selectedImage!.split('/').pop()}`;
        const {data, error} = await supabase.storage.from('hancom02').upload(filePath, decode(base64), { contentType: 'image/jpg' });

        if (data) {
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
          if (!className) {
            Alert.alert("Class is required");
            return false;
          }
          if (!whatLearn) {
            Alert.alert("Session name is required");
            return false;
          }
          if (!whatPrepare) {
            Alert.alert("Level is required");
            return false;
          }
          if (!selectedLevel) {
            Alert.alert("Genre is required");
            return false;
          }
          if (!selectedGenre) {
            Alert.alert("Genre is required");
            return false;
          }
          if (!selectedImage) {
            Alert.alert("Image is required");
            return false;
          }
          return true;
        };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <MyAppBar title="Add Class" />
            <ScrollView style={styles.contentContainer}>
                <EditableText 
                    title="Class Name" 
                    isMutiline={true} 
                    numberOfLines={2} 
                    onTextChange={(text) => {setClassName(text)}} 
                />
                <EditableText 
                title="Introduce" 
                isMutiline={true} 
                numberOfLines={4} 
                onTextChange={(text) => {setIntroduce(text)}} 
                />
                <EditableText 
                title="What you will learn" 
                isMutiline={true} 
                numberOfLines={4} 
                onTextChange={(text) => {setWhatLearn(text)}} 
                />
                <EditableText 
                title="Things to prepare" 
                isMutiline={true} 
                numberOfLines={4} 
                onTextChange={(text) => {setWhatPrepare(text)}}
                />
                <View style={styles.level_genre_container}>
                    <View style={styles.level_container}>
                        <Dropdown
                            style={[styles.dropdown, isFocusLevel && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={levelValues}
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
                            }}
                        />
                    </View>
                    <View style={styles.genre_container}>
                        <Dropdown
                            style={[styles.dropdown, isFocusGenre && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={genreValues}
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
                            }}
                        />
                    </View>
                </View>
                <SizedBox height={16} />
                <ImagePicker onImageSelected={setSelectedImage}  />
                <SizedBox height={160} />
            </ScrollView>
            <BottomButton title="Add Class" onPress={handleAddClass} />
        </KeyboardAvoidingView>
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
    },
    level_genre_container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      level_container: {
        flex: 1,
        paddingRight: 8,
      },
      genre_container: {
        flex: 1,
        paddingLeft: 8,
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
});
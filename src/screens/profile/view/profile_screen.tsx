import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyColor from '../../../constants/color';
import { useProfile } from '../store/profile_slice';
import MyAppBar from '../../../components/app_bar/app_bar';
import { useAuth } from '../../../store/auth_slice';
import { RouteProp, useRoute } from '@react-navigation/core';
import ImagePicker from '../../../components/picker/image_picker';
import { checkStoragePermission, pickImage } from '../../../utils/pick_image_util';
import UploadImageToSupabase from '../../../utils/update_image_util';

const ProfileScreen = () => {
    // const route = useRoute<RouteProp<{ params: { instructor_id: string } }, 'params'>>();
    // const { instructor_id } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const {uuid} = useAuth();
  const {getProfile, updateProfile} = useProfile();

  const [profile, setProfile] = useState<IInstructor>();
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [prizes, setPrizes] = useState('');
  const [introduce, setIntroduce] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(
    'https://via.placeholder.com/350x150',
  );
  const [avatarUrl, setAvatarUrl] = useState('');

  const fetchProfile = async () => {
    try {
        setLoading(true);

        const profileData = await getProfile(uuid);
        setProfile(profileData);

        setName(profileData.name );
        setEmail(profileData.email);
        setPhoneNumber(profileData.phone);
        setPrizes(profileData.prize);
        setIntroduce(profileData?.introduce);
        setAvatarUrl(profileData.avatar_url);

        setLoading(false);
    } catch (err) {
        console.error("Error fetching data outside useEffect: ", err);
    }
  }
  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    try {
        await updateProfile(uuid, name, avatarUrl, prizes, introduce).then((data) => {
            Alert.alert('Save change successfully!');
            setIsProfileUpdated(true); 
            setIsEditing(false);  
          }).catch((err) => {
            throw new Error(err.message);
          });
      } catch (error) {
        console.error("Error saving profile:", error);
      }  };
  const handleCancel = () => setIsEditing(false);

  const handleEditCoverPhoto = () => {
    // ImagePicker.showImagePicker({ mediaType: 'photo' }, response => {
    //     if (!response.didCancel) {
    //         setCoverPhotoUrl(response.uri);
    //     }
    // });
  };

  const handleEditAvatar = async () => {
    const hasPermission = await checkStoragePermission();
    if (hasPermission) {
      const selectedImageUri = await pickImage();
      setSelectedImageUri(selectedImageUri || '');
      if (selectedImageUri) {
        const url = await UploadImageToSupabase(selectedImageUri, uuid);
        console.log('Uplaod image: ', url);
        setAvatarUrl(url);
        // onAvatarChanged(selectedImageUri); // Callback to notify parent component
      }
    } else {
      console.log('Storage permission denied');
    }
  };

  console.log('uuid: ', uuid);
  console.log({profile});
  console.log('name: ', name);
  console.log('ava url: ', avatarUrl);

  useEffect(() => {
    if (isProfileUpdated) {
        fetchProfile();
        setIsProfileUpdated(false);
    }
  }, [isProfileUpdated]);

  useEffect(() => {
    fetchProfile();    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
        <MyAppBar headerTitle="Profile"/>
        {loading ? 
            <View>
                <ActivityIndicator size={36} color={MyColor.primary}/>
            </View> : 
            <View style={styles.contentConatainer}>
                {/* <View style={styles.profileImgContainer}> */}
                    <ImageBackground
                    source={{uri: isEditing ? (selectedImageUri || avatarUrl) : avatarUrl}}
                    style={styles.coverPhoto}>
                    {isEditing && (
                        <TouchableOpacity
                        style={styles.editCoverPhotoBtn}
                        onPress={handleEditCoverPhoto}>
                        <Icon name='image' size={24} color={MyColor.black}/>
                        </TouchableOpacity>
                    )}
                    </ImageBackground>
                    <View style={styles.avatarContainer}>
                        <Image source={{uri: isEditing ? (selectedImageUri || avatarUrl) : avatarUrl}} style={styles.avatar}></Image>
                        {isEditing && (
                            <TouchableOpacity
                            style={styles.editAvatarBtn}
                            onPress={handleEditAvatar}>
                                <Icon name='image' size={24} color={MyColor.black}/>
                            </TouchableOpacity>
                        )}
                    {/* </View> */}
                    </View>
                {/* <View style={styles.textNameContainer}> */}
                    {/* <Text style={styles.textName}>{profile?.name}</Text> */}
                {/* </View> */}
                <ScrollView style={{flex: 1, width: '100%', marginTop: 80}}>
                    <View style={styles.profileBody}>

                    <Text style={styles.label}>Username</Text>
                    {isEditing ? (
                        <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        />
                    ) : (
                        <Text style={styles.text}>{name}</Text>
                    )}

                    <Text style={styles.label}>Email</Text>
                    {isEditing ? (
                        <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        editable={false}
                        />
                    ) : (
                        <Text style={styles.text}>{profile?.email}</Text>
                    )}
                    <Text style={styles.label}>Phone number</Text>
                    {isEditing ? (
                        <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        color="black"
                        />
                    ) : (
                        <Text style={styles.text}>{profile?.phone}</Text>
                    )}
                    <Text style={styles.label}>Prizes</Text>
                    {isEditing ? (
                        <TextInput
                        style={[styles.textArea, {maxWidth: '100%'}]}
                        value={prizes}
                        onChangeText={setPrizes}
                        multiline
                        color="black"
                        />
                    ) : (
                        <Text style={[styles.text, {maxWidth: '100%'}]}>{profile?.prize}</Text>
                    )}
                    <Text style={styles.label}>Introduce</Text>
                    {isEditing ? (
                        <TextInput
                        style={[styles.textArea, {maxWidth: '100%'}]}
                        multiline
                        value={introduce}
                        onChangeText={setIntroduce}
                        color="black"
                        />
                    ) : (
                        <Text style={[styles.text, {maxWidth: '100%'}]} numberOfLines={3} ellipsizeMode="tail">{profile?.introduce}</Text>
                    )}
                    </View>

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
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                        <Text style={styles.cancelBtnText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </ScrollView>
            </View>
        }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  contentConatainer: {
    flex: 1,
    // paddingHorizontal: 16,
    justifyContent: 'center',
    alignContent: 'center',
    // backgroundColor: MyColor.primary

  },
  profileImgContainer: {
    width: '100%',
    height: 220,

    justifyContent: 'center',  // Căn giữa các phần tử trong container
    alignItems: 'center',      // Căn giữa các phần tử trong container
    backgroundColor: MyColor.primary,
    // position: 'relative',
    // justifyContent: 'center',
    // alignContent: 'center',
    // alignItems: 'center',

  },
  coverPhoto: {
    width: '100%',
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    top: 100,
    bottom: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  nameContainer: {
    position: 'absolute',
    top: 100,
    bottom: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  changeAvatarBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  textNameContainer: {
    width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textName: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
  },
  editCoverPhotoBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 5,
  },
  editBtn: {
    marginTop: 10,
    backgroundColor: MyColor.primary,
    borderRadius: 20,
    padding: 10,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  profileBody: {
    width: '100%',
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
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
  textArea: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    width: '100%',
  },
  text: {
    // marginVertical: 5,
    // padding: 10,
    marginBottom: 16,
    color: 'black',
    width: '100%',
    
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
});

export default ProfileScreen;

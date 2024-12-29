import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import MyColor from '../../constants/color';

const VideoPickerOld = ({onVideoSelected}) => {
  const [video, setVideo] = useState('');

  const handleChooseVideo = async () => {
    try {
      const permissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      console.log('Permission status:', permissionStatus);
  
      if (permissionStatus) {
        console.log('Storage permission already granted');
        await pickVideo();
      } else {
        console.log('Requesting storage permission');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'FORDANCE INSTRUCTOR needs access to your storage.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can access the storage');
          // Sau khi cấp quyền thành công, tiếp tục chọn video
          await pickVideo();
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.error('Permission request error:', err); // In lỗi khi yêu cầu quyền bị lỗi
    }
  };
  
  const pickVideo = async () => {
    try {
      // Chọn video từ Document Picker
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
  
      if (res && res.length > 0) {
        const selectedVideo = res[0]; 
  
        if (selectedVideo.uri) {
          setVideo(selectedVideo.uri); 
          onVideoSelected(selectedVideo.uri);

          console.log('Selected video:', selectedVideo.uri);
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Document Picker error:', err); 
      }
    }
  };

  const handleChooseThumbnail = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (res && res[0].uri) {
        // setNewThumbnail(res[0].uri);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {video && <Image source={{ uri: video }} style={{ width: '80%', height: '50%', marginBottom: 8}} resizeMode='contain' />}
      <Button title="Choose video" onPress={handleChooseVideo} />
    </View>
  );
};

export default VideoPickerOld;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    backgroundColor: MyColor.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
})
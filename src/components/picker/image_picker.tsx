import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import MyColor from '../../constants/color';

const ImagePicker = ({onImageSelected}) => {
  const [image, setImage] = useState('');

  const handleChooseImage = async () => {
    try {
      const permissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      console.log('Permission status:', permissionStatus);
  
      if (permissionStatus) {
        console.log('Storage permission already granted');
        await pickImage();
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
          await pickImage();
        } else {
          console.log('Storage permission denied');
        }
      }
    } catch (err) {
      console.error('Permission request error:', err); // In lỗi khi yêu cầu quyền bị lỗi
    }
  };

  const pickImage = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      if (res && res[0].uri) {
        const selectedImage = res[0];
        if(selectedImage.uri) {
            setImage(selectedImage.uri);
            onImageSelected(selectedImage.uri);

            console.log('Selected image:', selectedImage.uri);
        }
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
      {image && <Image source={{ uri: image }} style={styles.image} resizeMode='center' />}
      <Button title="Choose Thumnail" onPress={handleChooseImage} />
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 180,
    backgroundColor: MyColor.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  image: {
    width: '80%',
    height: '60%',
    marginBottom: 8
  },
})
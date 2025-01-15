import { PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export const checkStoragePermission = async () => {
  try {
    const permissionStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    console.log('Permission status:', permissionStatus);

    if (permissionStatus) {
      console.log('Storage permission already granted');
      return true;
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
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.error('Permission request error:', err);
    return false;
  }
};

export const pickImage = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });

    if (res && res[0].uri) {
      return res[0].uri;
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled the picker');
    } else {
      console.error(err);
    }
    return null;
  }
};

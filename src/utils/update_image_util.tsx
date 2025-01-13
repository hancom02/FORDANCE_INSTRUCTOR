import RNFS from 'react-native-fs';
import { Alert } from 'react-native';
import { decode } from "base64-arraybuffer";
import { supabase } from '../supabase_config/supabase';

const UploadImageToSupabase = async (selectedImage: string, uuid: string): Promise<string> => {
    try {
        // Đọc file ảnh và chuyển thành Base64
        const base64 = await RNFS.readFile(selectedImage, 'base64');

        // Tạo tên file với thời gian để tránh trùng
        const filePath = `images/${uuid}_${new Date().getTime()}_${selectedImage.split('/').pop()}`;

        // Upload file lên Supabase storage
        const { data, error } = await supabase.storage
            .from('hancom02') // Tên bucket của bạn trong Supabase
            .upload(filePath, decode(base64), {
                contentType: 'image/jpeg',  // Xử lý loại file nếu cần
            });

        if (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload failed', 'An error occurred while uploading the image.');
            return '';
        }

        // Lấy URL công khai sau khi upload thành công
        // const publicUrl = supabase.storage.from('hancom02').getPublicUrl(filePath).data.publicUrl;
        // console.log('Image uploaded successfully. Public URL:', publicUrl);

        return `https://dkasnzwgahkgoczktpfe.supabase.co/storage/v1/object/public/hancom02/${filePath}`;

    } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload failed', 'An unexpected error occurred while uploading the image.');
        return '';
    }
};

export default UploadImageToSupabase;

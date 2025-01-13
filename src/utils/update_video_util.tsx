import { Alert } from 'react-native';
import { decode } from "base64-arraybuffer";
import { supabase } from '../supabase_config/supabase';
import RNFS from 'react-native-fs';

const UploadVideoToSupabase = async (selectedVideo: string, uuid: string): Promise<string> => {
    try {
        const base64 = await RNFS.readFile(selectedVideo, 'base64');
        
        const filePath = `videos/${uuid}${new Date().getTime()}_${selectedVideo.split('/').pop()}`;
        
        const { data, error } = await supabase.storage.from('hancom02').upload(filePath, decode(base64), { contentType: 'video/mp4' });

        if (data) {
            return `https://dkasnzwgahkgoczktpfe.supabase.co/storage/v1/object/public/hancom02/${filePath}`;
        } else {
            throw new Error(`Error uploading video: ${error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Error uploading video:", error);
        Alert.alert("Failed to upload video.");
        throw new Error("Failed to upload video");
    }
};

export default UploadVideoToSupabase;

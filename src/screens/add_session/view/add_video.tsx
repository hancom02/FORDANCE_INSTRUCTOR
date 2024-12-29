// import React, { useState } from 'react';
// import { View, Button, Text, Alert, Platform } from 'react-native';
// import { createClient } from '@supabase/supabase-js';
// import { launchImageLibrary } from 'react-native-image-picker';
// import RNFFmpeg from 'react-native-ffmpeg'; // Hoặc thư viện tương đương

// const supabase = createClient('your-supabase-url', 'your-anon-key');

// const VideoUploadScreen = () => {
//   const [videoDuration, setVideoDuration] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // Hàm lấy độ dài video từ file
// const getVideoDuration = (videoUri) => {
//     return new Promise((resolve, reject) => {
//       // Sử dụng FFmpeg để lấy độ dài video
//       RNFFmpeg.execute(`-i ${videoUri} -f null - 2>&1 | grep "Duration" | awk '{print $2}' | tr -d ,`)
//         .then((result) => {
//           const durationStr = result.output.trim(); // Ví dụ: "00:02:30.25"
          
//           // Tách độ dài video thành giờ, phút, giây
//           const [hours, minutes, seconds] = durationStr.split(':').map(parseFloat);
          
//           // Làm tròn giây
//           const roundedSeconds = Math.round(seconds);
  
//           // Tính toán lại phút và giây sau khi làm tròn
//           let roundedMinutes = minutes;
//           if (roundedSeconds === 60) {
//             roundedSeconds = 0;
//             roundedMinutes += 1;  // Thêm 1 phút nếu giây được làm tròn thành 60
//           }
  
//           // Tạo lại chuỗi độ dài theo định dạng "mm:ss"
//           const formattedDuration = `${String(roundedMinutes).padStart(2, '0')}:${String(roundedSeconds).padStart(2, '0')}`;
  
//           resolve(formattedDuration); // Trả về độ dài làm tròn
//         })
//         .catch((error) => {
//           reject(error); // Lỗi nếu không thể lấy độ dài
//         });
//     });
//   };

//   // Hàm upload video lên Supabase
//   const uploadVideo = async (file) => {
//     setIsUploading(true);
//     const { data, error } = await supabase
//       .storage
//       .from('videos')
//       .upload(`videos/${file.fileName}`, file, {
//         cacheControl: '3600',
//         upsert: false,
//       });

//     if (error) {
//       console.error('Error uploading video:', error);
//       Alert.alert('Upload failed', error.message);
//       setIsUploading(false);
//       return;
//     }

//     console.log('Video uploaded:', data);
//     Alert.alert('Upload successful', 'Video has been uploaded!');
//     setIsUploading(false);
//   };

//   // Hàm chọn video và xử lý
//   const selectAndUploadVideo = () => {
//     launchImageLibrary({ mediaType: 'video', quality: 1 }, async (response) => {
//       if (response.didCancel) {
//         console.log('User canceled video picker');
//         return;
//       }

//       if (response.errorMessage) {
//         console.error('Error picking video: ', response.errorMessage);
//         return;
//       }

//       const videoUri = response.assets[0].uri;
//       console.log('Video URI: ', videoUri);

//       // Lấy độ dài video
//       try {
//         const duration = await getVideoDuration(videoUri);
//         setVideoDuration(duration);
//         console.log('Video Duration: ', duration);

//         // Sau khi lấy độ dài, upload video
//         const file = {
//           uri: videoUri,
//           name: response.assets[0].fileName,
//           type: response.assets[0].type,
//         };

//         uploadVideo(file); // Upload video lên Supabase
//       } catch (error) {
//         console.error('Error getting video duration: ', error);
//         Alert.alert('Error', 'Unable to get video duration');
//       }
//     });
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Button title="Select Video" onPress={selectAndUploadVideo} />
//       {isUploading && <Text>Uploading...</Text>}
//       {videoDuration && <Text>Video Duration: {videoDuration} seconds</Text>}
//     </View>
//   );
// };

// export default VideoUploadScreen;

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {useMutation} from 'react-query';
// import {useAuth} from '../../../stores/auth.store';
import MyColor from '../../../constants/color';
import { useAuth } from '../../../store/auth_slice';
import { useComment } from '../store/community_slice';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import MyAppBar from '../../../components/app_bar/app_bar';
import TextButton from '../../../components/button/text_button';
import Video from 'react-native-video';
import SizedBox from '../../../components/size_box/size_box';
import DocumentPicker from 'react-native-document-picker';


const CommunityScreen = () => {
    const route = useRoute<RouteProp<{ params: { session_id: string } }, 'params'>>();
    const { session_id } = route.params;
    const navigation = useNavigation();

    console.log('session_id in community: ', session_id);

    const {uuid, username, avatar_url} = useAuth();
    const {getComment, addComment} = useComment();

    const [comments, setComments] = useState<IComment[]>([]);
    const [replyText, setReplyText] = useState('');
    const [image, setImage] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const fectchCommentData = async () => { 
        await getComment(session_id).then((comments) => {
            setComments(comments);
        })
        .catch((err) => {
            console.log('error in fetchCommentData: ', err);
        });
    }
    const handleGoBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        fectchCommentData();
    }, []);

    console.log('comments in community: ', comments);

    const handleOpenImagePicker = async () => {
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

    const onPressSubmit = async () => {        
        const newComment: ICommentDta = {
            content: replyText,
            session_id: session_id,
            user_id: uuid,
            img_ulr: '',
            created_at: '',
            video_url: ''
        };
        const newCommentWithUser: IComment = {
            ...newComment,
            username: username,
            avatar_url: avatar_url,
            img_url: ''
        }
        await addComment(newComment).then((comment) => {
            setComments([...comments, newCommentWithUser]);
        }).catch((err) => {
            console.log('error in addComment: ', err);
        });
    };

    const onPressReply = () => {

    };

//   const {mutate} = useMutation({
//     mutationFn: createComment,
//     onSuccess: data => {
//       console.log({data});
//     },
//   });

//   useEffect(() => {
//     if (_comments) setComments(_comments);
//   }, [JSON.stringify(_comments)]);

  const renderItemNew = ({item, index}: {item: IComment, index: number}) => {
    return (
      <View style={styles.commentContainerParent}>
        <View style={styles.commentContainer}>
          <Image source={{uri: item.avatar_url}} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{item.username}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
            {item.img_url && 
            <View>
              <SizedBox height={4} />
              <Image resizeMode='cover' resizeMethod='scale' source={{uri: item.img_url}} style={styles.imageContatiner} />
            </View>
            }
            <View style={styles.replyButton}>
              <TextButton
                title="Reply"
                onPress={onPressReply} 
                textStyle={styles.replyText}
                // color={MyColor.gray}               
              />
            </View>
          </View>
        </View>
        {item.video_url && <View style={styles.videoContainer}>
          <Video source={{uri: item.video_url}} />
        </View>}
      </View>
    );
  };

//   const handleReply = () => {
//     mutate({content: replyText, lessonId: lesson.id});
//     setComments(prev => [
//       ...prev,
//       {
//         content: replyText,
//         student: {
//           avatar_url: avatar_url,
//           name: username,
//         },
//       },
//     ]);
//     setReplyText('');
//   };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={comments}
        renderItem={renderItemNew}
        keyExtractor={(item, index) => index.toString()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Your question..."
          value={replyText}
          onChangeText={setReplyText}
        />
        <TouchableOpacity style={{marginTop: 20, marginLeft: 16}} onPress={handleOpenImagePicker}>
            <Icon name="image" size={20} color="black" />

          {/* <Ionicons name="image-outline" size={27} color="black" /> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.replySendButton} onPress={onPressSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommunityScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 30,
  },
  backButton: {},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  commentContainerParent: {
    flex: 1,
    marginBottom: 8
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'column',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    flex: 1,
  },
  commentUser: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
    marginLeft: 12,
  },
  commentText: {
    fontSize: 16,
    fontWeight: '400',
    color: MyColor.black,
    marginBottom: 12,
    marginLeft: 12,
  },
  replyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    marginLeft: 10,
  },
  replyAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userReplyContainer: {
    alignSelf: 'flex-start',
    flex: 1,
  },
  userReplyText: {
    margin: 5,
    marginLeft: 10,
  },
  replyUser: {
    fontWeight: 'bold',
    color: 'black',
  },
  replyButton: {
    color: 'blue',
    alignSelf: 'flex-start',
    marginLeft: 12
  },
  replyText: {
    color: MyColor.gray,
    fontSize: 16,
    fontWeight: 'bold',

  },
  imageContatiner: {
    flex: 1,
    height: 120,
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  videoContainer: {
    
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginBottom: 10,
    elevation: 1,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'black',
  },
  replySendButton: {
    marginTop: 20,
    // backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  submitText: {
    color: MyColor.primary,
    textTransform: 'uppercase',
    fontSize: 16,
  },
});

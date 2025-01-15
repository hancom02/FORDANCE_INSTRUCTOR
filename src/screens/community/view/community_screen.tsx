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
  Keyboard,
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
import { checkStoragePermission, pickImage } from '../../../utils/pick_image_util';
import UploadImageToSupabase from '../../../utils/update_image_util';


const CommunityScreen = () => {
    const route = useRoute<RouteProp<{ params: { session_id: string } }, 'params'>>();
    const { session_id } = route.params;
    const navigation = useNavigation();

    console.log('session_id in community: ', session_id);

    const {uuid, username, avatar_url} = useAuth();
    const {getComment, addComment} = useComment();

    const [comments, setComments] = useState<IComment[]>([]);

    const [replyText, setReplyText] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null); // Lưu parent_comment_id

    const [uri, setUri] = useState('');
    const [image, setImage] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const [loading, setLoading] = useState(false);

    const fectchCommentData = async () => { 
        await getComment(session_id)
        .then((comments) => {
          const sortedComments = sortComments(comments); // Sắp xếp trước khi hiển thị
          setComments(sortedComments);
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

    const handleSelectImage = async () => {
      const hasPermission = await checkStoragePermission();
      if (hasPermission) {
        const selectedImageUri = await pickImage();
        setUri(selectedImageUri || '');
      } else {
        console.log('Storage permission denied');
      }
    }
    const handleRemoveImage = () => {
      setUri('');
      setImgUrl('');
    };

    const onPressSubmit = async () => {
      setLoading(true);

      let url = '';
      if (uri) {
        url = await UploadImageToSupabase(uri, uuid);
        console.log('url ------------------- : ', url);
      }   

        const newComment: ICommentDta = {
            content: replyText,
            session_id: session_id,
            user_id: uuid,
            img_url: url || '',
            created_at: new Date().toISOString(),
            video_url: '',
            parent_comment_id: replyTo ?? undefined,
        };
        const newCommentWithUser: IComment = {
            ...newComment,
            username: username,
            avatar_url: avatar_url,
            img_url: '',
            parent_comment_id: newComment.parent_comment_id || '',
        }

        await addComment(newComment)
        .then((comment) => {
          const updatedComments = [...comments, newCommentWithUser];
          setComments(sortComments(updatedComments)); // Sắp xếp lại danh sách
          setLoading(false);
          handleRemoveImage();
        })
        .catch((err) => {
          console.log('error in addComment: ', err);
        });
    };

    const onPressReply = (commentId: string) => {
      setReplyTo(commentId); 
      Keyboard.dismiss();
    };

    const sortComments = (comments: IComment[]): IComment[] => {
      const commentMap = new Map<string, IComment[]>();
    
      // Nhóm các comment reply theo `parent_comment_id`
      comments.forEach((comment) => {
        const parentId = comment.parent_comment_id || 'root'; // Nếu không có parent_comment_id thì là comment gốc
        if (!commentMap.has(parentId)) {
          commentMap.set(parentId, []);
        }
        commentMap.get(parentId)?.push(comment);
      });
    
      // Sắp xếp danh sách theo mối quan hệ parent -> child
      const sorted: IComment[] = [];
    
      const addComments = (parentId: string) => {
        const replies = commentMap.get(parentId) || [];
        replies.forEach((reply) => {
          sorted.push(reply);
          if (reply.id) { // Kiểm tra nếu `reply.id` không phải là undefined
            addComments(reply.id);
          }
        });
      };
    
      // Thêm tất cả comment gốc (parent_comment_id === 'root') và đệ quy
      addComments('root');
    
      return sorted;
    };

  const renderItemNew = ({item, index}: {item: IComment, index: number}) => {
    const isReply = !!item.parent_comment_id;
  
    return (
      <View style={[styles.commentContainerParent, isReply && styles.replyIndent]}>
        <View style={styles.commentContainer}>
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{item.username}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
            {item.img_url && (
              <View>
                <SizedBox height={4} />
                <Image
                  resizeMode="cover"
                  resizeMethod="scale"
                  source={{ uri: item.img_url }}
                  style={styles.imageContatiner}
                />
              </View>
            )}
            <View style={styles.replyButton}>
              <TextButton
                title="Reply"
                onPress={() => onPressReply(item.id || '')}
                textStyle={styles.replyText}
              />
            </View>
          </View>
        </View>
        {item.video_url && (
          <View style={styles.videoContainer}>
            <Video source={{ uri: item.video_url }} />
          </View>
        )}
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
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
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
        style={styles.replyInputContainer}
      >
        <View style={{ width: '65%', justifyContent: 'flex-start' }}>
          <TextInput
            style={styles.replyInput}
            multiline
            numberOfLines={3}
            placeholder={
              replyTo ? `Replying to comment #${replyTo}` : 'Your question...'
            }
            value={replyText}
            onChangeText={setReplyText}
          />
          {uri && (
            <View style={{ position: 'relative', marginTop: 8 }}>
              <Image
                source={{ uri: uri }}
                style={styles.imageComment}
                borderRadius={16}
                resizeMethod="scale"
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <Icon name="times-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={{ marginTop: 20, marginLeft: 16 }}
          onPress={handleSelectImage}
        >
          <Icon name="image" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.replySendButton}
          onPress={onPressSubmit}
        >
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
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  replyInput: {
    // flex: 1,
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
  replyIndent: {
    marginLeft: 40, // Thụt vào khi là comment reply
  },
  submitText: {
    color: MyColor.primary,
    textTransform: 'uppercase',
    fontSize: 16,
  },
  imageComment: {
    // flex: 1,
    borderRadius: 8,

    height: 80,
    width: 80,

  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 4,
  },
});

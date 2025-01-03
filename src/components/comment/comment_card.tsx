import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import MyColor from '../../constants/color';
import TextButton from '../button/text_button';
import Video from 'react-native-video';
import SizedBox from '../size_box/size_box';

const CommentCard = ({comments, onPressReply} : {comments : IComment[]}) => {

  const renderItem = ({item, index}: {item: IComment, index: number}) => {
    return (
      <View style={styles.container}>
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

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default CommentCard;

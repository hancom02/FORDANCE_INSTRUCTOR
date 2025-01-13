import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';
import { EStatus } from '../../types/status_enum';
import MyColor from '../../constants/color';

  interface LessonCardProps {
    session: ISession;
    handleNav: () => void;
    onPressOpenMoreAction: () => void;
    onPressCloseMoreAction?: () => void;
  }
 
  const LessonCard: React.FC<LessonCardProps> = (props) => {
    const {
      session,
      handleNav,
      onPressOpenMoreAction,
      onPressCloseMoreAction,
    } = props;
  
    return (
      <TouchableOpacity style={styles.container} onPress={handleNav}>
        <View style={styles.firstContainer}>
          <Image style={styles.image} source={{uri: session.thumbnail_url}} />
          <View style={{flexDirection: 'column', height: '100%', width: '45%', justifyContent: 'center'}}>
            {session.status === EStatus.Waiting &&
              <View style={styles.textStatusContainer}> 
                <Text style={styles.textStatus}>{session.status}</Text>
              </View>
            }
            <View style={styles.textContentContainer}>
              {/* <View style={styles.}> */}
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={styles.textLessonName}>
                  {session.session_name}
                </Text>
              {/* </View> */}
              {/* <Text style={styles.textTime}>{session.duration}</Text> */}
            </View>

          </View>
        </View>
        <TouchableOpacity
          style={styles.secondContainer}
          onPress={onPressOpenMoreAction}>
          <Icon name='ellipsis-v' size={24} color="black"/>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  export default LessonCard;
  
  const styles = StyleSheet.create({
    container: {
      width: Dimensions.get('window').width * 0.96,
      height: 104,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    firstContainer: {
      width: '90%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      marginRight:  12,
    },
    secondContainer: {
      width: '10%',
    },
    textContentContainer: {
      width: '100%',
      // height: '100%',
      justifyContent: 'center',
      // backgroundColor: MyColor.blue
    },
    textStatusContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      marginBottom: 4,
      alignSelf: 'flex-start',
      // height: '20%',

      // backgroundColor: MyColor.gray
    },
    textStatus: {
      fontSize: 13,
      fontWeight: '500',
      color: MyColor.orange,
    },
    textLessonName: {
      fontSize: 19,
      fontWeight: '700',
      color: 'black',
      marginBottom: 4,
    },
    textTime: {
      fontSize: 14,
      fontWeight: '400',
      color: 'black',
    },
    image: {
      width: '48%',
      height: 100,
      borderRadius: 5,
      marginRight: 16,
    },
  });
  
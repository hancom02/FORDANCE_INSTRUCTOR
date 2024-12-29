import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
  } from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';

  interface LessonCardProps {
    session: Session;
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
          <View style={styles.textContentContainer}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.textLessonName}>
              {session.session_name}
            </Text>
            <Text style={styles.textTime}>{session.duration}</Text>
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
      flexDirection: 'row',
      alignItems: 'center',
      marginRight:  12,
    },
    secondContainer: {
      width: '10%',
    },
    textContentContainer: {
      width: '50%',
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
  
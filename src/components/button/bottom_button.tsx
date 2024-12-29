import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import MyColor from '../../constants/color';
import SizedBox from '../size_box/size_box';

const BottomButton = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
    <SizedBox height={16}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', 
      bottom: 0,
  },
  button: {
    width: '92%',
    paddingHorizontal: 16,
    // left: 16,
    // right: 16,
    backgroundColor:  MyColor.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    // marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default BottomButton;
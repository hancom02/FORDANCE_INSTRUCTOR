import React from 'react';
import { View } from 'react-native';
import MyColor from '../../constants/color';

const SizedBox = ({ height, width, backgroundColor}) => {
  return (
    <View style={{ 
      height: height, 
      width: width, 
      backgroundColor: 
        backgroundColor ? 
        backgroundColor : 
        MyColor.white  }} />
  );
};

export default SizedBox;
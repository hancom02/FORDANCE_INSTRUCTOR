import React from 'react';
import { View } from 'react-native';
import MyColor from '../../constants/color';

const SizedBox = ({ height = 16, width = 0, backgroundColor = MyColor.white}) => {
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
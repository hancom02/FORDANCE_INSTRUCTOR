import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, InputModeOptions } from 'react-native';

const EditableText = ({ 
  title, 
  content = '',
  placeHolder = 'Enter text here', 
  isMutiline = false,
  numberOfLines = 1,
  maxLength = 400,
  inputMode = 'text' as InputModeOptions,
  onTextChange  
}) => {
  const [text, setText] = useState(content);

  const handleTextChange = (newText) => {
    setText(newText);
    onTextChange(newText); // Truyền giá trị text lên component cha
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        placeholder={placeHolder}        
        multiline={isMutiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        inputMode={inputMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    paddingVertical: 16,
    borderRadius: 5,
  },
  moreText: {
    color: 'blue',
    marginTop: 5,
  },
});

export default EditableText;
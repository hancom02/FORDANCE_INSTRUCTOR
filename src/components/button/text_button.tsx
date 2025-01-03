import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MyColor from '../../constants/color';

interface TextButtonProps {
    title: string;
    color?: string;
    textStyle?: object;
    onPress: () => void;
}

const TextButton: React.FC<TextButtonProps> = ({ title, color = MyColor.primary, textStyle, onPress }) => {
    const defaultTextStyle = {
        fontSize: 16,
        fontWeight: 'medium',  
        color: MyColor.primary 
    };

    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={textStyle ? textStyle : defaultTextStyle}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'medium',
    },
});

export default TextButton;
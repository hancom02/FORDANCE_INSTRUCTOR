import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";

const ProgramDetailHeader = (props) => {
    const { onButtonPress } = props;
    const [selectedButton, setSelectedButton] = useState('Overview');

    const renderButton = (buttonName) => {
        const isSelected = selectedButton === buttonName;
        return (
            <TouchableOpacity
                key={buttonName}
                style={[styles.button, isSelected && styles.selectedButton]}
                onPress={() => {
                    setSelectedButton(buttonName);
                    onButtonPress(buttonName);
                }}
            >
                <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>{buttonName}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.pageContainer}>
                <View style={styles.buttonContainer}>
                    {renderButton("Overview")}
                    {renderButton("Lessons")}
                </View>
            </View>
        </View>
    );
};

export default ProgramDetailHeader;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        // marginTop: 200,
        backgroundColor: 'black',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 16,
        borderColor: 'grey',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 4,
    },
    pageContainer: {
        flex: 1,
        flexDirection: 'row',
        // marginBottom: 10,

        // backgroundColor: 'pink'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',

        // backgroundColor: 'green'
    },
    button: {
        // paddingHorizontal: 10,
        width: '50%',
        paddingVertical: 5,
        marginHorizontal: 5,
        alignItems: 'center'
        // borderWidth: 0.5,
        // borderRadius: 5,
        // borderColor: 'grey',

        // backgroundColor: 'orange'
    },
    buttonText: {
        color: 'grey',
        // textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: 14,
    },
    selectedButton: {
        // backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    selectedButtonText: {
        color: 'white',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    text: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
    }
});

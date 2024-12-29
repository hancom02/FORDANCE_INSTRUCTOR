import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { useState } from "react";

interface LessonMoreCardProps {
    session: Session;
    handleNav: () => void;
    onClose: () => void;
}

const LessonMoreCard: React.FC<LessonMoreCardProps> = (props) => {
    console.log("ON OPEN InstructorLessonMoreComponent");

    const {
        session,
        onClose
    } = props;

    return (
        // <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity style={styles.editContainer}>
                    <View style={styles.iconContainer}>
                        {/* <Ionicons name="create-outline" size={20} color='white'/>  */}
                    </View>
                    <Text style={styles.text}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteContainer}>
                    <View style={styles.iconContainer}>
                        {/* <Ionicons name="trash-outline" size={20} color='white'/>  */}
                    </View>
                    <Text style={styles.text}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeContainer}>
                    <View style={styles.iconContainer}>
                        {/* <Ionicons name="close-outline" size={20} color='white'/>  */}
                    </View>
                    <Text style={styles.text}>Close</Text>
                </TouchableOpacity>
            </View>
        // </View>
    )
}

export default LessonMoreCard;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        top: 10,
        left: '50%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingTop: 100,
        borderRadius: 12,
        borderWidth: 1,
    },
    contentContainer: {
        backgroundColor: 'black',
        width: '95%',
        paddingHorizontal: 10,
        // borderRadius: 12,
        // borderWidth: 1,
    },
    editContainer: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center'

    },
    deleteContainer: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center'

    },
    closeContainer: {
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: 'white'
    },
    iconContainer: {
        width: 30
    },
    text: {
        color: 'white'
    }
})
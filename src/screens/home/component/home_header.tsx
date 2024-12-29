import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
// import Ionicons from '@react-native-vector-icons/ionicons';
import MyColor from "../../../constants/color";
import Icon from 'react-native-vector-icons/FontAwesome';

import { useState } from "react";
import SizedBox from "../../../components/size_box/size_box";

// import MaterialIcons from 'react-native-material-icons';

const HomeHeader = (props) => {
    const {
        onPressButton,
        onPressPostClass,
        onPressPostProgram,
        onPressNotification,
        onPressSearch,
    } = props;

    // const MaterialIcons = require('react-native-material-icons').default as React.ElementType;
    
    const [selectedButton, setSelectedButton] = useState("My Lessons");
    const [showPopUpPost, setShowPopUpPost] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

    const handleCloseModal = () => {
        setShowPopUpPost(false);
    }

    const handleOpenModal = (event) => {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        const modalWidth = 200; // ước lượng kích thước modal
        const modalHeight = 100; // ước lượng kích thước modal

        let adjustedX = pageX;
        let adjustedY = pageY;

        // Điều chỉnh vị trí modal nếu nó bị tràn ra ngoài màn hình
        if (pageX + modalWidth > screenWidth) {
            adjustedX = screenWidth - modalWidth - 10; // 10 là khoảng cách padding
        }
        if (pageY + modalHeight > screenHeight) {
            adjustedY = screenHeight - modalHeight - 10; // 10 là khoảng cách padding
        }

        setButtonPosition({ x: adjustedX, y: adjustedY });
        setModalPosition({ x: adjustedX, y: adjustedY });
        setShowPopUpPost(true);
    };

    const renderButton = (buttonName) => {
        const isSelected = selectedButton === buttonName;
        return (
            <TouchableOpacity
                key={buttonName}
                style={[styles.button, isSelected && styles.selectedButton]}
                onPress={() => {
                    setSelectedButton(buttonName);
                    onPressButton(buttonName);
                }}
            >
                <Text style={[styles.buttonText, isSelected && styles.selectedButtonText]}>{buttonName}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.text}>MANAGE</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={(event) => handleOpenModal(event)}>
                        <Icon name="plus-circle" size={28} color='black' />
                        {showPopUpPost &&
                            <Modal
                                visible={true}
                                animationType="fade"
                                transparent={true}
                            >
                                <TouchableOpacity style={styles.overlay} onPress={handleCloseModal} />
                                <View style={[styles.modalContainer, { top: modalPosition.y, left: modalPosition.x }]}>
                                    <View style={styles.modalContent}>
                                        <TouchableOpacity style={[styles.deleteModal, { marginBottom: 10, }]} onPress={async () => {
                                            await onPressPostClass();
                                            handleCloseModal();
                                        }}>
                                            <View style={{ position: 'relative' }}>
                                                <Icon name="tablet" size={24} color="black" />
                                                <View style={{ position: 'absolute', top: 5, left: 5 }}>
                                                    <Icon name="play" size={10} color="black" />
                                                </View>
                                            </View>
                                            <Text style={styles.textDelete}>SESSION</Text>
                                        </TouchableOpacity>
                                        <SizedBox height={10} />
                                        <TouchableOpacity style={styles.deleteModal} onPress={onPressPostProgram}>
                                            <View style={{ position: 'relative' }}>
                                                <Icon name="book" size={16} color="black" />
                                            </View>
                                            <Text style={styles.textDelete}>CLASS</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressNotification()}>
                        <Icon name="bell-o" size={24} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressSearch()}>
                        <Icon name="search" size={24} color='black' />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.pageContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.buttonContainer}>
                        {renderButton("My Lessons")}
                        {renderButton("My Programs")}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default HomeHeader;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: 120,
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
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
    logoContainer: {
        width: '100%',
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
    },
    pageContainer: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'grey',
    },
    buttonText: {
        color: 'black',
        textTransform: 'uppercase',
        fontWeight: '700',
        fontSize: 14,
    },
    selectedButton: {
        backgroundColor: MyColor.primary,
        borderColor: 'white'
    },
    selectedButtonText: {
        color: 'white',
    },
    iconContainer: {
        flexDirection: 'row',
        width: '33%',
        justifyContent: 'space-between',

        // backgroundColor: 'pink'
    },
    text: {
        fontSize: 30,
        fontWeight: '700',
        color: 'black',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,

    },
    modalContent: {
        flexDirection: 'column',

    },
    deleteModal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textDelete: {
        fontSize: 12,
        fontWeight: '700',
        color: 'black',
        marginLeft: 10,
    },
});

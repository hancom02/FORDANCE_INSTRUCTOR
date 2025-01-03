// // src/ProfileScreen.js

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   SafeAreaView,
//   ImageBackground,
//   ScrollView,
// } from 'react-native';
// // import Colors from '../../../values/colors';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import {useMutation, useQuery} from 'react-query';
// // import getDetailInstructor from '../../../api/instructor/getDetail';
// // import updateInstructorApi from '../../../api/instructor/update';
// import { useAuth } from '../../../store/auth_slice';

// const AccountScreen = () => {
//   const [isEditing, setIsEditing] = useState(false);

//   const {uuid} = useAuth();
// //   const {data} = useQuery({
// //     queryKey: ['detail-instructor', id],
// //     queryFn: getDetailInstructor,
// //   });

// //   const {mutate} = useMutation({mutationFn: updateInstructorApi});

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('alexisbeauregard@gmail.com');
//   const [phoneNumber, setPhoneNumber] = useState('(+84) 6987758395');
//   const [prizes, setPrizes] = useState(
//     'Playground LA, The VMAs, The Pussycat Dolls, Tyga, Faouzia, Pia Mia, Kendrick Lamar',
//   );
//   const [introduce, setIntroduce] = useState(
//     `The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.git`,
//   );
//   const [coverPhotoUrl, setCoverPhotoUrl] = useState(
//     'https://via.placeholder.com/350x150',
//   );
//   const [avatarUrl, setAvatarUrl] = useState('https://via.placeholder.com/100');

//   const handleEdit = () => setIsEditing(true);
//   const handleSave = () => {
//     mutate({id, name, introduce, phone: phoneNumber, email});
//     setIsEditing(false);
//   };
//   const handleCancel = () => setIsEditing(false);

//   const handleEditCoverPhoto = () => {
//     // ImagePicker.showImagePicker({ mediaType: 'photo' }, response => {
//     //     if (!response.didCancel) {
//     //         setCoverPhotoUrl(response.uri);
//     //     }
//     // });
//   };

//   const handleEditAvatar = () => {
//     // ImagePicker.showImagePicker({ mediaType: 'photo' }, response => {
//     //     if (!response.didCancel) {
//     //         setAvatarUrl(response.uri);
//     //     }
//     // });
//   };
//   console.log({data});

//   useEffect(() => {
//     if (!data) return;
//     setName(data.name);
//     setEmail(data.email);
//     setPhoneNumber(data.phoneNumber);
//     setIntroduce(data.introduce);
//   }, [JSON.stringify(data)]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.profileImgContainer}>
//         <ImageBackground
//           source={{uri: coverPhotoUrl}}
//           style={styles.coverPhoto}>
//           {isEditing && (
//             <TouchableOpacity
//               style={styles.editCoverPhotoBtn}
//               onPress={handleEditCoverPhoto}>
//               <Ionicons name="image-outline" size={24} color="black" />
//             </TouchableOpacity>
//           )}
//         </ImageBackground>
//         <View style={styles.avatarContainer}>
//           <Image source={{uri: avatarUrl}} style={styles.avatar}></Image>
//           {isEditing && (
//             <TouchableOpacity
//               style={styles.editAvatarBtn}
//               onPress={handleEditAvatar}>
//               <Ionicons name="image-outline" size={24} color="black" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>
//       <View style={styles.textNameContainer}>
//         <Text style={styles.textName}>{name}</Text>
//       </View>
//       <ScrollView style={{flex: 1, width: '100%', marginTop: 10}}>
//         <View style={styles.profileBody}>
//           <Text style={styles.label}>Email</Text>
//           {isEditing ? (
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               color="black"
//             />
//           ) : (
//             <Text style={styles.text}>{email}</Text>
//           )}
//           <Text style={styles.label}>Phone number</Text>
//           {isEditing ? (
//             <TextInput
//               style={styles.input}
//               value={phoneNumber}
//               onChangeText={setPhoneNumber}
//               color="black"
//             />
//           ) : (
//             <Text style={styles.text}>{phoneNumber}</Text>
//           )}
//           {/* <Text style={styles.label}>Prizes</Text>
//           {isEditing ? (
//             <TextInput
//               style={styles.textArea}
//               value={prizes}
//               onChangeText={setPrizes}
//               multiline
//               color="black"
//             />
//           ) : (
//             <Text style={styles.text}>{prizes}</Text>
//           )} */}
//           <Text style={styles.label}>Introduce</Text>
//           {isEditing ? (
//             <TextInput
//               style={styles.textArea}
//               multiline
//               value={introduce}
//               onChangeText={setIntroduce}
//               color="black"
//             />
//           ) : (
//             <Text style={styles.text}>{introduce}</Text>
//           )}
//         </View>

//         {!isEditing && (
//           <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
//             <Text style={styles.editBtnText}>EDIT</Text>
//           </TouchableOpacity>
//         )}

//         {isEditing && (
//           <View style={styles.profileFooter}>
//             <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//               <Text style={styles.saveBtnText}>SAVE</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
//               <Text style={styles.cancelBtnText}>CANCEL</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     alignItems: 'center',
//   },
//   profileImgContainer: {
//     width: '100%',
//     height: 220,
//     position: 'relative',
//   },
//   coverPhoto: {
//     width: '100%',
//     height: 150,
//   },
//   avatarContainer: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   avatar: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     borderRadius: 50,
//   },
//   editAvatarBtn: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: Colors.primaryPupple,
//     borderRadius: 20,
//     padding: 5,
//   },
//   changeAvatarBtn: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: Colors.primaryPupple,
//     borderRadius: 20,
//     padding: 5,
//   },
//   textNameContainer: {
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//     color: 'black',
//   },
//   editCoverPhotoBtn: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: Colors.primaryPupple,
//     borderRadius: 20,
//     padding: 5,
//   },
//   editBtn: {
//     marginTop: 10,
//     backgroundColor: Colors.primaryPupple,
//     borderRadius: 20,
//     padding: 10,
//     width: '60%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   editBtnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   profileBody: {
//     width: '100%',
//     paddingHorizontal: 16,
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//     color: 'black',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     padding: 10,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     marginBottom: 5,
//     width: '100%',
//   },
//   textArea: {
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     width: '100%',
//   },
//   text: {
//     marginVertical: 5,
//     padding: 10,
//     marginBottom: 10,
//     color: 'black',
//     width: '100%',
//   },
//   profileFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignSelf: 'center',
//     width: '70%',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   saveBtn: {
//     backgroundColor: Colors.primaryPupple,
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 30,
//     width: 80,
//   },
//   saveBtnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelBtn: {
//     backgroundColor: '#bbb',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 30,
//     width: 70,
//   },
//   cancelBtnText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default AccountScreen;

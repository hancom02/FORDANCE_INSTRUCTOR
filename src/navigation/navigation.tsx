import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Ionicons from '@react-native-vector-icons/ionicons';
import { View, Text } from 'react-native';
import MyColor from '../constants/color';
import ClassScreen from '../screens/class/view/class_screen';
import HomeScreen from '../screens/home/view/home_screen';
import LoginScreen from '../screens/login/view/login_screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import AddSessionScreen from '../screens/add_session/view/add_session_screen';
import Sessionscreen from '../screens/session/view/session_screen';
import AddClassScreen from '../screens/add_class/view/add_class_screen';
import CommunityScreen from '../screens/community/view/community_screen';
import AddSessionClassScreen from '../screens/add_session_class/view/add_session_class_screen';
import SettingScreen from '../screens/setting/view/setting_screen';
import StudentListSession from '../screens/student_list_session/view/student_list_session_screen';
import ProfileScreen from '../screens/profile/view/profile_screen';
import StudentVideosScreen from '../screens/student_videos_session/view/student_video_session_screen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
        <Tab.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                    <Icon name="home" size={24} color={focused ? MyColor.primary : 'black'} />
                ),
            })}
        />
        <Tab.Screen
            name="SettingScreen"
            component={SettingScreen}
            options={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                    <Icon name="user" size={24} color={focused ? MyColor.primary : 'black'} />
                ),
            })}
        />
      </Tab.Navigator>
  );
}


export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
        />
        <Stack.Screen
          name="ClassScreen"
          component={ClassScreen}
        />
        <Stack.Screen
          name="AddClassScreen"
          component={AddClassScreen}
        />
        <Stack.Screen 
          name='AddSessionScreen'
          component={AddSessionScreen}
        />
        <Stack.Screen 
          name='AddSessionClassScreen'
          component={AddSessionClassScreen}
        />
        <Stack.Screen 
          name='SessionScreen'
          component={Sessionscreen}
        />
        <Stack.Screen 
          name='StudentVideosScreen'
          component={StudentVideosScreen}
        />
        <Stack.Screen 
          name='StudentListSession'
          component={StudentListSession}
        />
        <Stack.Screen 
          name='CommunityScreen'
          component={CommunityScreen}
        />
        <Stack.Screen 
          name='ProfileScreen'
          component={ProfileScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

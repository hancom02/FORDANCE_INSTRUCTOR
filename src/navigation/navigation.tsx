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
          name='AddSessionScreen'
          component={AddSessionScreen}
        />
        <Stack.Screen 
          name='SessionScreen'
          component={Sessionscreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

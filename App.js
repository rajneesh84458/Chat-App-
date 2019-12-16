import React, { Component } from 'react'
import 'react-native-gesture-handler'
import {Image } from 'react-native'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import {createSwitchNavigator,createAppContainer,} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import ChatScreen from './screens/ChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const AppStack = createStackNavigator({ 
    Home: HomeScreen,
    chat:ChatScreen,
   
  });
AppStack.navigationOptions =({navigation})=>{
    let tabBarVisible = navigation.state.index === 0;
     
  return {
        tabBarVisible
      }
}
  const TabNavigator =createBottomTabNavigator({
    chats:AppStack,
    Profile:ProfileScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let imageName = require('./screens/Images/chat.png');
        if (routeName === 'Profile') {
          imageName = require('./screens/Images/settings.png');
        }

        // You can return any component that you like here!
        return <Image source ={imageName} style={{width:25,resizeMode:'contain',tintColor}}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  })
const AuthStack = createStackNavigator({ Login: LoginScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: TabNavigator,
      Auth:AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
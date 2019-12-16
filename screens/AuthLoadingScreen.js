import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar, View,
} from 'react-native';
import User from '../screens/User';
import firebase from 'firebase';
export default class AuthLoadingScreen extends React.Component {
   
  componentDidMount() {
    this._bootstrapAsync();
  }
  componentWillMount()
 {
    var firebaseConfig = {
        apiKey: "AIzaSyCtFJDfhjfsARdCZ_sWGa7BDeXud-ZP_Z4",
        authDomain: "ml-ios-app.firebaseapp.com",
        databaseURL: "https://ml-ios-app.firebaseio.com",
        projectId: "ml-ios-app",
        storageBucket: "ml-ios-app.appspot.com",
        messagingSenderId: "1019071282651",
        appId: "1:1019071282651:web:93e0cc9cc325f799803bfe",
        measurementId: "G-T1HV79EK4R"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
 }
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
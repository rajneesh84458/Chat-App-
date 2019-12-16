import React, { Component } from 'react'
import { AsyncStorage ,Alert,Text, View ,SafeAreaView,StatusBar,StyleSheet,TextInput,TouchableOpacity} from 'react-native'
import User from '../screens/User'
import styles from '../screens/constants/styles';
import firebase from 'firebase'
export default class LoginScreen extends Component {
    static navigationOptions = {
        header:null
      };
  state ={
          phone:'',
          name:'',
  }
  handleChange = key => val =>{
     this.setState({[key]:val})
  }

componentDidMount () {
  AsyncStorage.getItem('userPhone')
  .then(val =>{
        if(val){
            this.setState({phone:val})
        }
  })
   
}

  submitForm = async() =>{
      if(this.state.phone.length < 10)
      {
        Alert.alert('Error',"wrong number")
      }
      else if (this.state.name.length < 5){
          Alert.alert("wrong name")
      }
        else {
          
           await AsyncStorage.setItem('userPhone',this.state.phone)
            User.phone =this.state.phone;
            firebase.database().ref('users/' +User.phone).set({name:this.state.name})
            this.props.navigation.navigate('App')
        }
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle ="dark-content"/>
         <TextInput  
                autoCapitalize ="characters"
                placeholder="Enter Phone Number" 
                style={styles.input}
                keyboardType="number-pad"
                value={this.state.phone}
                onChangeText ={this.handleChange('phone')}
                />
         <TextInput  
              
                placeholder="Enter Name" 
                style={styles.input}
                keyboardType="number-pad"
                value={this.state.name}
                onChangeText ={this.handleChange('name')}
                />

                <TouchableOpacity onPress ={this.submitForm}>
                  <Text style ={{fontSize:20,color:'green'}}>Enter</Text>
                </TouchableOpacity>

      </SafeAreaView>
    )
  }
}


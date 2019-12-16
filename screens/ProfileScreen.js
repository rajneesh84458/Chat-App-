import React, { Component } from 'react'
import { Image, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, AsyncStorage,ActivityIndicator } from 'react-native'
import firebase from 'firebase';
import styles from '../screens/constants/styles'
import User from './User';
import ImagePicker from 'react-native-image-picker'

export default class ProfileScreen extends Component {

    static navigationOptions = {
        title: "Profile"
    }
    state = {
        name: User.name,
        imageSource :require('./Images/user.png'),
        upload:false
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }
    changeName = async () => {
        if (this.state.name.length < 3) {
            Alert.alert("Error", "Invalid name Entered")
        }
        else if (User.name !== this.state.name) {
          
            User.name = this.state.name;
           // this.updateUser()
            Alert.alert("Success", "Name changed successfull")
        }
 
    }

    changeImage = () => {
        const options ={
            quality : 0.7 , allowsEditing :true ,mediaType :'photo',noData:true,
            storageOptions :{
                skipBackup:true,waitUntilSaved :true,path:'images',cameraRoll:true
            }

        }
        ImagePicker.showImagePicker(options , response =>{
            if(response.error) {
                console.log(error)
            }
            else if(!response.didCancel) {
                this.setState({
                         upload:true,
                         imageSource:{uri:response.uri}
                },this.uploadFile)
            }
        })
    }
    uploadFile = async () =>{
        const file = await this.uriToBlob(this.state.imageSource.uri);
          firebase.storage().ref(`profile_pictures/${User.phone}.png`)
        .put(file)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url =>this.setState({upload:false,imageSource:{uri:url} }))
        .catch(error =>{
            this.setState({
                   upload:false,
                   imageSource:require('./Images/user.png')
            });
            Alert.alert("Error","Error on image upload");
        })
    }

    uriToBlob = (uri) => {
             return  new Promise((resolve,reject) =>{
                const xhr = new XMLHttpRequest();
                      xhr.onload = function(){
                          resolve(xhr.response);
                      };

                      xhr.onerror = function(){
                            reject(new Error('Error on upload image'))
                      };

                      xhr.responseType ='blob';
                      xhr.open('GET',uri,true);
                      xhr.send(null);
             })
    }
    logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress ={this.changeImage}>
                    {
                 this.state.upload ? <ActivityIndicator size="large"/> :
                  <Image source={this.state.imageSource}
                               style={{ borderRadius:100,width: 100, height: 100, resizeMode: 'cover', marginBottom: 10 }} />
                    }
                   

                </TouchableOpacity>
                <Text style={{ fontSize: 20 }}>{User.name}</Text>
                <Text style={{ fontSize: 20 }}>{User.phone}</Text>

                <TextInput style={styles.input}
                    autoCapitalize="characters"
                    keyboardType="number-pad"
                    value={this.state.name}
                    onChangeText={this.handleChange('name')}
                />

                <TouchableOpacity onPress={this.changeName}>
                    <Text style={{ fontSize: 20, color: 'blue' }}>Change Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.logOut}>
                    <Text style={{ fontSize: 20, color: 'blue' }}>LogOut</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

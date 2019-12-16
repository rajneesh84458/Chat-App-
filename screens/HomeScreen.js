import React from 'react'
import { Text, SafeAreaView, TouchableOpacity, FlatList,Dimensions,Image } from 'react-native'
import User from './User';
import firebase from 'firebase';
import styles from '../screens/constants/styles';
export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    };
    state = {
        users: [],
        dbRef : firebase.database().ref('users')
    }

    componentDidMount() {
       
        this.state.dbRef.on('child_added', (val) => {
            let person = val.val();
            person.phone = val.key;
            if (person.phone === User.phone) {
                User.name = person.name
               // User.image = person.image ? person.image : null
            }
            else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })



    }


    renderRow = ({ item }) => {
        return (
            <TouchableOpacity style={{ flexDirection:"row",alignItems:'center',borderBottomWidth: 0.3, padding: 10,borderBottomColor:'grey' }}
                onPress={() => this.props.navigation.navigate('chat', item)}>
                    <Image source ={item.image ? {uri:item.image} : require('./Images/user.png')}
                            style ={{width:40,height:40,resizeMode:'cover',borderRadius:32,marginRight:10}}/>
                <Text style={{ width:400,fontSize: 20,paddingHorizontal:10 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        const {height} =Dimensions.get('window')
        return (
            <SafeAreaView style={styles.container}>
                <FlatList style={{height:height}}
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                    ListHeaderComponent ={()=><Text style={{fontSize:30,marginVertical:20,color:'red',fontWeight:'bold',marginLeft:10}}>Chats</Text>}
                />
            </SafeAreaView>
        )
    }
}

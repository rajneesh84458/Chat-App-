import React, { Component } from 'react'
import { Platform, Animated, Text, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity, View, FlatList, Dimensions,Image } from 'react-native'
import styles from '../screens/constants/styles'
import User from './User';
import firebase from 'firebase';

const isIos = Platform.OS === "ios"
export default class ChatScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam("name", null)
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam("name"),
                phone: props.navigation.getParam("phone")
            },
            textMessage: '',
            messageList: [],
            dbRef: firebase.database().ref('messages')
        }

        this.keyboardHeight = new Animated.Value(0);
        this.bottomPadding = new Animated.Value(60);
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgId = this.state.dbRef.child(User.phone).child(this.state.person.phone).push().key;
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }

            updates[User.phone + '/' + this.state.person.phone + '/' + msgId] = message;
            updates[this.state.person.phone + '/' + User.phone + '/' + msgId] = message;

            this.state.dbRef.update(updates);
            this.setState({ textMessage: '' })
        }
    }


    convertTime = (time) => {
        const d = new Date(time)
        const c = new Date();

        let result = (d.getHours() < 10 ? 0 : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? 0 : '') + d.getMinutes();
        if (c.getDay() !== d.getDay()) {
            result = d.getDay() + '' + d.getMonth() + '' + result;
        }
        return result;
    }
    componentDidMount() {

        this.keyboardShowListener = Keyboard.addListener(isIos ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => this.keyboardEvent(e, true));
        this.keyboardHideListener = Keyboard.addListener(isIos ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => this.keyboardEvent(e, false));

        this.state.dbRef.child(User.phone).child(this.state.person.phone).on('child_added', (value) => {
            this.setState((prevState) => {
                return {
                    messageList: [...prevState.messageList, value.val()]
                }
            })
        })
    }

    componentWillUnmount() {
        this.state.dbRef.off();
        this.keyboardShowListener.remove();
        this.keyboardHideListener.remove();
    }
    keyboardEvent = (event,isShow) => {
        let heightOs = isIos ? 60 : 120 ;
        let  bottomOs = isIos ? 120 : 140;
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue:isShow ?heightOs : 0
            }),

            Animated.timing(this.bottomPadding, {
                duration: event.duration,
                toValue: isShow ? bottomOs : 60
            })
        ]).start();
    }

    renderRow = ({ item }) => {

        return (
            <View
                style={{
                    flexDirection: 'row', maxWidth: '60%',
                    alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                    backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
                    borderRadius: 5,
                    marginBottom: 10
                }}>
                <Text style={{ padding: 7, fontSize: 20, color: 'white' }}>{item.message}</Text>
                <Text style={{ padding: 5, fontSize: 12, color: '#eee' }}>{this.convertTime(item.time)}</Text>
            </View>
        )
    }

    render() {
        let { height } = Dimensions.get('window')
        return (
            <KeyboardAvoidingView behavior="height" style={{ flex: 1 }} enabled>
                <Animated.View style={[styles.bottomBar,{bottom:this.keyboardHeight}]}>
                    <TextInput style={styles.inputMessage}
                        keyboardType="name-phone-pad"
                        value={this.state.textMessage}
                        placeholder="Type message"
                        onChangeText={this.handleChange('textMessage')} />
                          
                    <TouchableOpacity onPress={this.sendMessage}
                        style={styles.sendButton}>
                       <Image source ={require('./Images/send.png')}
                               style={{tintColor:'white',resizeMode:'contain',height:20}}/>
                    </TouchableOpacity>
                </Animated.View>
                <FlatList
                    ref ={ref => this.FlatList = ref}
                    onContentSizeChange ={()=>this.FlatList.scrollToEnd({animated:true })}
                    onLayout ={()=>this.FlatList.scrollToEnd({animated:true })}
                    style={{ paddingTop: 5, height,paddingHorizontal:5 }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent ={<Animated.View style={{height:this.bottomPadding}}/>}
                />

            </KeyboardAvoidingView>
        )
    }
}

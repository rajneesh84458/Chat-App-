import React, { Component } from 'react'
import { StyleSheet } from 'react-native'

const styles =StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center'
    },
    input:{
         width:'80%',
         height:50,
         borderColor:'grey',
         borderWidth:1,
         padding:10,
         marginBottom:10,
         borderRadius:10,
         fontSize:20
    },
    inputMessage:{
         width:'85%',
         height:50,
         borderColor:'grey',
         borderWidth:1,
         padding:10,
         marginBottom:10,
         borderRadius:10,
         fontSize:20,
         borderRadius:30
    },
    bottomBar :
    { 
      flexDirection: 'row',
    alignItems: 'center',
     padding:5,
     position:'absolute',
     bottom:0,
     left:0,
     right:0,
     zIndex:2,
     height:60
    },
    sendButton:
    { marginBottom: 10,
       marginLeft: 5,
       height:40,
       width:40,
       paddingTop:10,
       paddingLeft:5,
       backgroundColor:'#2196F3',
       borderRadius:20 ,
       alignItems:'center'
      }
  })

  export default styles;

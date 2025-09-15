import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Toast = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
      <View style={{
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        shadowColor: '#000'
      }} >
        <Text style={{color: 'black', fontSize: 10,}}>This is a toast message!</Text>
      </View>
    </View>
  )
}


export default Toast

const styles = StyleSheet.create({})
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = (
    {
        onPress, 
        color = Colors.primaryLight, 
        backgroundColor = Colors.primary,
      
        paddingTop = 16,
        paddingBottom = 16,
        paddingLeft = 8,
        paddingRight = 8,
        marginRight,
        marginLeft,
        
    }
) => {
  return (
  
      <View style={{backgroundColor: backgroundColor, paddingTop: paddingTop, paddingBottom: paddingBottom, marginRight: marginRight, marginLeft: marginLeft, borderRadius: 100, alignItems: 'center', justifyContent: 'center'}}>
                  <ActivityIndicator color="black" />
        </View>
  )
}


export default Loading

const styles = StyleSheet.create({})
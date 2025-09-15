import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'

const RootLayoutIndex = () => {
  return (
    <View>
      <Redirect href="./onboarding" />
    </View>
  )
}

export default RootLayoutIndex

const styles = StyleSheet.create({})
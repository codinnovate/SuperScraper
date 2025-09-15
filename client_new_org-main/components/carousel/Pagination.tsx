import { StyleSheet, Text, View, Dimensions, } from 'react-native'
import React from 'react'
import Animated,{ Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated'
import Colors from '@/styles/colors'

const {width} = Dimensions.get('screen')


const Pagination = ({data, paginationIndex, scrollX}) => {

  return (
    <View  style={styles.carouseldotsWrapper}>
        {data.map((_, index) => {
            return (
               
              <Animated.View 
                key={index} 
                style={[
                  styles.dot,
                  {backgroundColor: paginationIndex === index ? Colors.primary  : 'rgba(57, 181, 74, 0.2)'}]}
              />
            )
          }
        )}
    </View> 
  )
}

export default Pagination

const styles = StyleSheet.create({
    carouseldotsWrapper: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    dot: {
        height: 5,
        width: 5,
        borderRadius: 5,
        marginHorizontal: 2
    }
})
import { Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

export default function Button({
    title, 
    children, 
    onPress, 
    color, 
    style
}) {
  return (
    <Pressable 
        onPress={onPress}
        style={{
            backgroundColor: color,
            ...styles.button,
            ...style
        }}>
            { children ? children : 
            <Text style={styles.buttonTitle}>{title}</Text> }
    </Pressable>
  )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        alignItems:'center'
    },
    buttonTitle: {
        textAlign: 'center',
        color: "#fff"
    }
})
import Colors from "@/styles/colors";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
  onPress?: () => void;
  color?: string;
  backgroundColor?: string;
  title: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginRight?: number;
  marginLeft?: number;
  fontFamily?: string;
  fontSize?: number;
  style?: any;
}

const Button = ({
  onPress,
  color = Colors.primaryLight,
  backgroundColor = Colors.primary,
  title,
  paddingTop = 16,
  paddingBottom = 16,
  paddingLeft = 8,
  paddingRight = 8,
  marginRight,
  marginLeft,
  fontFamily,
  fontSize = 14,
  style
}: Props) => {
  return (
    <Pressable
      style={[
        {
          backgroundColor: backgroundColor,
          paddingTop: paddingTop,
          paddingBottom: paddingBottom,
          paddingLeft: paddingLeft,
          paddingRight: paddingRight,
          marginRight: marginRight,
          marginLeft: marginLeft,
        },
        styles.button,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          color: color,
          fontFamily: fontFamily,
          fontSize: fontSize,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 100,
  },
});

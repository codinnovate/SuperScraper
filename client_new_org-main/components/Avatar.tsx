import Colors from "@/styles/colors";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  StyleSheet,
} from "react-native";

interface AvatarProps {
  uri?: string;
  source?: ImageSourcePropType; // Add explicit source prop for local images
  onPress?: () => void;
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  source,
  onPress,
  width = 32,
  height = 32,
  borderRadius = 999,
  borderWidth,
  borderColor,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Image
        style={[
          styles.avatar,
          {
            width,
            height,
            borderRadius,
            borderWidth,
            borderColor,
          } as ImageStyle,
        ]}
        source={
          source
            ? source
            : uri
            ? { uri }
            : require("@/assets/images/placeholder.png")
        }
        defaultSource={require("@/assets/images/placeholder.png")}
        resizeMode="contain"
      />
    </Pressable>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: Colors.primary,
  },
});

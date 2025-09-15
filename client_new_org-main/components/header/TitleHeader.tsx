import Colors from "@/styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Title } from "../../styles/typography";

interface Props {
  title: string;
  onPress?: () => void;
  backArrow?: boolean;
}

const TitleHeader = ({ title, onPress, backArrow }: Props) => {
  return (
    <View style={styles.wrapper}>
      {backArrow && (
        <Pressable
          onPress={onPress}
          style={{
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={16}
            color={Colors.backArrow}
          />
        </Pressable>
      )}

      <View style={styles.titleWrapper}>
        <Title>{title}</Title>
      </View>
    </View>
  );
};

export default TitleHeader;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
    marginLeft: -24,
  },
});

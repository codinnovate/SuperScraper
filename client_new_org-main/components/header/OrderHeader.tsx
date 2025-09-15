import { useCurrentUser } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Title } from "../../styles/typography";
import Avatar from "../Avatar";

interface OrderHeaderProps {
  title: string;
  backArrow?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  title,
  onPress,
  backArrow,
}) => {
  const { user } = useCurrentUser();

  return (
    <View style={styles.wrapper}>
      {backArrow && (
        <Pressable
          onPress={onPress}
          style={{ alignItems: "center", justifyContent: "center", padding: 8 }}
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
      <Avatar
        uri={user?.profile_image_url}
        onPress={() => router.push("/stylist/account")}
      />
    </View>
  );
};

export default OrderHeader;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

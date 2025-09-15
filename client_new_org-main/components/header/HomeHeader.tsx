import { useCurrentUser } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import Colors from "@/styles/colors";
import Sizes from "@/styles/size";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Title } from "../../styles/typography";
import Avatar from "../Avatar";

interface Props {
  title: string;
  onPress?: () => void;
}

export const HomeHeader = ({ title, onPress }: Props) => {
  const { user } = useCurrentUser();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Title>Hi, {title}</Title>
      <View style={styles.avatarAndNotificationIconWrapper}>
        <Pressable onPress={onPress} style={styles.notificationWrapper}>
          <Ionicons name="notifications-outline" size={20} color="black" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>
                {unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
        <Avatar
          uri={user?.profile_image_url}
          onPress={() => {
            if (user?.user_type === "customer") {
              router.push("/customer/account");
            } else if (user?.user_type === "stylist") {
              router.push("/stylist/account");
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  NavBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  NavBarTitle: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatarAndNotificationIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Sizes.spacing.md,
  },

  notificationWrapper: {
    padding: Sizes.spacing.xs,
    position: "relative",
    // backgroundColor:'red'
  },

  
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});




// NotificationModal.tsx
import TitleHeader from "@/components/header/TitleHeader";
import {
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/use-notifications";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Heading } from "@/styles/typography";
import { useTransformedNotificationMessage } from "@/utils/notificationUtils";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationModal: React.FC = () => {
  const { id } = useLocalSearchParams();

  const { notifications } = useNotifications();
  const { markAsRead } = useMarkNotificationAsRead();

  const parsed = notifications.find((n) => n.id === id);
  const transformedMessage = useTransformedNotificationMessage(parsed?.message || "");

  // Mark notification as read if it exists
  useEffect(() => {
    if (parsed && !parsed.isRead) {
      markAsRead(parsed.id);
    }
  }, [parsed, markAsRead]);

  if (!parsed) {
    return (
      <SafeAreaView>
        <Text>Notification.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TitleHeader
        title="Notifications"
        backArrow
        onPress={() => router.back()}
      />

      <View style={{ backgroundColor: Colors.primaryLight }}>
        <Heading
          style={[{ fontFamily: "SEMIBOLD" }, styles.notificationHeading]}
        >
          {parsed.title}
        </Heading>
        <Heading style={[{ fontFamily: "REGULAR" }, styles.notificationBody]}>
          {transformedMessage}
        </Heading>
      </View>
    </SafeAreaView>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationHeading: {
    marginBottom: 20,
    marginTop: 40,
    color: Colors.primaryDark,
  },
  notificationBody: {
    lineHeight: 15,
    marginTop: 5,
  },
});

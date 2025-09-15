import { ChatWebSocketProvider } from "@/contexts/ChatWebSocketContext";
import { useCurrentUser } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const ProtectedLayout = () => {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user email is verified
      if (!user.is_email_confirmed) {
        // Redirect to email verification page
        router.replace({
          pathname: "/auth/verify-email",
          params: {
            email: user.email,
            role: user.user_type,
          },
        });
      }
    }
  }, [user, isLoading, router]);

  // Show loading while checking user status
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primaryLight,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Don't render the protected content if email is not verified
  if (user && !user.is_email_confirmed) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.primaryLight,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ChatWebSocketProvider>
      <Slot />
    </ChatWebSocketProvider>
  );
};

export default ProtectedLayout;

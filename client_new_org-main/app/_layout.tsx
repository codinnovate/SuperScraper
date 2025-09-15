import { EmailVerificationProvider } from "@/contexts/EmailVerificationContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PopupProvider } from "@/contexts/PopupContext";
import { UserProvider } from "@/contexts/UserContext";
import { useLocalNotifications } from "@/hooks/useLocalNotifications";
import { setDeviceToken } from "@/lib/storage/secure-store";
import Colors from "@/styles/colors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SWRConfig } from "swr";

// Separate component that uses push notifications inside the provider context
const PushNotificationHandler = () => {
  const { usePushNotifications } = require("@/hooks/usePushNotifications");
  const { expoPushToken } = usePushNotifications();
  const { cancelAllLocalNotifications } = useLocalNotifications();
  
  useEffect(() => {
    if (expoPushToken?.data) {
      setDeviceToken(expoPushToken.data);
    }
  }, [expoPushToken]);

  // Handle app state changes for local notifications
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        // App is becoming active - cancel pending local notifications
        // since the user is now actively using the app
        cancelAllLocalNotifications();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription?.remove();
  }, [cancelAllLocalNotifications]);

  return null; // This component doesn't render anything
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    BOLD: require("../assets/fonts/ClashDisplay-Bold.otf"),
    EXTRALIGHT: require("../assets/fonts/ClashDisplay-Extralight.otf"),
    LIGHT: require("../assets/fonts/ClashDisplay-Light.otf"),
    MEDIUM: require("../assets/fonts/ClashDisplay-Medium.otf"),
    REGULAR: require("../assets/fonts/ClashDisplay-Regular.otf"),
    SEMIBOLD: require("../assets/fonts/ClashDisplay-Semibold.otf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Show loading screen while checking auth or loading fonts
  if (!loaded && !error) {
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
    <SWRConfig
      value={{
        provider: () => new Map(),
        revalidateOnMount: true,
        revalidateOnFocus: true, // Enable focus revalidation for tab switching
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
        dedupingInterval: 1000, // Reduce deduping interval for better tab responsiveness
        focusThrottleInterval: 2000, // Reduce throttle for faster tab response
        refreshInterval: 0,
        errorRetryInterval: 5000,
        isVisible: () => {
          return true;
        },
        initFocus(callback) {
          let appState = AppState.currentState;

          const onAppStateChange = (
            nextAppState: import("react-native").AppStateStatus
          ) => {
            /* If it's resuming from background or inactive mode to active one */
            if (
              appState.match(/inactive|background/) &&
              nextAppState === "active"
            ) {
              callback();
            }
            appState = nextAppState;
          };

          // Subscribe to the app state change events
          const subscription = AppState.addEventListener(
            "change",
            onAppStateChange
          );

          return () => {
            subscription.remove();
          };
        },
      }}
    >
      <StatusBar barStyle={"dark-content"} />

      <PopupProvider>
        <NotificationProvider>
          <UserProvider>
            <EmailVerificationProvider>
              <PushNotificationHandler />
              <Stack screenOptions={{ headerShown: false }} />
            </EmailVerificationProvider>
          </UserProvider>
        </NotificationProvider>
      </PopupProvider>
    </SWRConfig>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});

import { useNotificationContext } from "@/contexts/NotificationContext";
import { useCurrentUser } from "@/hooks/use-auth";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
    const { registerDeviceToken, unregisterDeviceToken } = useNotificationContext();
    const { user } = useCurrentUser();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken>();
    const [notification, setNotification] = useState<Notifications.Notification>();

    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                console.warn("Failed to get push token for push notification");
                return;
            }

            try {
                // Get project ID from Constants
                const projectId = Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;

                if (!projectId) {
                    console.warn("Project ID not found in expo config");
                    return;
                }

                token = await Notifications.getExpoPushTokenAsync({
                    projectId,
                });
            } catch (error) {
                console.error("Error getting push token:", error);
                return;
            }
        } else {
            console.warn("Must use physical device for Push Notifications");
        }

        return token;
    }

    // Register device token with backend when token is available and user is logged in
    useEffect(() => {
        if (expoPushToken && user?.id) {
            console.log("🔄 Registering device token with backend...", {
                token: expoPushToken.data,
                platform: Platform.OS,
                userId: user.id
            });
            
            registerDeviceToken(
                expoPushToken.data,
                Platform.OS as "ios" | "android",
                user.id
            ).then(() => {
                console.log("✅ Device token registered successfully");
            }).catch((error) => {
                console.error("❌ Failed to register device token:", error);
            });
        }
    }, [expoPushToken, user?.id, registerDeviceToken]);

    // Unregister device token when user logs out
    useEffect(() => {
        if (expoPushToken && !user?.id) {
            console.log("User logged out, should unregister device token");
        }
    }, [expoPushToken, user?.id]);

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => {
                if (token) {
                    console.log("📲 Expo Push Token:", token);
                    setExpoPushToken(token);
                } else {
                    console.warn("Failed to get push token");
                }
            })
            .catch((error) => {
                console.error("Error registering for push notifications:", error);
            });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("📬 Notification received:", notification);
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log("📬 Notification response received:", response);
                
                // Handle notification tap to navigate to appropriate screen
                const data = response.notification.request.content.data;
                
                if (data?.type === "chat_message" && data?.conversation_id) {
                    // Navigate to chat conversation
                    router.push(`/customer/messages/${data.conversation_id}` as any);
                } else if (data?.type === "order_update" && data?.order_id) {
                    // Navigate to order details
                    router.push(`/customer/orders/${data.order_id}` as any);
                }
            });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return {
        expoPushToken,
        notification,
    };
};
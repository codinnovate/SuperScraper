import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export const useLocalNotifications = () => {
    useEffect(() => {
        // Set up notification handler
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });

        // Handle notification responses
        const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data;
                console.log("📱 Notification tapped:", data);

                if (data?.type === "chat_message") {
                    // Navigate to the specific chat conversation
                    if (data.conversation_id) {
                        // The router will automatically handle the correct path based on user role
                        // since we're using dynamic routing
                        router.push({
                            pathname: "/messages/[id]",
                            params: { id: data.conversation_id }
                        });
                    }
                } else if (data?.type === "order_update") {
                    // Navigate to order details or order list
                    if (data.order_id) {
                        // The router will automatically handle the correct path based on user role
                        router.push({
                            pathname: "/orders/[id]",
                            params: { id: data.order_id }
                        });
                    }
                }
            }
        );

        return () => subscription.remove();
    }, []);

    const scheduleMessageNotification = async (
        senderName: string,
        message: string,
        conversationId: string,
        messageType: string = "text"
    ) => {
        let body = "";
        let title = `New message from ${senderName}`;

        // Customize notification based on message type
        switch (messageType) {
            case "text":
                body = message.length > 100 ? `${message.substring(0, 100)}...` : message;
                break;
            case "file":
                body = "📎 Sent a file";
                title = `File from ${senderName}`;
                break;
            case "audio":
                body = "🎵 Sent a voice message";
                title = `Voice message from ${senderName}`;
                break;
            case "video":
                body = "🎥 Sent a video";
                title = `Video from ${senderName}`;
                break;
            case "image":
                body = "🖼️ Sent a photo";
                title = `Photo from ${senderName}`;
                break;
            case "order":
                body = "📋 Sent an order update";
                title = `Order update from ${senderName}`;
                break;
            default:
                body = `Sent a ${messageType}`;
        }

        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: {
                    conversation_id: conversationId,
                    type: "chat_message"
                },
                sound: "default", // Play default notification sound
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null,
        });
    };

    const scheduleOrderNotification = async (
        title: string,
        message: string,
        orderId: string
    ) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body: message,
                data: {
                    order_id: orderId,
                    type: "order_update"
                },
                sound: "default", // Play default notification sound
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null,
        });
    };


    const cancelAllLocalNotifications = async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
    };

    const cancelNotificationsByType = async (type: string) => {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

        for (const notification of scheduledNotifications) {
            if (notification.content.data?.type === type) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
    };

    return {
        scheduleMessageNotification,
        scheduleOrderNotification,
        cancelAllLocalNotifications,
        cancelNotificationsByType,
    };
};

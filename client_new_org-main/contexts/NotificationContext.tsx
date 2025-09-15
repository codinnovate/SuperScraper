import { useLocalNotifications } from "@/hooks/useLocalNotifications";
import {
    registerDeviceTokenApi,
    sendBulkNotificationApi,
    sendGigNotificationApi,
    testNotificationApi,
    unregisterDeviceTokenApi
} from "@/lib/api/notifications";
import React, { createContext, ReactNode, useContext } from "react";

interface NotificationContextType {
  scheduleMessageNotification: (
    senderName: string,
    message: string,
    conversationId: string,
    messageType?: string
  ) => Promise<void>;
  scheduleOrderNotification: (
    title: string,
    message: string,
    orderId: string
  ) => Promise<void>;
  sendGigNotification: (
    recipientId: string,
    title: string,
    message: string,
    gigId: string,
    gigType: "gig_created" | "gig_accepted" | "gig_rejected"
  ) => Promise<void>;
  sendBulkNotification: (
    recipientIds: string[],
    title: string,
    message: string,
    data: any
  ) => Promise<void>;
  testNotification: (
    recipientId: string,
    title: string,
    message: string,
    data?: any
  ) => Promise<void>;
  registerDeviceToken: (
    deviceToken: string,
    platform: "ios" | "android",
    userId: string
  ) => Promise<void>;
  unregisterDeviceToken: (
    deviceToken: string,
    userId: string
  ) => Promise<void>;
  cancelAllLocalNotifications: () => Promise<void>;
  cancelNotificationsByType: (type: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const {
    scheduleMessageNotification,
    scheduleOrderNotification,
    cancelAllLocalNotifications,
    cancelNotificationsByType,
  } = useLocalNotifications();

  const sendGigNotification = async (
    recipientId: string,
    title: string,
    message: string,
    gigId: string,
    gigType: "gig_created" | "gig_accepted" | "gig_rejected"
  ) => {
    try {
      await sendGigNotificationApi({
        recipient_id: recipientId,
        title,
        body: message,
        data: {
          gig_id: gigId,
          type: gigType,
        },
      });
    } catch (error) {
      console.error("Failed to send gig notification:", error);
    }
  };

  const sendBulkNotification = async (
    recipientIds: string[],
    title: string,
    message: string,
    data: any
  ) => {
    try {
      await sendBulkNotificationApi({
        recipient_ids: recipientIds,
        title,
        body: message,
        data,
      });
    } catch (error) {
      console.error("Failed to send bulk notification:", error);
    }
  };

  const testNotification = async (
    recipientId: string,
    title: string,
    message: string,
    data?: any
  ) => {
    try {
      await testNotificationApi({
        recipient_id: recipientId,
        title,
        body: message,
        data,
      });
    } catch (error) {
      console.error("Failed to send test notification:", error);
    }
  };

  const registerDeviceToken = async (
    deviceToken: string,
    platform: "ios" | "android",
    userId: string
  ) => {
    try {
      await registerDeviceTokenApi({
        device_token: deviceToken,
        platform,
        user_id: userId,
      });
      console.log("Device token registered successfully");
    } catch (error) {
      console.error("Failed to register device token:", error);
    }
  };

  const unregisterDeviceToken = async (
    deviceToken: string,
    userId: string
  ) => {
    try {
      await unregisterDeviceTokenApi({
        device_token: deviceToken,
        user_id: userId,
      });
      console.log("Device token unregistered successfully");
    } catch (error) {
      console.error("Failed to unregister device token:", error);
    }
  };

  const contextValue: NotificationContextType = {
    scheduleMessageNotification,
    scheduleOrderNotification,
    sendGigNotification,
    sendBulkNotification,
    testNotification,
    registerDeviceToken,
    unregisterDeviceToken,
    cancelAllLocalNotifications,
    cancelNotificationsByType,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

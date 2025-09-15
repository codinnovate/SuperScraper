import { NotificationResponse } from "@/types/notification.types";
import apiClient from "./api-client";

export const getNotificationsApi = async (
    params: { page?: number; limit?: number } = { page: 1, limit: 20 }
) => {
    const response = await apiClient.get<NotificationResponse>("/notifications", {
        params,
    });
    return response.data;
}

export const markNotificationAsReadApi = async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
}

export const markAllNotificationsAsReadApi = async () => {
    const response = await apiClient.put("/notifications/read-all");
    return response.data;
}

export const deleteNotificationApi = async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
}

// Register device token for push notifications
export const registerDeviceTokenApi = async (payload: {
    device_token: string;
    platform: "ios" | "android";
    user_id: string;
}) => {
    const response = await apiClient.post("/notifications/device-token/register", payload);
    return response.data;
};

// Unregister device token
export const unregisterDeviceTokenApi = async (payload: {
    device_token: string;
    user_id: string;
}) => {
    const response = await apiClient.delete("/notifications/device-token/unregister", {
        data: payload
    });
    return response.data;
};

// Send gig notification (for stylist gigs)
export const sendGigNotificationApi = async (payload: {
    recipient_id: string;
    title: string;
    body: string;
    data: {
        gig_id: string;
        type: "gig_created" | "gig_accepted" | "gig_rejected";
    };
}) => {
    const response = await apiClient.post("/notifications/gig", payload);
    return response.data;
};

// Send bulk notification to multiple users
export const sendBulkNotificationApi = async (payload: {
    recipient_ids: string[];
    title: string;
    body: string;
    data: {
        type: string;
        [key: string]: any;
    };
}) => {
    const response = await apiClient.post("/notifications/bulk", payload);
    return response.data;
};

// Test notification (development only)
export const testNotificationApi = async (payload: {
    recipient_id: string;
    title: string;
    body: string;
    data?: any;
}) => {
    const response = await apiClient.post("/notifications/test", payload);
    return response.data;
};
import { getNotificationsApi, markNotificationAsReadApi } from "@/lib/api/notifications";
import useSWR from "swr";

export const useNotifications = (
    params: { page?: number; limit?: number } = { page: 1, limit: 20 }
) => {
    const { data, error, isLoading, mutate } = useSWR(
        [`notifications`, params],
        () => getNotificationsApi(params)
    );

    return {
        notifications: data?.notifications || [],
        unreadCount: data?.unread_count || 0,
        error: error?.message || null,
        isLoading,
        mutate,
    };
}

export const useMarkNotificationAsRead = () => {

    const markAsRead = async (id: string) => {
        await markNotificationAsReadApi(id);
    };

    return { markAsRead };
}
export type NotificationType =
    | "order_offer"
    | "order_status"
    | "bid_offer"
    | "bid_status"
    | "review"
    | "message"
    | "general";

export interface NotificationItem {
    id: string;
    user_id?: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    related_id?: string;
    isRead: boolean;
    priority: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface NotificationResponse {
    notifications: NotificationItem[];
    unread_count: number;
    page: number;
    limit: number;
}
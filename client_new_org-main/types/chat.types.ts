export type ConversationType = 'user_to_user' | 'group' | string;

export type MessageType = 'text' | 'audio' | 'video' | 'file' | 'order';

export type AllowedFileType =
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'application/pdf'
    | 'text/plain'
    | 'video/mp4'
    | 'video/webm'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/mp3'
    | 'audio/ogg'
    | 'audio/webm'
    | string;

export interface AiMonitorConfig {
    is_enabled: boolean;
    sensitivity_level: 'low' | 'medium' | 'high' | string;
    alert_threshold: number;
    monitored_keywords: string[];
    alert_webhook_url: string;
    notify_admins: boolean;
}

export interface LastMessage {
    message_id: string;
    content: string;
    sender_id: string;
    message_type: MessageType;
    created_at: string;
    read_by?: {
        user_id: string;
        read_at: string;
    }[] | null;
}

export interface ParticipantDetail {
    user_id: string;
    name: string;
    profile_image_url: string;
    role: string;
    joined_at: string;
}

export interface ConversationParticipants {
    stylist?: string;
    customer?: string;
    dummy?: string;
}

export interface ChatData {
    id: string;
    participants: string[];
    participants_map: ConversationParticipants;
    conversation_type: ConversationType;
    ai_monitor_config: AiMonitorConfig;
    participant_details: ParticipantDetail[];
    last_message: LastMessage;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    total_violations: number;
    risk_level: 'low' | 'medium' | 'high' | string;
}

export interface ChatResponse {
    data: ChatData;
}


// ==================================
export interface ChatListResponse {
    data: ChatData[];
}


// ==================================
export interface SenderInfo {
    name: string;
    avatar: string;
    role: string;
}

export interface AiAnalysis {
    overall_risk_score: number;
    off_platform_risk_score: number;
    detected_flags: string[] | null;
    extracted_entities: string[] | null;
    sentiment_score: number;
    language_detected: string;
    toxicity_score: number;
    analyzed_at: string;
    processing_time_ms: number;
}

export interface ChatOrder {
    id: string;
    customer_id: string;
    customer_name: string;
    stylist_id: string;
    conversation_id: string;
    order_details: {
        out_fit_fee: string;
        delivery_fee: string;
        delivery_location: string;
        delivery_date: string;
        discount_amount?: string;
        delivery_note?: string;
        delivery_time?: string;
        special_notes?: string;
    };
    status: string;
    created_at: string;
}

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    message_type: MessageType;
    content: string;
    file_url?: string;
    file_name?: string;
    file_mime_type?: string;
    file_size_bytes?: number;
    embedding?: number[];
    sender_info: SenderInfo;
    order?: ChatOrder;
    ai_analysis: AiAnalysis;
    is_monitored: boolean;
    requires_admin_alert?: boolean;
    is_edited: boolean;
    delivered_at: string;
    read_by?: {
        user_id: string;
        read_at: string;
    }[] | null;
    created_at: string;
    updated_at: string;
}

export interface ChatMessageResponse {
    data: ChatMessage;
}


// ==================================
export type WSMessageType =
    | 'text'
    | 'file'
    | 'audio'
    | 'video'
    | 'order'
    | 'order_update'
    | 'typing'
    | 'stop_typing'
    | 'read_receipt'
    | 'user_online'
    | 'user_offline'
    | 'system_alert'
    | 'search'
    | 'search_result'
    | 'all_conversations'
    | string;
// WebSocket message types matching the backend Go types
export type WSMessageType =
  | "text"
  | "file"
  | "audio"
  | "video"
  | "order"
  | 'order_update'
  | "typing"
  | "stop_typing"
  | "read_receipt"
  | "user_online"
  | "user_offline"
  | "system_alert"
  | "search"
  | "search_result"
  | "all_conversations";

// WSMessage WebSocket message structure
export interface WSMessage {
  type: WSMessageType;
  conversation_id: string;
  sender_id: string;
  data: any; // Generic data field - will vary based on message type
  timestamp: number; // Unix timestamp
}

// WSConversation for all_conversations message type
export interface WSConversation {
  data: ConversationWithMessages[];
}

// TypingIndicator structure
export interface TypingIndicator {
  user_id: string;
  user_name: string;
  is_typing: boolean;
}

// ConversationWithMessages for comprehensive conversation data
export interface ConversationWithMessages {
  conversation: EnhancedConversation;
  messages: EnhancedMessage[];
}

// Enhanced types matching backend structure
export interface EnhancedConversation {
  id: string;
  participants: string[];
  participant_details: ParticipantDetail[];
  last_message: LastMessage;
  created_at: string;
  updated_at: string;
}

export interface EnhancedMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: WSMessageType;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
  read_by: string[];
}

export interface ParticipantDetail {
  id: string;
  name: string;
  profile_image_url?: string;
}

export interface LastMessage {
  message_id: string;
  content: string;
  sender_id: string;
  message_type: WSMessageType;
  created_at: string;
  read_by: string[];
}

// Specific data structures for different message types
export interface MessageData {
  id?: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  read_by?: string[];
}

export interface ReadReceiptData {
  message_id: string;
  read_by: string[];
}

export interface SearchData {
  query: string;
  results?: EnhancedMessage[];
}

export interface SystemAlertData {
  message: string;
  level: 'info' | 'warning' | 'error';
}

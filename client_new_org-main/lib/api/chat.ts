import apiClient from "./api-client";

export const startConversationApi = async (data: { participant1_id: string; participant2_id: string; enable_ai_monitor?: boolean; sensitivity_level?: string }) => {
    const payload = {
        enable_ai_monitor: true,
        sensitivity_level: "medium",
        ...data,
    };
    return apiClient.post(`/chat/conversations/start`, payload);
};

export const getUserConversationsApi = async (userId: string) => {
    return apiClient.get(`/chat/conversations/${userId}`);
};

export const getConversationMessagesApi = async (conversationId: string) => {
    return apiClient.get(`/chat/conversations/${conversationId}/messages`);
};

export const sendMessageApi = async (data: FormData) => {
    return apiClient.post(`/chat/messages`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const searchMessagesApi = async (data: { conversation_id: string; query: string }) => {
    return apiClient.post(`/chat/messages/search`, data);
};

export const markMessageAsReadApi = async (messageId: string) => {
    return apiClient.put(`/chat/messages/${messageId}/read`);
};

export const uploadChatFileApi = async (file: FormData) => {
    return apiClient.post('/api/chat/upload', file, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
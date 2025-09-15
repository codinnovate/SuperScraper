import { WSMessage } from "@/types/websocket.types";

export const connectChatSocket = ({
    userId,
    conversationId,
    onMessage,
}: {
    userId: string;
    conversationId: string;
    onMessage: (msg: WSMessage) => void;
}) => {
    const baseURL = process.env.EXPO_PUBLIC_API_URL;

    if (!baseURL) {
        throw new Error('EXPO_PUBLIC_API_URL is not defined in environment variables.');
    }

    try {
        const ws = new WebSocket(
            `${baseURL.replace(/^http/, 'ws')}/chat/ws?user_id=${userId}&conversation_id=${conversationId}`
        );

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const data: WSMessage = JSON.parse(event.data);
                console.log('📩 Incoming WebSocket message:', data);
                onMessage(data);
            } catch (parseError) {
                console.error('❗ Failed to parse WebSocket message:', event.data);
            }
        };

        ws.onerror = (error) => {
            console.log('❌ WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('🔌 WebSocket disconnected');
        };

        return ws;
    } catch (err) {
        console.error('❗ Error initializing WebSocket:', err);
        return null;
    }
};

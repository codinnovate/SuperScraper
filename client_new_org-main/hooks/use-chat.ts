import { getConversationMessagesApi, getUserConversationsApi, markMessageAsReadApi, searchMessagesApi, sendMessageApi, startConversationApi, uploadChatFileApi } from "@/lib/api/chat";
import { AxiosError } from "axios";
import { useState } from "react";
import useSWR from "swr";

export const useChat = () => {
    const [isLoading, setIsLoading] = useState(false);

    const startConversation = async (data: { participant1_id: string; participant2_id: string; enable_ai_monitor?: boolean; sensitivity_level?: string }) => {
        try {
            setIsLoading(true);
            const response = await startConversationApi(data);
            return { success: true, data: response.data.data };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to start conversation";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Failed to start conversation" };
        }
        finally {
            setIsLoading(false);
        }
    };

    const getUserConversations = (userId: string) => {
        const { data, error, isLoading, mutate } = useSWR([`chat-conversations`, userId], () => getUserConversationsApi(userId), {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        });

        return {
            conversations: data?.data?.data || [],
            error: error ? error.message : null,
            isLoading,
            mutate
        };
    }

    const getConversationMessages = (conversationId: string) => {
        const { data, error, isLoading, mutate } = useSWR([`chat-messages`, conversationId], () => getConversationMessagesApi(conversationId), {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
        });
        return {
            conversation: data?.data?.data.conversation || null,
            messages: data?.data?.data.messages || [],
            error: error ? error.message : null,
            isLoading,
            mutate
        };
    }

    const sendMessage = async (data: FormData) => {
        try {
            setIsLoading(true);
            const response = await sendMessageApi(data);
            return { success: true, data: response.data.data };
        }
        catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to send message";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Failed to send message" };
        }
        finally {
            setIsLoading(false);
        }
    }

    const searchMessages = async (data: { conversation_id: string; query: string }) => {
        try {
            setIsLoading(true);
            const response = await searchMessagesApi(data);
            return { success: true, data: response.data };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to search messages";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Failed to search messages" };
        } finally {
            setIsLoading(false);
        }
    }

    const markMessageAsRead = async (messageId: string) => {
        try {
            setIsLoading(true);
            const response = await markMessageAsReadApi(messageId);
            return { success: true, data: response.data };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to mark message as read";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Failed to mark message as read" };
        } finally {
            setIsLoading(false);
        }
    }

    const uploadChatFile = async (file: FormData) => {
        try {
            setIsLoading(true);
            const response = await uploadChatFileApi(file);
            return { success: true, data: response.data };
        } catch (err) {
            if (err instanceof AxiosError) {
                const { response } = err;
                const errorMessage = response?.data?.error || "Failed to upload file";
                return { success: false, error: errorMessage };
            }
            return { success: false, error: "Failed to upload file" };
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, startConversation, getUserConversations, getConversationMessages, sendMessage, searchMessages, markMessageAsRead, uploadChatFile };
}
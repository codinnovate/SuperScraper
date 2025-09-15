import Avatar from "@/components/Avatar";
import MessageCard from "@/components/chat/MessageCard";
import Input from "@/components/input/Input";
import { useChatWebSocket } from "@/contexts/ChatWebSocketContext";
import { useCurrentUser } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { useSafeAudioRecorder } from "@/hooks/useSafeAudioRecorder";
import Colors from "@/styles/colors";
import { Heading } from "@/styles/typography";
import { ChatMessage } from "@/types/chat.types";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Chat = () => {
  const { id } = useLocalSearchParams();
  const { user } = useCurrentUser();
  const { sendMessage } = useChat();

  // Use global WebSocket context instead of creating separate connection
  const {
    conversations,
    conversationMessages,
    subscribeToConversation,
    unsubscribeFromConversation,
    addOptimisticMessage,
    sendWebSocketMessage,
    isLoading,
    refreshConversations,
    getTemporaryContact,
    clearTemporaryContact,
  } = useChatWebSocket();

  // Get conversation and messages from global context
  const conversation = conversations.find((conv: any) => conv.id === id);
  const chatMessages = conversationMessages[id as string] || [];
  const temporaryContact = getTemporaryContact(id as string);

  const scrollViewRef = useRef<ScrollView>(null);
  const [text, setText] = useState("");
  
  // Audio recording hook
  const {
    recorderState,
    audioError,
    isInitialized,
    startRecording,
    stopRecording,
  } = useSafeAudioRecorder();

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];

      // Add optimistic message immediately
      addOptimisticMessage(id as string, {
        content: "Image",
        message_type: "file",
        sender_id: user?.id || "",
        file_name: asset.fileName || `photo-${Date.now()}.jpg`,
        file_url: asset.uri, // Show local URI temporarily
      });

      const formData = new FormData();
      formData.append("conversation_id", id as string);
      formData.append("sender_id", user?.id || "");
      formData.append("message_type", "file");

      formData.append("file", {
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || `photo-${Date.now()}.jpg`,
      } as any);

      try {
        await sendMessage(formData);
      } catch (error) {
        console.error("Failed to send image:", error);
      }
    }
  };

  const handleRecordAudio = async () => {
    try {
      if (audioError) {
        Alert.alert("Error", "Audio recording is not available");
        return;
      }

      if (!isInitialized) {
        Alert.alert("Info", "Audio recorder is initializing...");
        return;
      }

      if (recorderState.isRecording) {
        // Stop recording
        const result = await stopRecording();
        if (result && result.uri) {
          // Add optimistic message immediately
          addOptimisticMessage(id as string, {
            content: "Audio Message",
            message_type: "audio",
            sender_id: user?.id || "",
            file_name: `audio-${Date.now()}.m4a`,
            file_url: result.uri, // Show local URI temporarily
          });

          // Send audio file to server
          const formData = new FormData();
          formData.append("conversation_id", id as string);
          formData.append("sender_id", user?.id || "");
          formData.append("message_type", "audio");

          formData.append("file", {
            uri: result.uri,
            type: "audio/m4a",
            name: `audio-${Date.now()}.m4a`,
          } as any);

          try {
            await sendMessage(formData);
          } catch (error) {
            console.error("Failed to send audio:", error);
            Alert.alert("Error", "Failed to send audio message");
          }
        } else {
          Alert.alert("Error", "Failed to record audio. Please try again.");
        }
      } else {
        // Start recording
        const success = await startRecording();
        if (!success) {
          Alert.alert("Error", "Failed to start recording");
        }
      }
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Audio recording failed");
    }
  };

  const handleSendTextMessage = async () => {
    try {
      Keyboard.dismiss();

      if (!text.trim()) return;

      const messageContent = text.trim();
      setText(""); // Clear input immediately

      // Add optimistic message immediately for instant UI feedback
      addOptimisticMessage(id as string, {
        content: messageContent,
        message_type: "text",
        sender_id: user?.id || "",
      });

      const formData = new FormData();
      formData.append("conversation_id", id as string);
      formData.append("sender_id", user?.id || "");
      formData.append("content", messageContent);
      formData.append("message_type", "text");

      const result = await sendMessage(formData);
      
      if (!result?.success) {
        console.error("Failed to send message:", result?.error);
        Alert.alert("Error", "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSendTextMessage:", error);
      Alert.alert("Error", "An unexpected error occurred while sending the message.");
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages]);

  // Subscribe to messages for this specific conversation
  useEffect(() => {
    if (!user?.id || !id) return;

    const handleMessage = (msg: any) => {
      // Handle typing indicators and other message types
      console.log("Received message in customer chat page:", msg.type);
    };

    subscribeToConversation(id as string, handleMessage);

    return () => {
      unsubscribeFromConversation(id as string);
    };
  }, [id, user?.id]);

  // Function to refresh messages and conversation data
  const handleOrderUpdate = async () => {
    try {
      // No longer need to refresh via REST API - messages will update via WebSocket
      console.log("Order updated - messages will update via WebSocket");
    } catch (error) {
      console.error("Error refreshing chat data:", error);
    }
  };

  // Refresh conversations if current conversation is not found (e.g., newly created)
  useEffect(() => {
    if (!isLoading && !conversation && id) {
      console.log("Conversation not found, refreshing conversations...");
      refreshConversations();
    }
  }, [conversation, id, isLoading, refreshConversations]);

  // Clear temporary contact when conversation is loaded
  useEffect(() => {
    if (conversation && temporaryContact) {
      clearTemporaryContact(id as string);
    }
  }, [conversation, temporaryContact, id]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  // Don't render the chat interface if conversation is not available
  if (!conversation && !temporaryContact) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text style={{ color: Colors.primary, fontSize: 16 }}>
          Loading conversation...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: Colors.primary,
          paddingVertical: 30,
          paddingBottom: 50,
        }}
      >
        <Pressable
          style={{
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 4,
          }}
          onPress={() => router.replace("/customer/messages")}
        >
          <Feather name="arrow-left" size={16} color="white" />
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Avatar
            uri={conversation?.participant_details?.[1]?.profile_image_url || temporaryContact?.profile_image_url}
            width={32}
            height={32}
          />
          <Heading style={{ color: Colors.primaryLight }}>
            {conversation?.participant_details?.[1]?.name || temporaryContact?.name || "Chat"}
          </Heading>
        </View>
        <View
          style={{
            padding: 12,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 4,
          }}
        >
          <Feather name="search" size={16} color="white" />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              marginTop: -30,
              flex: 1,
              marginBottom: 80,
              padding: 16,
            }}
          >
            {chatMessages.map((message: ChatMessage, index: number) => (
              <MessageCard
                key={message.id ?? `temp-${index}`}
                type={message.message_type}
                messageItem={message}
                isUser={message.sender_id === user?.id}
              />
            ))}
            {/* ChatOrderCard is now handled within MessageCard component */}
          </ScrollView>
          {/* Bottom Input Box */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              flexDirection: "row",
              alignItems: "center",
              paddingTop: 16,
              paddingHorizontal: 12,
              gap: 8,
              backgroundColor: Colors.primaryLight,
              height: 80,
            }}
          >
            <Feather name="plus" size={24} color="black" />
            <View style={{ flex: 1 }}>
              <Input
                variant="outlined"
                placeholder="Type message"
                value={text}
                onChangeText={setText}
                inputMode="text"
              />
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              {text.trim() ? (
                <Pressable
                  onPress={handleSendTextMessage}
                  style={{
                    padding: 12,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 50,
                  }}
                >
                  <Feather name="send" size={24} color="black" />
                </Pressable>
              ) : (
                <>
                  <Pressable
                    onPress={handlePickImage}
                    style={{
                      padding: 12,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 50,
                    }}
                  >
                    <Feather name="camera" size={24} color="black" />
                  </Pressable>
                  <Pressable
                    onPress={handleRecordAudio}
                    style={{
                      padding: 12,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 50,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        recorderState.isRecording
                          ? "stop-circle-outline"
                          : "microphone-outline"
                      }
                      size={24}
                      color={recorderState.isRecording ? "red" : "black"}
                    />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({});
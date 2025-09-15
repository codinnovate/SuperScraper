import Avatar from "@/components/Avatar";
import ChatSearchBar from "@/components/ChatSearchBar";
import TitleHeader from "@/components/header/TitleHeader";
import { useChatWebSocket } from "@/contexts/ChatWebSocketContext";
import { useCurrentUser } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { Body, Heading } from "@/styles/typography";
import { ChatData } from "@/types/chat.types";
import { formatShortTime } from "@/utils/format";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MessagesPage = () => {
  const { user } = useCurrentUser();
  const {
    conversations,
    conversationMessages,
    typingUsers,
    isLoading,
    connectionError,
    refreshConversations,
    reconnectWebSocket,
    subscribeToConversation,
    unsubscribeFromConversation,
  } = useChatWebSocket();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return conversations;
    }

    const query = searchQuery.toLowerCase().trim();
    return conversations.filter((conversation) => {
      // Search by the other person's name (customer name for stylist)
      const participantName =
        conversation.participant_details?.[0]?.name?.toLowerCase() || "";

      // Search through all messages in this conversation
      const messages = conversationMessages[conversation.id] || [];
      const hasMatchingMessage = messages.some((message) => {
        // Only search text messages
        if (message.message_type === "text" && message.content) {
          return message.content.toLowerCase().includes(query);
        }
        return false;
      });

      // Return true if either the participant name or any message content contains the search query
      return participantName.includes(query) || hasMatchingMessage;
    });
  }, [conversations, conversationMessages, searchQuery]);

  // Subscribe to general conversation updates
  useEffect(() => {
    const handleMessage = (msg: any) => {
      // This will be handled by the global context
      console.log("Received message in stylist conversations list:", msg.type);
    };

    subscribeToConversation("all", handleMessage);

    return () => {
      unsubscribeFromConversation("all");
    };
  }, []);

  // Refresh conversations when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Refresh conversations when user navigates back to this screen
      refreshConversations();
    }, [])
  );

  const renderConvo = ({ item }: { item: ChatData }) => {
    // Check if the last message is from the other user (not current user)
    const isUnreadMessage =
      user?.id !== undefined &&
      item.last_message.sender_id !== user.id &&
      !item.last_message?.read_by?.some((read) => read.user_id === user.id);

    // Check if someone is typing in this conversation
    const conversationTypers = typingUsers[item.id] || [];
    const isOtherUserTyping = conversationTypers.length > 0;

    // Find if search query matches any message in the conversation history
    const getSearchMatchInfo = () => {
      if (!searchQuery.trim()) return null;

      const query = searchQuery.toLowerCase().trim();
      const messages = conversationMessages[item.id] || [];

      // Find the most recent message that matches the search
      const matchingMessage = messages
        .slice()
        .reverse() // Start from most recent
        .find(
          (message) =>
            message.message_type === "text" &&
            message.content?.toLowerCase().includes(query)
        );

      return matchingMessage;
    };

    const searchMatch = getSearchMatchInfo();
    const showSearchMatch =
      searchQuery.trim() &&
      searchMatch &&
      searchMatch.id !== item.last_message.message_id;

    return (
      <Pressable
        onPress={() => {
          // Clear search when navigating to conversation
          if (searchQuery.trim()) {
            setSearchQuery("");
          }
          router.push({
            pathname: "/stylist/messages/[id]",
            params: { id: item.id },
          });
        }}
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          paddingVertical: 8,
          backgroundColor: isUnreadMessage ? "#f8f9ff" : "transparent",
          borderRadius: 8,
          paddingHorizontal: 4,
        }}
      >
        <Avatar uri={item?.participant_details?.[0].profile_image_url} />

        <View style={{ flex: 1, gap: 5 }}>
          <Heading
            style={{
              fontFamily: isUnreadMessage ? "BOLD" : "SEMIBOLD",
              color: isUnreadMessage ? Colors.primary : "black",
            }}
          >
            {item?.participant_details?.[0].name}
          </Heading>
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            {/* <Ionicons
              name="checkmark-done-outline"
              size={10}
              color={Colors.primary}
            /> */}
            {showSearchMatch ? (
              // Show matching message from history instead of last message
              <View>
                <Body
                  style={{
                    fontWeight: "normal",
                    color: "#666",
                    fontSize: 12,
                    fontStyle: "italic",
                  }}
                >
                  Found: "{searchMatch.content?.substring(0, 50)}
                  {searchMatch.content && searchMatch.content.length > 50
                    ? "..."
                    : ""}
                  "
                </Body>
                <Body
                  style={{
                    fontWeight: isUnreadMessage ? "bold" : "normal",
                    color: isUnreadMessage ? Colors.primary : "#888",
                    fontSize: 11,
                  }}
                >
                  Latest:{" "}
                  {item.last_message.message_type === "text"
                    ? item.last_message.content
                    : `(${item.last_message.message_type})`}
                </Body>
              </View>
            ) : isOtherUserTyping ? (
              // Show typing indicator
              <Body style={{ color: "#EEC800", fontStyle: "italic" }}>
                {conversationTypers[0]?.userName || "Someone"} is typing...
              </Body>
            ) : (
              // Show normal last message
              <>
                {item.last_message.message_type === "text" ? (
                  <Body
                    style={{
                      fontWeight: isUnreadMessage ? "bold" : "normal",
                      color: isUnreadMessage ? Colors.primary : "black",
                    }}
                  >
                    {item.last_message.content}
                  </Body>
                ) : (
                  <Body
                    style={{
                      color: Colors.primary,
                      fontStyle: "italic",
                      fontWeight: isUnreadMessage ? "bold" : "normal",
                    }}
                  >
                    ({item.last_message.message_type})
                  </Body>
                )}
              </>
            )}
            {/* <Body style={{ color: "#EEC800" }}>Typing...</Body> */}
          </View>
        </View>
        <View style={{ gap: 5 }}>
          <Body>{formatShortTime(item.last_message.created_at)}</Body>
          {isUnreadMessage && (
            <View
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 10,
                width: 8,
                height: 8,
              }}
            />
          )}
          {/* <Badge>3</Badge> */}
        </View>
      </Pressable>
    );
  };

  const renderEmptyComponent = () => {
    if (connectionError) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <Heading style={{ color: Colors.error, marginBottom: 10 }}>
            Connection Error
          </Heading>
          <Body style={{ textAlign: "center", marginBottom: 20 }}>
            Unable to connect to the server. Please check your internet
            connection.
          </Body>
          <Pressable
            onPress={reconnectWebSocket}
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Body style={{ color: "white" }}>Retry</Body>
          </Pressable>
        </View>
      );
    }

    // Handle search results
    if (searchQuery.trim()) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <Heading style={{ marginBottom: 10 }}>No Results Found</Heading>
          <Body style={{ textAlign: "center", color: "#666" }}>
            No conversations match "{searchQuery}"
          </Body>
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <Heading>No Conversation Yet!</Heading>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        backgroundColor: "#fff",
      }}
    >
      <TitleHeader title={"Message"} />

      <View style={{ marginBlock: 15 }}>
        <ChatSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search people and messages..."
        />
        {searchQuery.trim() && (
          <View style={{ paddingHorizontal: 4, paddingTop: 8 }}>
            <Body style={{ color: "#666", fontSize: 12 }}>
              {filteredConversations.length} result
              {filteredConversations.length !== 1 ? "s" : ""} found
            </Body>
          </View>
        )}
      </View>

      {isLoading ? (
        <View
          style={{
            flex: 1,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <View>
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            refreshing={isLoading}
            onRefresh={refreshConversations}
            renderItem={renderConvo}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MessagesPage;

const styles = StyleSheet.create({});

import { useSafeAudioPlayer } from "@/hooks/useSafeAudioPlayer";
import { ChatMessage, MessageType } from "@/types/chat.types";
import { formatAudioDuration, formatShortTime } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import ChatOrderCard from "./ChatOrderCard";

interface Props {
  type: MessageType;
  isUser: boolean;
  messageItem: ChatMessage;
  onOrderUpdate?: () => void;
}

const MessageCard = ({ type, isUser, messageItem, onOrderUpdate }: Props) => {
  // Enhanced safety checks
  if (!messageItem || !messageItem.id) {
    console.warn("MessageCard: Invalid message item", messageItem);
    return null;
  }

  // Additional safety checks for required fields
  if (!messageItem.content && !messageItem.file_url && type !== "order") {
    console.warn("MessageCard: Message has no content or file", messageItem);
    return null;
  }

  // Audio player hook for audio messages
  const { audioState, play, pause, audioError, isInitialized } = useSafeAudioPlayer(
    type === "audio" ? messageItem.file_url : undefined
  );
  
  // State for smooth progress updates
  const [currentPosition, setCurrentPosition] = useState(0);
  
  // Update position for smooth progress
  useEffect(() => {
    if (audioState.isPlaying) {
      const interval = setInterval(() => {
        setCurrentPosition(audioState.position);
      }, 100); // Update every 100ms for smooth animation
      
      return () => clearInterval(interval);
    } else {
      setCurrentPosition(audioState.position);
    }
  }, [audioState.isPlaying, audioState.position]);

  // Reset current position when audio completes
  useEffect(() => {
    if (!audioState.isPlaying && audioState.position === 0 && audioState.duration > 0) {
      setCurrentPosition(0);
    }
  }, [audioState.isPlaying, audioState.position, audioState.duration]);
  
  // Only show audio player if we have a valid file URL
  const shouldShowAudio = useMemo(() => {
    return messageItem.file_url && 
           messageItem.file_url.trim() !== "" && 
           (messageItem.file_url.startsWith('http') || messageItem.file_url.startsWith('file://'));
  }, [messageItem.file_url]);

  // Setup video player for video messages
  const player = useVideoPlayer(messageItem.file_url || "");

  const handleAudioPlay = async () => {
    try {
      if (!shouldShowAudio) {
        Alert.alert("Error", "No valid audio file available");
        return;
      }

      if (audioError) {
        Alert.alert("Error", "Audio playback is not available");
        return;
      }

      if (!isInitialized) {
        Alert.alert("Info", "Audio player is initializing...");
        return;
      }

      if (audioState.isPlaying) {
        await pause();
      } else {
        await play();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      Alert.alert("Error", "Audio playback failed");
    }
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.otherMessage,
      ]}
    >
      {type === "text" && messageItem.content && (
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.otherMessageText,
          ]}
        >
          {messageItem.content}
        </Text>
      )}

      {type === "file" && messageItem.file_url && (
        <Image
          source={{ uri: messageItem.file_url }}
          style={[
            styles.image,
            isUser ? styles.userMessageText : styles.otherMessageText,
          ]}
          resizeMode="cover"
        />
      )}

      {type === "audio" && messageItem.file_url && shouldShowAudio && (
        <View
          style={[
            styles.voiceMessage,
            isUser ? styles.userMessageText : styles.otherMessageText,
          ]}
        >
          <Pressable onPress={handleAudioPlay} style={styles.playButton}>
            <Ionicons
              name={audioState.isPlaying ? "pause" : "play"}
              size={16}
              color="#fff"
            />
          </Pressable>
          <View style={styles.waveform}>
            {[...Array(20)].map((_, index) => {
              // Calculate progress percentage
              const progressPercentage = audioState.duration > 0 
                ? (currentPosition / audioState.duration) * 100 
                : 0;
              
              // Calculate which bars should be "played" (filled)
              const playedBars = Math.floor((progressPercentage / 100) * 20);
              const isPlayed = index < playedBars;
              const isCurrentlyPlaying = audioState.isPlaying && index === playedBars;
              
              return (
                <View
                  key={index}
                  style={[
                    styles.waveBar,
                    {
                      height: Math.random() * 20 + 4,
                      backgroundColor: isPlayed || isCurrentlyPlaying 
                        ? "#2d5a3d"  // Dark green for played bars
                        : "#a0a0a0", // Light gray for unplayed bars
                      opacity: isCurrentlyPlaying ? 0.8 : 1,
                    },
                  ]}
                />
              );
            })}
          </View>
          <Text style={styles.voiceDuration}>
            {formatAudioDuration(currentPosition || audioState.duration)}
          </Text>
        </View>
      )}

      {type === "video" && messageItem.file_url && (
        <VideoView
          player={player}
          style={[
            styles.video,
            isUser ? styles.userMessageText : styles.otherMessageText,
          ]}
        />
      )}

      {type === "order" && messageItem.order && (
        <ChatOrderCard
          order={messageItem.order}
          onOrderUpdate={onOrderUpdate}
        />
      )}

      <Text
        style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.otherTimestamp,
        ]}
      >
        {formatShortTime(messageItem.created_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: "#fff",
    backgroundColor: "#2d5a3d",
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  otherMessageText: {
    color: "#333",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  videoContainer: {
    width: 200,
    height: 150,
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  voiceMessage: {
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d5a3d",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: 20,
  },
  waveBar: {
    width: 2,
    backgroundColor: "#2d5a3d",
    marginHorizontal: 1,
    borderRadius: 1,
  },
  voiceDuration: {
    fontSize: 12,
    color: "#fff",
    marginLeft: 8,
  },
  orderDetails: {
    backgroundColor: "#e8f5e8",
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    color: "#666",
  },
  orderValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#2d5a3d",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  declineButton: {
    backgroundColor: "#ffd700",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  addButton: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  audioInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  audioDuration: {
    fontSize: 12,
    color: "#fff",
    marginRight: 8,
  },
  audioWaveform: {
    flexDirection: "row",
    alignItems: "center",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    flex: 1,
  },
  waveformBar: {
    width: 2,
    height: "100%",
    backgroundColor: "#2d5a3d",
    borderRadius: 1,
  },
  userTimestamp: {
    textAlign: "left",
  },
  otherTimestamp: {
    textAlign: "right",
  },
});

export default MessageCard;

import React, { useEffect } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";

const { width } = Dimensions.get("window");

export type PopupType = "order" | "offer" | "notification";

interface InAppPopupProps {
  visible: boolean;
  message: string;
  type?: PopupType;
  onHide: () => void;
}

const popupColors = {
  order: "#2E8B57",
  offer: "#1E90FF",
  notification: "#FF8C00",
};

export const InAppPopup: React.FC<InAppPopupProps> = ({
  visible,
  message,
  type = "notification",
  onHide,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: popupColors[type] },
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    left: width * 0.05,
    width: width * 0.9,
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default InAppPopup;

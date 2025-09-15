import Colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface ChatSearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

const ChatSearchBar: React.FC<ChatSearchBarProps> = ({
  value = "",
  onChangeText,
  placeholder = "Search for styles",
  onSearch,
}) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleClear = () => {
    if (onChangeText) {
      onChangeText("");
    }
  };

  return (
    <View style={{ marginBlock: 8 }}>
      <View style={styles.searchWrapper}>
        <Pressable onPress={handleSearch}>
          <Ionicons name="search-outline" size={16} color="black" />
        </Pressable>

        <TextInput
          style={[styles.input]}
          inputMode="search"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          keyboardType="default"
        />

        {value && (
          <Pressable
            onPress={value ? handleClear : handleSearch}
            style={{
              padding: 8,
              backgroundColor: Colors.primary,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="close-outline" size={16} color="white" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default ChatSearchBar;

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.inputBorder,
    borderWidth: 0.5,
    borderRadius: 100,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 4,
    gap: 10,
    height: 48,
  },

  input: {
    flex: 1,
    fontSize: 10,
    fontFamily: "MEDIUM",
    color: Colors.primaryDark,
  },
});

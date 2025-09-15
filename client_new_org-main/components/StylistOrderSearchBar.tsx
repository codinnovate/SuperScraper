import Colors from "@/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

// const options = ["Agbada", "Women", "Traditinal", "Men", "Jumpsuit"];
const options = [
  "casual",
  "formal",
  "traditional",
  "wedding",
  "sports",
  "business",
  "party",
  "custom",
];

interface StyleSearchBarProps {
  text?: string;
  setText?: (text: string) => void;
}

const StylistOrderSearchBar: React.FC<StyleSearchBarProps> = ({
  text,
  setText,
}) => {
  const handleSearch = () => {
    if (setText) {
      setText("");
    }
  };

  return (
    <View style={{ marginBlock: 15 }}>
      <View style={styles.searchWrapper}>
        <Pressable onPress={handleSearch}>
          <Ionicons name="search-outline" size={16} color="black" />
        </Pressable>

        <TextInput
          style={[styles.input]}
          inputMode="search"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setText}
          value={text}
          placeholder="Search for styles"
          keyboardType="default"
        />
      </View>
    </View>
  );
};

export default StylistOrderSearchBar;

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.inputBorder,
    borderWidth: 0.5,
    borderRadius: 100,
    paddingHorizontal: 16,
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

  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: "#444",
  },

  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});

import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./Button";

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

const SearchBar = () => {
  const [text, setText] = useState("");
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  const toggleCheck = (option: string) => {
    setCheckedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleOptionsRendering = ({ item }: { item: string }) => {
    const isChecked = checkedOptions.includes(item);
    return (
      <TouchableOpacity
        onPress={() => {
          toggleCheck(item);
        }}
        style={styles.checkboxWrapper}
      >
        <MaterialCommunityIcons
          name={isChecked ? "checkbox-outline" : "checkbox-blank-outline"}
          size={24}
          color="black"
        />
        <Body style={{ marginLeft: 8, fontFamily: "REGULAR" }}>{item}</Body>
      </TouchableOpacity>
    );
  };

  const handleSelectedOption = ({ item }: { item: string }) => {
    return (
      //  <View style={{flexDirection:'row', gap:20, marginVertical: 20, alignItems:'center', }}>
      <View
        style={{
          backgroundColor: Colors.buttonLight,
          borderRadius: 100,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginRight: 8,
          gap: 10,
        }}
      >
        <Body>{item}</Body>
        <Pressable
          onPress={() => {
            toggleCheck(item);
          }}
          style={{ padding: 5 }}
        >
          <AntDesign name="close" size={10} color="red" />
        </Pressable>
      </View>
      // </View>
    );
  };

  const handleSearch = () => {
    setText("");
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

        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons name="filter-outline" size={16} color="black" />
        </Pressable>
      </View>

      {visible ? (
        <View
          style={{
            backgroundColor: Colors.primaryLight,
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 30,
            borderRadius: 20,
            position: "absolute",
            zIndex: 1,
            width: "100%",
            top: 40,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View>
            <FlatList
              data={options}
              renderItem={handleOptionsRendering}
              keyExtractor={(item) => item}
              contentContainerStyle={{ gap: 12 }}
            />
          </View>

          <Button
            title={"Apply Filter"}
            fontFamily={"MEDIUM"}
            onPress={() => setVisible(!visible)}
            marginRight={undefined}
            marginLeft={undefined}
          />
        </View>
      ) : (
        <View>
          <FlatList
            data={checkedOptions}
            renderItem={handleSelectedOption}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            numColumns={3}
            contentContainerStyle={{
              paddingTop: 16,
              gap: 8,
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SearchBar;

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

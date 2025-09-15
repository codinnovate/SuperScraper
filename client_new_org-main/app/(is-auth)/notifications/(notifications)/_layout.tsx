import TitleHeader from "@/components/header/TitleHeader";
import { useNotifications } from "@/hooks/use-notifications";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Subheading } from "@/styles/typography";
import { router, Slot, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FilterItem {
  id: number;
  title: string;
  filterWord: "all" | "order" | "offer";
}

const quickFilters: FilterItem[] = [
  { id: 1, title: "All", filterWord: "all" },
  { id: 2, title: "Orders", filterWord: "order" },
  { id: 3, title: "Offers", filterWord: "offer" },
];

const NotificationStack = () => {
  const navigation = useNavigation();

  const [selectedId, setSelectedId] = useState<number>(1);

  const { unreadCount } = useNotifications();

  const renderQuickFilters = ({ item }: { item: FilterItem }) => {
    const isSelected = item.id === selectedId;
    const backgroundColor = isSelected ? Colors.primary : Colors.buttonLight;
    const textColor = isSelected ? Colors.primaryLight : Colors.primaryDark;
    const fontFamily = isSelected ? "SEMIBOLD" : "REGULAR";

    return (
      <Pressable
        onPress={() => {
          setSelectedId(item.id);
          router.push({
            pathname: "./[filter]",
            params: {
              filter: item.filterWord,
            },
          });
        }}
        style={{
          backgroundColor,
          borderRadius: 100,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
          flex: 1,
        }}
      >
        <Subheading
          style={{
            color: textColor,
            fontFamily,
            paddingHorizontal: 32,
            paddingVertical: 10,
          }}
        >
          {item.title}{" "}
        </Subheading>
        {item.filterWord === "all" && unreadCount > 0 && (
          <View
            style={{
              backgroundColor: Colors.secondary,
              borderRadius: 12,
              paddingHorizontal: 6,
              paddingVertical: 2,
              minWidth: 24,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={layout.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TitleHeader
        title="Notifications"
        backArrow
        onPress={() => navigation.goBack()}
      />
      <View>
        <FlatList
          data={quickFilters}
          renderItem={renderQuickFilters}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          contentContainerStyle={{
            gap: 16,
            justifyContent: "center",
            marginBottom: 20,
            marginTop: 30,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Slot />
    </SafeAreaView>
  );
};

export default NotificationStack;

const styles = StyleSheet.create({});

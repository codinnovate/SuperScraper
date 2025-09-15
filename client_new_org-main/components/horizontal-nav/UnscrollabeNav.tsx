import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  NAV_ITEMS: {
    id: string;
    title: string;
    route?: { pathname: string; params?: Record<string, any> } | string;
  }[];
  selectedItem?: string;
  onSelect?: (id: string) => void;
  usePush?: boolean;
}

const UnscrollabeNav = ({
  NAV_ITEMS,
  selectedItem,
  onSelect,
  usePush = false,
}: Props) => {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isSelected = item.id === selectedItem;
        const backgroundColor = isSelected
          ? Colors.primary
          : Colors.buttonLight;
        const textColor = isSelected ? Colors.primaryLight : Colors.primaryDark;
        const fontFamily = isSelected ? "SEMIBOLD" : "REGULAR";

        return (
          <Pressable
            key={item.id}
            style={[styles.item, { backgroundColor: backgroundColor }]}
            onPress={() => {
              console.log("Pressed:", item.id);
              onSelect?.(item.id);
              if (item.route) {
                if (usePush) {
                  router.push(item.route as any);
                } else {
                  router.replace(item.route as any);
                }
              }
            }}
          >
            <Body style={{ color: textColor, fontFamily: fontFamily }}>
              {item.title}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
};

export default UnscrollabeNav;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  item: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
  },
});

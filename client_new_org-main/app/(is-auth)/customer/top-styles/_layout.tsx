import TitleHeader from "@/components/header/TitleHeader";
import { layout } from "@/styles/layout";
import { router, Slot } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TopStylesLayout = () => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={"Top Styles From Our Stylist"}
        backArrow
        onPress={() => router.back()}
      />
      <Slot />
    </SafeAreaView>
  );
};

export default TopStylesLayout;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  item: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
});

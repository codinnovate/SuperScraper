import { HomeHeader } from "@/components/header/HomeHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { layout } from "@/styles/layout";
import { router, Slot } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeStack = () => {
  const { user } = useCurrentUser();

  return (
    <SafeAreaView style={layout.container}>
      <HomeHeader
        title={user?.full_name as string}
        onPress={() =>
          router.push({
            pathname: "/notifications/[filter]",
            params: { filter: "all" },
          })
        }
      />
      <Slot />
    </SafeAreaView>
  );
};

export default HomeStack;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 8,
  },
  quickFiltersWrapper: {
    marginVertical: 8,
  },
});

import { HomeHeader } from "@/components/header/HomeHeader";
import StyleSearchBar from "@/components/StyleSearchBar";
import { useCurrentUser } from "@/hooks/use-auth";
import { layout } from "@/styles/layout";
import { router, Slot } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
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
      <StyleSearchBar />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Slot />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

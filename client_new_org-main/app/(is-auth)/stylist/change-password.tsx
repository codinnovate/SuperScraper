import ChangePassword from "@/components/form/ChangePassword";
import TitleHeader from "@/components/header/TitleHeader";
import { layout } from "@/styles/layout";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePasswordPage = () => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={"Change Password"}
        backArrow
        onPress={() => router.replace("/stylist/account")}
      />

      <ChangePassword />
    </SafeAreaView>
  );
};

export default ChangePasswordPage;

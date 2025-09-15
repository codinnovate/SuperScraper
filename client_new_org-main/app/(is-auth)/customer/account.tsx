import Colors from "@/styles/colors";
import React from "react";
import {
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AccountAddress from "@/components/form/AccountAddress";
import AccountProfileHeader from "@/components/form/AccountProfileHeader";
import TitleHeader from "@/components/header/TitleHeader";
import { useLogout } from "@/hooks/use-auth";
import { useCustomerProfile } from "@/hooks/use-customer";
import { useAccountTabRefetch } from "@/hooks/use-simple-tab-refetch";
import { layout } from "@/styles/layout";
import { Body, Heading } from "@/styles/typography";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const itemWidth = width;

export const Account = () => {
  const router = useRouter();
  const { profile, mutate } = useCustomerProfile();

  // Account tab refetch
  useAccountTabRefetch(mutate, true);

  const { logout } = useLogout();

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryLight, flex: 1 }}>
      <TitleHeader
        title="Account"
        backArrow
        onPress={() => router.push("/customer/home")}
      />
      
      <AccountProfileHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[layout.container, { paddingVertical: 32 }]}
        >
          <View style={{ gap: 16, marginBottom: 10 }}>
            <View style={{ backgroundColor: Colors.primaryLight }}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Body style={{ fontFamily: "MEDIUM", color: "#4D5761" }}>
                  Account
                </Body>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/customer/my-styles")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Heading style={{ fontFamily: "SEMIBOLD" }}>My Styles</Heading>
              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </Pressable>

            {/* address */}
            <AccountAddress />
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 100,
              backgroundColor: "#F9FAFB",
            }}
          >
            <Body>Security</Body>
          </View>

          <Pressable
            style={{ gap: 16, marginBlock: 16 }}
            onPress={() => {
              Linking.openURL(process.env.EXPO_PUBLIC_SUPPORT_LINK || "");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 10 }}>
                <Heading style={{ fontFamily: "SEMIBOLD" }}>Support</Heading>
                <Body>wa/link907333267</Body>
              </View>

              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </View>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => router.push("/pages/customer/terms-and-condition")}
            >
              <Heading style={{ fontFamily: "SEMIBOLD" }}>
                Terms and Conditions
              </Heading>
              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/customer/change-password")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 10 }}>
                <Heading style={{ fontFamily: "SEMIBOLD" }}>
                  Change Password
                </Heading>
                <Body>Change your password at anytime</Body>
              </View>

              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => {
                logout();
                router.replace("/auth/signin");
              }}
            >
              <Heading style={{ fontFamily: "SEMIBOLD" }}>Logout</Heading>
              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="logout" size={14} color={Colors.error} />
              </View>
            </Pressable>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Account;

const styles = StyleSheet.create({
  profileBg: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 40,
    gap: 5,
    padding: 16,
    // marginBottom: 30
  },

  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  referAndShareWrapper: {
    padding: 20,
    paddingBottom: 30,
    paddingTop: 30,
    borderRadius: 32,
    marginVertical: 20,
    backgroundColor: "#F3F4F6",
  },

  shareWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 100,
    marginTop: 10,
    backgroundColor: Colors.primaryLight,
  },

  referAFriendWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    marginBottom: 30,
  },
});
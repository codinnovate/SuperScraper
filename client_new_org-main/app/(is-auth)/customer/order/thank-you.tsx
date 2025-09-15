import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import { layout } from "@/styles/layout";
import { Title } from "@/styles/typography";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

const NAV_ITEMS = [
  // { id: "Refer", title: "Refer", route: "/" },
  { id: "Home", title: "Home", route: "/customer/home" },
];

const ThankYou = () => {
  return (
    <SafeAreaView
      style={[
        layout.container,
        { alignItems: "center", justifyContent: "center", gap: 20 },
      ]}
    >
      <Title>Thank you for your order</Title>
      {/* <Text>We will appreciate your referral (3% off your next order when you refer someone to us)</Text> */}

      <UnscrollabeNav NAV_ITEMS={NAV_ITEMS} />
    </SafeAreaView>
  );
};

export default ThankYou;

const styles = StyleSheet.create({});

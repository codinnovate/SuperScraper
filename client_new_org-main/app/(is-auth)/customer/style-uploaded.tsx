import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import { layout } from "@/styles/layout";
import { Subheading } from "@/styles/typography";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const StyleUploaded = () => {
  const { id } = useLocalSearchParams();

  const NAV_ITEMS = [
    {
      id: "check_offers",
      title: "Check Offers",
      route: {
        pathname: "/customer/my-styles/[id]/offers",
        params: { id: id as string },
      },
    },
    { id: "home", title: "Home", route: "/customer/home" },
  ];

  return (
    <SafeAreaView
      style={[
        layout.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text style={{ fontFamily: "SEMIBOLD", fontSize: 24 }}>
        Style Uploaded
      </Text>
      <Subheading style={{ marginTop: 20, marginBottom: 40 }}>
        We will notify you once our stylists drop their offers
      </Subheading>
      <UnscrollabeNav
        usePush
        NAV_ITEMS={NAV_ITEMS}
        selectedItem="check_offers"
      />
    </SafeAreaView>
  );
};

export default StyleUploaded;

const styles = StyleSheet.create({});

import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import StarRating from "@/components/StarRating";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body, Title } from "@/styles/typography";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NAV_ITEMS = [
  { id: "yes", title: "Yes", route: "/" },
  { id: "no", title: "No", route: "/" },
];

const OrderConfirmation = () => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title={"Order Confirmation"} />
      <Title
        style={{
          fontFamily: "REGULAR",
          textAlign: "center",
          marginTop: 50,
          marginBottom: 30,
        }}
      >
        Kindly Let's know if you've received your order
      </Title>

      <UnscrollabeNav NAV_ITEMS={NAV_ITEMS} />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 30,
          marginTop: 50,
        }}
      >
        <Body>Rate the Stylist</Body>
        <StarRating rating={4.2} size={16} color="#EEC800" />
      </View>

      <TextInput
        multiline
        style={{
          height: 150,
          borderRadius: 32,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.primaryLight,
          borderColor: Colors.inputBorder,
          borderWidth: 0.5,
          textAlignVertical: "top",
          padding: 15,
          fontFamily: "REGULAR",
          fontSize: 12,
          marginVertical: 30,
        }}
      />

      <Button
        onPress={() => router.push("./thank-you")}
        title={"Complete Order"}
        marginRight={undefined}
        marginLeft={undefined}
        fontFamily={"MEDIUM"}
        fontSize={16}
      />
    </SafeAreaView>
  );
};

export default OrderConfirmation;

const styles = StyleSheet.create({});

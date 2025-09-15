import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Button from "../Button";

interface Props {
  clientName: string;
  deliveryDate: string;
  uri?: string;
}

const MyOrderCard = ({ clientName, deliveryDate, uri }: Props) => {
  return (
    <View style={[styles.cardContainer]}>
      <View style={styles.cardTop}>
        <Image
          style={[styles.image]}
          source={uri ? { uri } : require("@/assets/images/placeholder.png")}
          resizeMode="cover"
          crossOrigin="anonymous"
        />

        <View style={styles.enlarge}>
          <MaterialCommunityIcons
            name="arrow-expand-all"
            size={14}
            color={Colors.primary}
          />
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.primaryLight,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 10,
          padding: 15,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <View style={{ gap: 20 }}>
            <Body>
              Client Name:
              <Body>{clientName}</Body>
            </Body>
            <Body>Deliv. Date :{deliveryDate}</Body>
            <Body>Delivered</Body>
          </View>

          <View style={{ alignSelf: "flex-end" }}>
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* //Complete order */}
        <Button
          title={"Complete order"}
          paddingBottom={10}
          paddingLeft={5}
          paddingRight={5}
          paddingTop={10}
          onPress={undefined}
          marginRight={undefined}
          marginLeft={undefined}
          fontFamily={undefined}
          fontSize={undefined}
        />

        {/* //Ask for Review */}
        <Button
          title={"Ask for Review"}
          paddingBottom={10}
          paddingLeft={5}
          paddingRight={5}
          paddingTop={10}
          onPress={undefined}
          marginRight={undefined}
          marginLeft={undefined}
          fontFamily={undefined}
          fontSize={undefined}
        />

        {/* Explore */}
        <Button
          title={"Explore"}
          paddingBottom={10}
          paddingLeft={5}
          paddingRight={5}
          paddingTop={10}
          backgroundColor={Colors.buttonBackgroundYellow}
          color={Colors.primaryDark}
          onPress={undefined}
          marginRight={undefined}
          marginLeft={undefined}
          fontFamily={undefined}
          fontSize={undefined}
        />
      </View>
    </View>
  );
};

export default MyOrderCard;

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "black",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1, // not sure
  },

  cardTop: {
    height: 110,
    // width:"100%",
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },

  enlarge: {
    height: 20,
    width: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    position: "absolute",
    bottom: 10,
    left: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  rating: {
    // height: 20,
    // width: 40,
    backgroundColor: Colors.primaryLight,
    borderRadius: 15,
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    padding: 5,
    paddingLeft: 7,
    paddingRight: 7,
  },

  image: {
    width: "100%",
    height: "100%",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius :20,
  },

  allOrdersWrapper: {
    gap: 20,
  },
});

import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface Props {
  clientName: string;
  uri?: string;
  goToReviewScreen: () => void;
}

const CompletedOrdersCard = ({ clientName, uri, goToReviewScreen }: Props) => {
  return (
    <View style={[styles.cardContainer]}>
      <View style={styles.cardTop}>
        <Image
          style={[styles.image]}
          source={uri ? { uri } : require("@/assets/images/placeholder.png")}
          resizeMode="cover"
          crossOrigin="anonymous"
        />

        {/* <View style={styles.enlarge}>
          <MaterialCommunityIcons
            name="arrow-expand-all"
            size={14}
            color={Colors.primary}
          />
        </View> */}
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
              <Body style={{ fontFamily: "SEMIBOLD" }}>{clientName}</Body>
            </Body>
            <Body style={{ fontFamily: "MEDIUM" }}>Delivered</Body>
          </View>

          <View style={{ alignSelf: "flex-end" }}>
            <Ionicons
              name="chatbubble-ellipses"
              size={16}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* <Pressable
          style={{ backgroundColor: Colors.primary, borderRadius: 100 }}
          onPress={goToReviewScreen}
        >
          <Body
            style={{
              paddingBottom: 10,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 10,
              textAlign: "center",
              color: Colors.buttonLight,
            }}
          >
            Ask for Review
          </Body>
        </Pressable> */}
        <Pressable
          style={{
            backgroundColor: Colors.buttonBackgroundYellow,
            borderRadius: 100,
          }}
          onPress={() => router.push("/stylist/client-bids")}
        >
          <Body
            style={{
              paddingBottom: 10,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 10,
              textAlign: "center",
              color: Colors.primary,
              fontFamily: "MEDIUM",
            }}
          >
            Explore
          </Body>
        </Pressable>
      </View>
    </View>
  );
};

export default CompletedOrdersCard;

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

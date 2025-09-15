import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { MyStyles } from "@/types/customer.types";
import { formatShortDate } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

interface MyStyleCardProps {
  item: MyStyles;
  from?: string;
}

const MyStyleCard: React.FC<MyStyleCardProps> = ({ item, from }) => {
  return (
    <View style={{ width: SCREEN_WIDTH / 2 - 24 }}>
      <Pressable
        style={styles.cardContainer}
        onPress={() => {
          router.push({
            pathname: "/customer/my-styles/[id]/offers",
            params: {
              id: item._id,
              from: from,
            },
          });
        }}
      >
        <View style={styles.cardTop}>
          <Image
            style={styles.image}
            source={{ uri: item.style_images[0].url }}
            alt="Style Image"
            defaultSource={require("@/assets/images/placeholder.png")}
            resizeMode="cover"
          />
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/customer/enlarge-image/[id]",
                params: {
                  id: item.style_id,
                  images: JSON.stringify(item.style_images),
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="arrow-expand-all"
              size={14}
              color={Colors.primary}
              style={styles.enlarge}
            />
          </Pressable>
        </View>
        <View style={styles.cardBottom}>
          <View>
            <Body>Delivery date:</Body>
            <Body style={{ fontFamily: "MEDIUM" }}>
              {formatShortDate(item.delivery_date)}
            </Body>
          </View>
          <Pressable
            style={styles.shareBtn}
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/customer/my-styles/[id]/offers",
                params: {
                  id: item._id,
                  from: from,
                },
              });
            }}
          >
            <MaterialCommunityIcons
              name="arrow-top-right-thin"
              size={16}
              color={Colors.primary}
            />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

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
    flex: 1,
    backgroundColor: "white",
  },
  cardTop: {
    height: 110,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardBottom: {
    flexDirection: "row",
    height: 57,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-between",
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 5,
  },
  enlarge: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  shareBtn: {
    backgroundColor: "#E2EEE8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

export default MyStyleCard;

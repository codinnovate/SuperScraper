import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  delivery_date: string;
  uri?: string;
  openImageModal: () => void;
  goToBid: () => void;
}

const BidCard = ({ delivery_date, uri, openImageModal, goToBid }: Props) => {
  return (
    <Pressable style={styles.cardContainer} onPress={goToBid}>
      <View style={styles.cardTop}>
        <Pressable
          style={styles.imageContainer}
          onPress={(e) => {
            e.stopPropagation();
            openImageModal();
          }}
        >
          <Image
            style={styles.image}
            source={uri ? { uri } : require("@/assets/images/placeholder.png")}
            resizeMode="cover"
          />
        </Pressable>

        <Pressable 
          style={styles.favourite} 
          onPress={(e) => {
            e.stopPropagation();
            openImageModal();
          }}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="arrow-expand-all"
            size={14}
            color={Colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.cardBottom}>
        <Body>Deliv. Date: {delivery_date}</Body>
        <TouchableOpacity 
          style={styles.bidBtn} 
          onPress={(e) => {
            e.stopPropagation();
            goToBid();
          }}
        >
          <Body style={styles.bidBtnText}>Bid</Body>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default BidCard;

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
  },
  cardTop: {
    height: 110,
    backgroundColor: "red",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  favourite: {
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
  image: {
    width: "100%",
    height: "100%",
  },
  cardBottom: {
    flexDirection: "row",
    backgroundColor: Colors.primaryLight,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  bidBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  bidBtnText: {
    color: Colors.primaryLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

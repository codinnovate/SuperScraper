import Colors from "@/styles/colors";
import { Body, Subheading } from "@/styles/typography";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface Props {
  id: string;
  uri?: string;
  rating: number;
  category: string;
  stylist_name: string;
  onPress?: () => void;
}

const CustomerStylistCard = ({
  id,
  uri,
  rating,
  category,
  stylist_name,
  onPress,
}: Props) => {
  // const [favorite, setFavourite] = useState(false);

  // const handleToggleFavourite = async () => {};

  // Use rating from prop, fallback to 5 if missing or 0
  const ratingValue = (rating && rating > 0) ? rating : 5;

  return (
    <Pressable 
      style={styles.cardContainer}
      onPress={onPress}
      hitSlop={8}
    >
      <View style={styles.cardTop}>
        <Image
          style={styles.image}
          source={uri ? { uri } : require("@/assets/images/placeholder.png")}
          resizeMode="cover"
        />

        {/* <Pressable style={styles.favourite} onPress={handleToggleFavourite}>
          <MaterialIcons
            name={favorite ? "favorite" : "favorite-border"}
            size={16}
            color={Colors.error}
          />
        </Pressable> */}

        <View style={styles.rating}>
          {/* <FontAwesome name="star-o" size={15} color="black" /> */}
          <FontAwesome name="star" size={15} color={Colors.primaryYellow} />
          {/* //rating */}
          <Subheading style={{ fontFamily: "SEMIBOLD" }}>{ratingValue}</Subheading>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View style={{ gap: 5 }}>
          <Body style={{ fontFamily: "SEMIBOLD" }}>{stylist_name}</Body>
          <Body>{category}</Body>
        </View>
        <Pressable 
          style={styles.shareBtn} 
          onPress={onPress}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="arrow-top-right-thin"
            size={16}
            color={Colors.primary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default CustomerStylistCard;

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
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
  },

  favourite: {
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    padding: 5,
    borderRadius: 50,
  },

  rating: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    padding: 3,
    paddingLeft: 8,
    paddingRight: 8,
  },

  shareBtn: {
    backgroundColor: "#E2EEE8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  image: {
    width: "100%",
    height: "100%",
  },
});

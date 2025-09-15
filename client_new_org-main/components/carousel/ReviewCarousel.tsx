import { Body } from "@/styles/typography";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface CommentItem {
  comment: string;
  name: string;
  country: string;
  id: string;
}

export const ReviewCarousel = ({ reviews }: { reviews: CommentItem[] }) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < reviews.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentIndex(index);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={{ width: screenWidth, paddingHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          borderRadius: 30,
          backgroundColor: "#F3F4F6",
          width: "100%",
          maxWidth: screenWidth - 80,
          gap: 5,
        }}
      >
        <View style={{ gap: 5 }}>
          <Body style={{ lineHeight: 15 }}>{item.comment}</Body>
          <Body>
            {item.name}. {item.country}
          </Body>
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <Image
            source={require("@/assets/svg/AvatarOne.svg")}
            style={{ width: 30, height: 30 }}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Left Arrow */}
      <Pressable
        onPress={() => scrollToIndex(currentIndex - 1)}
        disabled={currentIndex === 0}
        style={[styles.arrow, { left: 0, opacity: currentIndex === 0 ? 0 : 1 }]}
      >
        <MaterialIcons name="chevron-left" size={24} color="black" />
      </Pressable>

      {/* Reviews */}
      <FlatList
        ref={flatListRef}
        data={reviews}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(index);
        }}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* Right Arrow */}
      <Pressable
        onPress={() => scrollToIndex(currentIndex + 1)}
        disabled={currentIndex === reviews.length - 1}
        style={[
          styles.arrow,
          {
            right: 0,
            opacity: currentIndex === reviews.length - 1 ? 0 : 1,
          },
        ]}
      >
        <MaterialIcons name="chevron-right" size={24} color="black" />
      </Pressable>

      {/* Dots */}
      <View style={styles.dotsWrapper}>
        {reviews.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? "#02562C" : "rgba(57, 181, 74, 0.2)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 20,
    position: "relative",
  },
  cardContainer: {
    width: screenWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F3F4F6",
    borderRadius: 30,
    padding: 20,
    position: "relative",
  },
  comment: {
    fontSize: 14,
    marginBottom: 8,
    color: "#333",
  },
  name: {
    fontSize: 12,
    color: "#666",
  },
  avatar: {
    width: 31,
    height: 31,
    position: "absolute",
    bottom: 15,
    right: 20,
  },
  arrow: {
    position: "absolute",
    top: "25%",
    padding: 8,
    backgroundColor: "#E2EEE8",
    borderRadius: 20,
    zIndex: 10,
  },
  dotsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 100,
  },
});

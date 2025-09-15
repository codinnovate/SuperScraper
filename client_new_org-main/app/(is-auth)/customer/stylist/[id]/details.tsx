import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { useCustomerStylistProfile } from "@/hooks/use-customer";
import { Body, Heading } from "@/styles/typography";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";

const commentsList: any = [
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of Deal wth female outfit and other ready-made you could think of tfit and other ready-made you could think of Deal wth fe",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "1",
  // },
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of. ",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "2",
  // },
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of. ",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "3",
  // },
];

const { width } = Dimensions.get("window");
const itemWidth = width - 32;
const reviewWidth = width - 134;

const Details = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const { id } = useLocalSearchParams();

  const { stylistProfile } = useCustomerStylistProfile(id as string);
  const stylistName =
    stylistProfile?.first_name && stylistProfile?.last_name
      ? `${stylistProfile.first_name} ${stylistProfile.last_name}`
      : "Stylist Name";

  const scrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < commentsList.length) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index,
        viewOffset: 0,
      });
      setCurrentIndex(index);
    }
  };

  // backgroundColor:'#F3F4F6',
  const renderComments = ({
    item,
  }: {
    item: { comment: string; name: string; country: string; id: string };
  }) => (
    <View style={{ width: itemWidth, paddingHorizontal: 16 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          borderRadius: 30,
          backgroundColor: "#F3F4F6",
          width: "100%",
          gap: 5,
        }}
      >
        <View style={{ gap: 5 }}>
          <Body style={{ width: reviewWidth, color: "#111927" }}>
            {item.comment}
          </Body>
          <Body style={{ color: "#4D5761" }}>
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

  const renderCommentDots = ({
    item,
    index,
  }: {
    item: { comment: string; name: string; country: string; id: string };
    index: number;
  }) => {
    const backgroundColor =
      currentIndex === index ? "#02562C" : "rgba(57, 181, 74, 0.2)";

    return (
      <View
        style={{
          height: 5,
          width: 5,
          backgroundColor,
          borderRadius: 100,
        }}
      />
    );
  };

  return (
    <View
      style={{
        borderWidth: 0.5,
        borderRadius: 40,
        marginTop: 100,
        backgroundColor: "#FBFFFD",
        borderColor: "#B0CCBE",
      }}
    >
      <View style={{ left: 0, right: 0, alignItems: "center", marginTop: -60 }}>
        <Avatar
          uri={stylistProfile?.profile_image_url}
          width={120}
          height={120}
          borderRadius={100}
        />
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <View style={{ alignItems: "center", gap: 5 }}>
          <Heading style={{ fontFamily: "" }}>{stylistName}</Heading>
          <Body style={{ lineHeight: 16, textAlign: "center" }}>
            {stylistProfile?.bio}
          </Body>
        </View>

        <View style={styles.rateMeWrapper}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <FontAwesome name="star" size={12} color="#C9DDD3" />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("@/assets/svg/AvatarOne.svg")}
                style={{ width: 20, height: 20 }}
              />

              <Image
                source={require("@/assets/svg/AvatarTwo.svg")}
                style={{ width: 20, height: 20, marginLeft: -5 }}
              />

              <Image
                source={require("@/assets/svg/AvatarThree.svg")}
                style={{ width: 20, height: 20, marginLeft: -5 }}
              />

              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: "F2F4F7",
                  borderRadius: 50,
                  marginLeft: -5,
                  borderWidth: 1,
                  borderColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Body style={{ backgroundColor: "#F3F4F6" }}>
                  {stylistProfile?.rating}
                </Body>
              </View>
            </View>
          </View>

          <Button
            title={"Rate me"}
            fontSize={10}
            fontFamily={"REGULAR"}
            paddingTop={4}
            paddingBottom={4}
            backgroundColor={"#EEC800"}
            color={"black"}
            onPress={undefined}
            marginRight={undefined}
            marginLeft={undefined}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 16,
              borderRadius: 70,
              backgroundColor: "#F3F4F6",
            }}
          >
            <EvilIcons name="location" size={12} color="black" />
            <View>
              <Body>{stylistProfile?.location}</Body>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: "#F3F4F6",
              padding: 16,
              borderRadius: 70,
            }}
          >
            <AntDesign name="calendar" size={12} color="black" />
            <View>
              <Body>{stylistProfile?.delivery_days} days for delivery</Body>
            </View>
          </View>
        </View>
      </View>

      {/* //Review Slider and Dots */}
      <View style={{ gap: 10, marginTop: 40 }}>
        <Body style={{ fontFamily: "MEDIUM", textAlign: "center" }}>
          Reviews from customers
        </Body>
        {/* TODO: Integrate once endpoint is ready */}
        <View>
          <FlatList
            ref={flatListRef}
            data={commentsList}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderComments}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / itemWidth
              );
              setCurrentIndex(index);
            }}
            getItemLayout={(data, index) => ({
              length: itemWidth,
              offset: itemWidth * index,
              index,
            })}
          />

          <FlatList
            data={commentsList}
            renderItem={renderCommentDots}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled={true}
            contentContainerStyle={{
              gap: 5,
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  rateMeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    marginVertical: 24,
  },

  AvatarOneWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },

  reviewWrapper: {
    backgroundColor: "red",
    padding: 10,
    paddingBottom: 30,
    paddingRight: 50,
    borderRadius: 24,
    width: 200,
  },

  floatingBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    marginBottom: 80,
    paddingHorizontal: 16,
  },
});

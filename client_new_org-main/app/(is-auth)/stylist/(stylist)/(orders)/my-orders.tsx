import NodataToLoad from "@/components/stylist/NodataToLoad";
import { SearchContext } from "@/contexts/SearchContext";
import { useStylistOrdersTabRefetch } from "@/hooks/use-simple-tab-refetch";
import { useStylistOrders } from "@/hooks/use-stylist";
import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { Order } from "@/types/order.types";
import { OrderStatus } from "@/types/stylist.types";
import { formatShortDate } from "@/utils/format";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const body =
  "No orders yet, kindly make add styles to your portfolio to showcase to our customers.";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const MyOrder = () => {
  const { orders, error, isLoading, mutate } = useStylistOrders({
    status: OrderStatus.IN_PROGRESS,
  });
  const { searchQuery } = useContext(SearchContext);

  // Stylist orders tab refetch
  useStylistOrdersTabRefetch(mutate, true);

  // Filter orders based on search query
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;

    return orders?.filter((order: Order) => {
      const query = searchQuery.toLowerCase();
      return (
        order.customer_name?.toLowerCase().includes(query) ||
        order.status?.toLowerCase().includes(query) ||
        order.order_details.delivery_fee?.toLowerCase().includes(query) ||
        order.order_details.delivery_location?.toLowerCase().includes(query) ||
        formatShortDate(order.order_details.delivery_date)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [orders, searchQuery]);

  const handleCompleteOrder = () => {
    Alert.alert(
      "Complete Order",
      "Are you sure you want to complete this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            // TODO: Logic to handle order completion
          },
        },
      ]
    );
  };

  const handleAllOrdersListing = ({ item }: { item: Order }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <View style={[styles.cardContainer]}>
          <View style={styles.cardTop}>
            <Image
              style={[styles.image]}
              source={require("@/assets/images/placeholder.png")}
              resizeMode="cover"
              crossOrigin="anonymous"
            />

            {/* <View style={styles.enlarge}>
              <MaterialCommunityIcons
                name="arrow-expand-all"
                size={14}
                color="#02562C"
              />
            </View> */}
          </View>

          <View
            style={{
              backgroundColor: "white",
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
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
                  <Body style={{ fontFamily: "SEMIBOLD" }}>
                    {" "}
                    {item?.customer_name}
                  </Body>
                </Body>
                <Body>
                  Deliv. Date:{" "}
                  {formatShortDate(item.order_details.delivery_date)}
                </Body>
              </View>

              <View style={{ alignSelf: "flex-end" }}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={16}
                  color="#02562C"
                />
              </View>
            </View>

            {/* //Complete order */}
            <Pressable
              style={{
                backgroundColor: "#02562C",
                padding: 10,
                borderRadius: 20,
              }}
              onPress={handleCompleteOrder}
            >
              <Body style={{ color: "white", textAlign: "center" }}>
                Completed Order
              </Body>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const noResultsMessage = searchQuery.trim()
    ? `No orders found for "${searchQuery}"`
    : body;

  return (
    <View style={{ flex: 1 }}>
      {orders?.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 64,
          }}
        >
          <NodataToLoad body={noResultsMessage} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={handleAllOrdersListing}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            gap: 20,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{ gap: 20 }}
        />
      )}
    </View>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  allStylistsWrapper: {
    gap: 20,
  },

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
    borderRadius: 20,
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

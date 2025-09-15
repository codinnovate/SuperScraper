import CompletedOrdersCard from "@/components/stylist/CompletedOrderCard";
import NodataToLoad from "@/components/stylist/NodataToLoad";
import { SearchContext } from "@/contexts/SearchContext";
import { useStylistCompletedOrders } from "@/hooks/use-stylist";
import Colors from "@/styles/colors";
import { Order } from "@/types/order.types";
import { OrderStatus } from "@/types/stylist.types";
import { formatShortDate } from "@/utils/format";
import React, { useContext, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

const body = "You haven't chatted with any customers yet.";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const CompletedOrders = () => {
  const { orders, error, isLoading } = useStylistCompletedOrders({
    status: OrderStatus.COMPLETED,
  });
  const { searchQuery } = useContext(SearchContext);

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

  const handleCompletedOrdersListing = ({ item }: { item: Order }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <CompletedOrdersCard
          clientName={item?.customer_name ?? ""}
          uri={""}
          goToReviewScreen={() => {}}
        />
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
    ? `No completed orders found for "${searchQuery}"`
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
        <View>
          <FlatList
            data={filteredOrders}
            renderItem={handleCompletedOrdersListing}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.allStylistsWrapper,
              { paddingBottom: 270, paddingTop: 20, gap: 20 },
            ]}
            columnWrapperStyle={{ gap: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default CompletedOrders;

const styles = StyleSheet.create({
  quickFiltersWrapper: {
    justifyContent: "space-between",
    width: "100%",
  },

  allStylistsWrapper: {
    gap: 20,
  },
});

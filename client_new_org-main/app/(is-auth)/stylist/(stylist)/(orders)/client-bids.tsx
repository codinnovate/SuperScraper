import ClientBidCard from "@/components/stylist/ClientBidCard";
import NodataToLoad from "@/components/stylist/NodataToLoad";
import { SearchContext } from "@/contexts/SearchContext";
import { useCustomerBidsForStylist, useStylistOffers } from "@/hooks/use-bids";
import { useStylistBidsTabRefetch } from "@/hooks/use-simple-tab-refetch";
import Colors from "@/styles/colors";
import { StyleRequest } from "@/types/stylist.types";
import { formatShortDate } from "@/utils/format";
import { router } from "expo-router";
import React, { useContext, useMemo } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const ClientBids = () => {
  const { bids, isLoading, mutate } = useCustomerBidsForStylist();
  const { offers: stylistOffers, isLoading: offersLoading } = useStylistOffers();
  const { searchQuery } = useContext(SearchContext);

  // Stylist client bids tab refetch
  useStylistBidsTabRefetch(mutate, true);

  // Filter bids based on search query and remove bids the stylist has already responded to
  const filteredBids = useMemo(() => {
    if (!bids) return [];

    // Get the style IDs that the stylist has already offered on
    const offeredStyleIds = stylistOffers?.map(offer => offer.style_id) || [];
    
    console.log("Debug filtering - Total bids:", bids.length);
    console.log("Debug filtering - Offered style IDs:", offeredStyleIds);
    console.log("Debug filtering - Stylist offers:", stylistOffers);

    // Filter out bids that the stylist has already responded to
    // Compare bid.style_id with offered style_ids
    const availableBids = bids.filter((bid: StyleRequest) => {
      const isAlreadyOffered = offeredStyleIds.includes(bid.style_id);
      console.log(`Debug filtering - Bid ${bid._id} with style_id ${bid.style_id}: ${isAlreadyOffered ? 'ALREADY OFFERED' : 'AVAILABLE'}`);
      return !isAlreadyOffered;
    });

    console.log("Debug filtering - Available bids after filtering:", availableBids.length);

    // Apply search filter if there's a search query
    if (!searchQuery.trim()) return availableBids;

    return availableBids.filter((bid: StyleRequest) => {
      const query = searchQuery.toLowerCase();
      return formatShortDate(bid.delivery_date)?.toLowerCase().includes(query);
    });
  }, [bids, stylistOffers, searchQuery]);

  const handleBidListing = ({ item }: { item: StyleRequest }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <ClientBidCard
          delivery_date={item.delivery_date?.slice(0, 10) as string}
          uri={item.style_images[0]?.url || ""}
          goToBid={() => {
            console.log("Opening Bid for Item:", item._id);
            router.push({
              pathname: "/stylist/orders/bid/[id]",
              params: { id: item._id.toString() },
            });
          }}
          openImageModal={() => {
            router.push({
              pathname: "/stylist/enlarge-image/[id]",
              params: {
                id: item._id.toString(),
                images: JSON.stringify(item.style_images),
                from: "client-bids",
              },
            });
          }}
        />
      </View>
    );
  };

  if (isLoading || offersLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const noResultsMessage = searchQuery.trim()
    ? `No bids found for "${searchQuery}"`
    : "No Bids at the moment";

  return (
    <View style={{ flex: 1 }}>
      {filteredBids?.length === 0 ? (
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
          data={filteredBids}
          renderItem={handleBidListing}
          keyExtractor={(item) =>
            item._id?.toString() || Math.random().toString()
          }
          numColumns={2}
          contentContainerStyle={{
            paddingTop: 20,
            gap: 20,
            paddingBottom: 270,
          }}
          columnWrapperStyle={{ gap: 20 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ClientBids;

const styles = StyleSheet.create({});

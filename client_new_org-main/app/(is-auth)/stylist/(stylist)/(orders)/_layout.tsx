import OrderHeader from "@/components/header/OrderHeader";
import StylistOrderSearchBar from "@/components/StylistOrderSearchBar";
import { SearchContext } from "@/contexts/SearchContext";
import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { router, Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type QuickFilter = {
  id: string;
  title: string;
  url: string;
};

const quickFilters: QuickFilter[] = [
  { id: "client-bids", title: "Client Bids", url: "./client-bids" },
  { id: "my-orders", title: "My Orders", url: "./my-orders" },
  { id: "completed-orders", title: "Completed Orders", url: "./completed" },
];

const OrderStacks = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Navigate to the first screen on initial load
  useEffect(() => {
    const defaultFilter = quickFilters[0];
    setSelectedId(defaultFilter.id);
    router.push(defaultFilter.url as any);
  }, []);

  const renderQuickFilters: ListRenderItem<QuickFilter> = ({ item }) => {
    const isSelected = item.id === selectedId;
    const backgroundColor = isSelected ? Colors.primary : Colors.buttonLight;
    const textColor = isSelected ? Colors.primaryLight : Colors.primaryDark;
    const fontFamily = isSelected ? "SEMIBOLD" : "REGULAR";

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.id);
          router.replace(item.url as any);
        }}
        style={[styles.item, { backgroundColor }]}
      >
        <Body style={{ color: textColor, fontFamily: fontFamily }}>
          {item.title}
        </Body>
      </TouchableOpacity>
    );
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <SafeAreaView
        style={[
          {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: StatusBar.currentHeight || 0,
            backgroundColor: "#fff",
          },
        ]}
      >
        <OrderHeader title="Available Orders" />

        <StylistOrderSearchBar text={searchQuery} setText={setSearchQuery} />

        <View>
          <FlatList
            data={quickFilters}
            renderItem={renderQuickFilters}
            keyExtractor={(item) => item.id}
            horizontal
            contentContainerStyle={styles.quickFiltersWrapper}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Slot />
      </SafeAreaView>
    </SearchContext.Provider>
  );
};

export default OrderStacks;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  quickFiltersWrapper: {
    marginVertical: 8,
  },
});

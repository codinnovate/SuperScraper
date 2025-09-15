import CustomerStyleCard from "@/components/customer/CustomerStyleCard";
import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import { useFilteredStyles } from "@/hooks/use-browse";
import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { BrowseStyle } from "@/types/browse.types";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from "react-native";

const styleFilters = [
  { id: "male", title: "Men" },
  { id: "female", title: "Women" },
];

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const TopStylesFromOurStylist = () => {
  const [styleFilter, setStyleFilter] = useState(styleFilters[0].id);

  const {
    styles,
    isLoading: isStylesLoading,
    error: errorStyles,
  } = useFilteredStyles({ page: 1, limit: 10 }, { gender: styleFilter });

  const renderStylists = ({ item }: { item: BrowseStyle }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <CustomerStyleCard item={item} />
      </View>
    );
  };

  if (isStylesLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Body style={{ color: Colors.primary }}>Fetching all stylist...</Body>
      </View>
    );
  }

  if (errorStyles) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Body style={{ color: "red" }}>Error: {errorStyles}</Body>
      </View>
    );
  }

  return (
    <View>
      <View style={{ paddingTop: 24 }}>
        <UnscrollabeNav
          NAV_ITEMS={styleFilters}
          selectedItem={styleFilter}
          onSelect={setStyleFilter}
        />
      </View>

      <View style={{ paddingTop: 24 }}>
        <FlatList
          data={styles}
          renderItem={renderStylists}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: 100,
          }}
          columnWrapperStyle={{ gap: 20 }}
        />
      </View>
    </View>
  );
};

export default TopStylesFromOurStylist;

const styles = StyleSheet.create({});

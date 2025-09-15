import PortfolioCard from "@/components/customer/PortfolioCard";
import SearchBar from "@/components/SearchBar";
import { useCustomerStylistStyles } from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { CustomerStylistStyle } from "@/types/customer.types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const Portfolio = () => {
  const { id } = useLocalSearchParams();

  const { styles, isLoading, error } = useCustomerStylistStyles(id as string, {
    page: 1,
    limit: 10,
  });

  const renderList = ({ item }: { item: CustomerStylistStyle }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <PortfolioCard item={item} isFavourite={item.is_favorite} />
      </View>
    );
  };

  if (isLoading)
    return (
      <View style={{ height: 100 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  if (error)
    return (
      <View>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </View>
    );

  return (
    <View>
      <SearchBar />

      <View style={{ marginTop: 10 }}>
        <FlatList
          data={styles}
          renderItem={renderList}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            // paddingTop: 20,
            gap: 20,
            paddingBottom: 350,
          }}
          columnWrapperStyle={{ gap: 20 }}
        />
      </View>
    </View>
  );
};

export default Portfolio;

const styles = StyleSheet.create({});

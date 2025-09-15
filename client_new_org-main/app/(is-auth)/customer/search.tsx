import CustomerStyleCard from "@/components/customer/CustomerStyleCard";
import StyleSearchBar from "@/components/StyleSearchBar";
import { useSearch } from "@/hooks/use-search";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Heading } from "@/styles/typography";
import { BrowseStyle } from "@/types/browse.types";
import { AntDesign } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const SearchPage = () => {
  const { q, filters } = useLocalSearchParams();

  const { searchStyles } = useSearch();
  const filtersArray = typeof filters === "string" ? filters.split(",").filter(f => f.trim() !== "") : (Array.isArray(filters) ? filters : []);
  const { isLoading, searchResults } = searchStyles(q as string);

  // Filter results locally based on selected filters
  const filteredResults = searchResults.filter((item: BrowseStyle) => {
    if (filtersArray.length === 0) return true;
    
    // Match filters against category, style_name, and description
    return filtersArray.some(filter => 
      item.category?.toLowerCase().includes(filter.toLowerCase()) ||
      item.style_name?.toLowerCase().includes(filter.toLowerCase()) ||
      item.description?.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const renderSearchResults = ({ item }: { item: BrowseStyle }) => {
    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <CustomerStyleCard item={item} />
      </View>
    );
  };

  const renderEmptyComponent = (text: string, height = 128) => (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height,
      }}
    >
      <Heading>{text}</Heading>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={layout.container}>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: 50,
            padding: 2,
          }}
          onPress={() => router.dismiss()}
        >
          <AntDesign name="closecircle" size={32} color={Colors.primary} />
        </Pressable>

        <StyleSearchBar
          q={Array.isArray(q) ? q[0] : q || ""}
          filters={filtersArray}
        />

        <View
          style={{
            flex: 1,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 50,
          padding: 2,
        }}
        onPress={() => router.dismiss()}
      >
        <AntDesign name="closecircle" size={32} color={Colors.primary} />
      </Pressable>

      <StyleSearchBar
        q={Array.isArray(q) ? q[0] : q || ""}
        filters={filtersArray}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <FlatList
            data={filteredResults}
            renderItem={renderSearchResults}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 24,
              gap: 20,
              paddingBottom: 100,
            }}
            columnWrapperStyle={{ gap: 20, marginBottom: 16 }}
            ListEmptyComponent={() => renderEmptyComponent("No Search Result")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchPage;

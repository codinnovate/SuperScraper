import RecommendedStylistsCard from "@/components/customer/CustomerStylistCard";
import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import Colors from "@/styles/colors";
import { Body, Heading, Title } from "@/styles/typography";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

const NAV_ITEMS = [
  { id: "men", title: "Men", route: "/home/recommended-stylists" },
  { id: "women", title: "Women", route: "/home/stylists-near-me" },
];

type FooterProps = {
  onChangeLimit: () => void;
  limit: number;
  stylesData: any[];
};

const Footer = ({ onChangeLimit, limit, stylesData }: FooterProps) => {
  const renderStylists = ({ item }) => (
    <RecommendedStylistsCard
      uri={undefined}
      rating={item.rating}
      category={item.specialty || item.category}
      stylist_name={item.stylist_name || item.stylistName}
    />
  );

  return (
    <View style={styles.footerContainer}>
      {limit < 5 && (
        <View style={styles.viewAllWrapper}>
          <Pressable style={styles.viewAllButton} onPress={onChangeLimit}>
            <Body style={styles.viewAllText}>View all</Body>
          </Pressable>
        </View>
      )}

      <View style={styles.topStylesHeader}>
        <Title>Top Styles from our Stylists</Title>
        <Pressable onPress={() => router.push("/top-styles-from-our-stylist")}>
          <Heading style={styles.topStyleLink}>View all</Heading>
        </Pressable>
      </View>

      <View style={styles.navWrapper}>
        <UnscrollabeNav NAV_ITEMS={NAV_ITEMS} />
      </View>

      <FlatList
        data={stylesData.slice(0, 6)}
        renderItem={renderStylists}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  viewAllWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 50,
  },
  viewAllButton: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  viewAllText: {
    fontFamily: "SEMIBOLD",
    color: Colors.primary,
  },
  topStylesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topStyleLink: {
    fontFamily: "MEDIUM",
    color: Colors.primary,
  },
  navWrapper: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  flatListContent: {
    paddingTop: 20,
    paddingBottom: 210,
    gap: 20,
  },
  columnWrapper: {
    gap: 20,
    marginBottom: 10,
  },
});

import StyleSearchBar from "@/components/StyleSearchBar";
import FavouriteCard from "@/components/customer/FavouriteCard";
import NoData from "@/components/customer/Nodata";
import TitleHeader from "@/components/header/TitleHeader";
import { useCustomerFavorites } from "@/hooks/use-customer";
import { useFavouritesTabRefetch } from "@/hooks/use-simple-tab-refetch";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { FavoriteStyle } from "@/types/customer.types";
import { useRouter } from "expo-router";
import React, { ReactNode, useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const text =
  "You've not added any favorites  yet. Kindly explore more styles with the button below.";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const FavouritesPage = () => {
  const router = useRouter();
  const { favorites, isLoading, error, mutate } = useCustomerFavorites(
    { page: 1, limit: 10 },
    { revalidateOnFocus: true }
  );
  const [refreshing, setRefreshing] = useState(false);

  // Favourites tab refetch
  useFavouritesTabRefetch(mutate, true);

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await mutate();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, [mutate]);

  // const [favorite, setFavourite] = useState(false);

  const renderFavorites = ({ item }: any) => {
    const styleId = item.style_id;

    const isFavorited = favorites.some(
      (fav: FavoriteStyle) => fav.style_id === styleId
    );

    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <FavouriteCard item={item} isFavourite={isFavorited} />
      </View>
    );
  };

  if (isLoading && !refreshing)
    return (
      <PageWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </PageWrapper>
    );

  if (error && !refreshing) {
    return (
      <PageWrapper>
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: Colors.error, textAlign: "center", marginTop: 20 }}
          >
            Error: {error}
          </Text>
          <FlatList
            data={[]}
            renderItem={() => null}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
          />
        </View>
      </PageWrapper>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <PageWrapper>
        <FlatList
          data={[]}
          renderItem={() => null}
          ListEmptyComponent={
            <NoData
              text={text}
              onPress={() => router.push("/customer/top-styles")}
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          contentContainerStyle={{ flex: 1 }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <View>
        <FlatList
          data={favorites}
          renderItem={renderFavorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            gap: 20,
            paddingBottom: 210,
          }}
          columnWrapperStyle={{ gap: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]} // Android
              tintColor={Colors.primary} // iOS
              title="Pull to refresh" // iOS
              titleColor={Colors.primaryDark} // iOS
            />
          }
        />
      </View>
    </PageWrapper>
  );
};

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title={"Favourites"} />
      <StyleSearchBar />
      {children}
    </SafeAreaView>
  );
};

export default FavouritesPage;

const styles = StyleSheet.create({});

import CustomerStyleCard from "@/components/customer/CustomerStyleCard";
import CustomerStylistCard from "@/components/customer/CustomerStylistCard";
import MyStyleCard from "@/components/customer/MyStyleCard";
import NoData from "@/components/customer/Nodata";
import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import { useFilteredStyles, useFilteredStylists } from "@/hooks/use-browse";
import { useMyStyles } from "@/hooks/use-customer";
import { useHomeTabRefetch } from "@/hooks/use-simple-tab-refetch";
import Colors from "@/styles/colors";
import { Body, Heading, Title } from "@/styles/typography";
import { BrowseStyle, BrowseStylists } from "@/types/browse.types";
import { MyStyles } from "@/types/customer.types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ListRenderItem,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

type QuickFilter = {
  id: string;
  title: string;
};

const quickFilters: QuickFilter[] = [
  {
    id: "all",
    title: "All stylists",
  },
  {
    id: "recommended",
    title: "Recommended Stylist",
  },
  {
    id: "my-styles",
    title: "My Styles",
  },
  // { id: "near", title: "Stylists near me" },
];

const styleFilters = [
  { id: "Male", title: "Men" },
  { id: "Female", title: "Women" },
];

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const AllStylesPage = () => {
  const [limit, setLimit] = useState(4);
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(
    quickFilters[0].id ?? null
  );
  const [styleFilter, setStyleFilter] = useState(styleFilters[0].id);

  // const {
  //   stylists,
  //   isLoading: isStylistsLoading,
  //   error: errorStylists,
  //   isLoadingMore,
  //   loadMore,
  //   hasMore,
  // } = usePaginatedStylists();
  const {
    stylists,
    isLoading: isStylistsLoading,
    error: errorStylists,
    isLoadingMore,
    loadMore,
    hasMore,
    mutate: mutatStylists,
  } = selectedId === "recommended"
    ? useFilteredStylists({ is_recommended: true }, { revalidateOnFocus: true })
    : useFilteredStylists({}, { revalidateOnFocus: true });
  // const {
  //   stylists: recommendedStylists,
  //   isLoading: isRecommendedStylistsLoading,
  //   error: errorRecommendedStylists,
  // } = useFilteredStylists({ page: 1, limit: 10 }, { is_recommended: true });
  // Fetch all styles and stylists, then filter on frontend
  const {
    styles: allStyles,
    isLoading: isStylesLoading,
    error: errorStyles,
    mutate: mutateStyles,
  } = useFilteredStyles({ page: 1, limit: 50 }, {}); // Fetch more styles

  const {
    stylists: allStylists,
    isLoading: isAllStylistsLoading,
    error: errorAllStylists,
  } = useFilteredStylists({}, { revalidateOnFocus: true });

  // Filter styles based on stylist gender on frontend
  const styles = React.useMemo(() => {
    if (!allStyles || !allStylists) return [];
    
    console.log('Frontend filtering - All styles count:', allStyles.length);
    console.log('Frontend filtering - All stylists count:', allStylists.length);
    console.log('Frontend filtering - Current filter:', styleFilter);
    
    // Create a map of stylist_id to stylist gender
    const stylistGenderMap = new Map();
    allStylists.forEach(stylist => {
      if (stylist._id) {
        stylistGenderMap.set(stylist._id, stylist.gender);
      }
    });
    
    console.log('Frontend filtering - Stylist gender map:', Object.fromEntries(stylistGenderMap));
    
    // Filter styles based on stylist gender
    const filteredStyles = allStyles.filter(style => {
      const stylistGender = stylistGenderMap.get(style.stylist_id);
      const matches = stylistGender === styleFilter;
      console.log(`Style ${style._id} - Stylist: ${style.stylist_id}, Gender: ${stylistGender}, Filter: ${styleFilter}, Matches: ${matches}`);
      return matches;
    });
    
    console.log('Frontend filtering - Filtered styles count:', filteredStyles.length);
    return filteredStyles;
  }, [allStyles, allStylists, styleFilter]);

  const {
    myStyles,
    isLoading: isMyStylesLoading,
    error: errorMyStyles,
    mutate: mutateMyStyles,
  } = useMyStyles({ page: 1, limit: 10 });

  // Home tab refetch - using direct mutate calls
  useHomeTabRefetch(mutatStylists, mutateStyles, true);
  
  // Also include My Styles in refetch when needed
  React.useEffect(() => {
    if (selectedId === "my-styles") {
      mutateMyStyles();
    }
  }, [selectedId, mutateMyStyles]);



  // const filteredStylists = () => {
  //   if (selectedId === "recommended") {
  //     return recommendedStylists;
  //   }
  //   return stylists;
  // };

  const renderQuickFilters: ListRenderItem<QuickFilter> = ({ item }) => {
    const isSelected = item.id === selectedId;
    const backgroundColor = isSelected ? Colors.primary : Colors.buttonLight;
    const textColor = isSelected ? Colors.primaryLight : Colors.primaryDark;
    const fontFamily = isSelected ? "SEMIBOLD" : "REGULAR";

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedId(item.id);
        }}
        style={{
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 20,
          marginRight: 16,
          backgroundColor,
        }}
      >
        <Body style={{ color: textColor, fontFamily: fontFamily }}>
          {item.title}
        </Body>
      </TouchableOpacity>
    );
  };

  const renderStylistsFooter = () => {
    const validStylists = Array.isArray(stylists)
      ? stylists.filter((item): item is BrowseStylists => item && item._id)
      : [];

    if (validStylists.length > 4 && limit < 5) {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 24,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#F3F4F6",
              padding: 10,
              paddingHorizontal: 30,
              borderRadius: 30,
            }}
            onPress={() => setLimit(10)}
          >
            <Body style={{ fontFamily: "SEMIBOLD", color: Colors.primary }}>
              View all
            </Body>
          </Pressable>
        </View>
      );
    }
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  };

  const renderStylists = ({ item }: { item: BrowseStylists }) => {
    if (!item || !item._id) {
      return null; // Skip rendering if item is null or missing _id
    }

    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <CustomerStylistCard
          id={item._id}
          category={item.specialization}
          uri={item.profile_image_url}
          rating={item.review_count}
          stylist_name={`${item.last_name} ${item.first_name}`}
          onPress={() =>
            router.push({
              pathname: "/customer/stylist/[id]/portfolio",
              params: { id: item._id },
            })
          }
        />
      </View>
    );
  };

  const renderStyles = ({ item }: { item: BrowseStyle }) => {
    if (!item || !item._id) {
      return null; // Skip rendering if item is null or missing _id
    }

    return (
      <View style={{ width: SCREEN_WIDTH / 2 - 26 }}>
        <CustomerStyleCard item={item} />
      </View>
    );
  };

  // Use shared MyStyleCard component for consistency
  const renderMyStyles = ({ item }: { item: MyStyles }) => <MyStyleCard item={item} />;

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

  // Handle loading states for different tabs
  const isLoading = selectedId === "my-styles" ? isMyStylesLoading : (isStylistsLoading || isStylesLoading || isAllStylistsLoading);
  const error = selectedId === "my-styles" ? errorMyStyles : (errorStylists || errorStyles || errorAllStylists);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          height: 100,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Body style={{ color: Colors.primary }}>
          {selectedId === "my-styles" ? "Fetching your styles..." : "Fetching all stylist..."}
        </Body>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Body style={{ color: "red" }}>Error: {error}</Body>
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 100 }}>
      <View>
        <FlatList
          data={quickFilters}
          renderItem={renderQuickFilters}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View>
        {selectedId === "my-styles" ? (
          !myStyles || myStyles.length === 0 ? (
            <NoData
              text="You've not added any style yet. Explore our styles with the button below."
              onPress={() => router.push("/customer/top-styles")}
            />
          ) : (
            <FlatList
              data={myStyles}
              renderItem={renderMyStyles}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 20,
                gap: 20,
                paddingBottom: 210,
              }}
              columnWrapperStyle={{ gap: 20 }}
            />
          )
        ) : (
          <FlatList
            data={
              Array.isArray(stylists)
                ? stylists
                    .filter((item): item is BrowseStylists => item && item._id)
                    .slice(0, limit)
                : []
            }
            renderItem={renderStylists}
            keyExtractor={(item, index) =>
              item._id?.toString() || `stylist-${index}`
            }
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 24,
              gap: 20,
            }}
            columnWrapperStyle={{ gap: 20 }}
            ListEmptyComponent={() =>
              renderEmptyComponent("No stylists available")
            }
            ListFooterComponent={renderStylistsFooter}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>

      {/* show if not showing all and not on My Styles tab */}
      {limit < 5 && selectedId !== "my-styles" && (
        <View style={{ flex: 1, paddingTop: 38 }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title>Top Styles from our Stylists</Title>
              <Pressable
                onPress={() => {
                  router.push("/customer/top-styles");
                }}
              >
                <Heading
                  style={{ fontFamily: "MEDIUM", color: Colors.primary }}
                >
                  View all
                </Heading>
              </Pressable>
            </View>
          </View>

          <View style={{ paddingTop: 24 }}>
            <UnscrollabeNav
              NAV_ITEMS={styleFilters}
              selectedItem={styleFilter}
              onSelect={setStyleFilter}
            />
          </View>

          <View>
            <FlatList
              data={
                Array.isArray(styles)
                  ? styles
                      .filter((item): item is BrowseStyle => item && item._id)
                      .slice(0, 6)
                  : []
              }
              renderItem={renderStyles}
              keyExtractor={(item, index) =>
                item._id?.toString() || `style-${index}`
              }
              numColumns={2}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: 24,
                gap: 20,
              }}
              columnWrapperStyle={{ gap: 20, marginBottom: 16 }}
              ListEmptyComponent={() =>
                renderEmptyComponent("No styles available")
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default AllStylesPage;

const styles = StyleSheet.create({
  cardContainer: {
    shadowColor: "black",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    backgroundColor: "red",
  },
  cardTop: {
    height: 110,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "green",
  },
  cardBottom: {
    flexDirection: "row",
    height: 57,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "space-between",
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 5,
  },
  enlarge: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  shareBtn: {
    backgroundColor: "#E2EEE8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});

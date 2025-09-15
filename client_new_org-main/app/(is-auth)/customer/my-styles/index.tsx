import MyStyleCard from "@/components/customer/MyStyleCard";
import NoData from "@/components/customer/Nodata";
import TitleHeader from "@/components/header/TitleHeader";
import { useMyStyles } from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { MyStyles } from "@/types/customer.types";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const text =
  "You've not added any style yet. Explore our styles with the button below.";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const MyStylesPage = () => {
  const { isLoading, myStyles, error } = useMyStyles();

  const renderMyStyles = ({ item }: { item: MyStyles }) => <MyStyleCard item={item} />;

  if (isLoading)
    return (
      <PageWrapper>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </PageWrapper>
    );
  if (error)
    return (
      <PageWrapper>
        <Text style={{ color: "red" }}>Error: {error}</Text>
      </PageWrapper>
    );
  const router = useRouter();
  if (!myStyles || myStyles.length === 0)
    return (
      <PageWrapper>
        <NoData
          text={text}
          onPress={() => router.push("/customer/top-styles")}
        />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <View>
        <FlatList
          data={myStyles}
          renderItem={renderMyStyles}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            gap: 20,
            paddingBottom: 210,
          }}
          columnWrapperStyle={{ gap: 20 }}
        />
      </View>
    </PageWrapper>
  );
};

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={"My Styles"}
        backArrow
        onPress={() => router.push("/customer/account")}
      />
      {/* <SearchBar /> */}
      {children}
    </SafeAreaView>
  );
};

export default MyStylesPage;

const styles = StyleSheet.create({
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

  favourite: {
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
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

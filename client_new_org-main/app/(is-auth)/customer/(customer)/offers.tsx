import MyStyleCard from "@/components/customer/MyStyleCard";
import { HomeHeader } from "@/components/header/HomeHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { useMyStyles } from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body, Title } from "@/styles/typography";
import { MyStyles } from "@/types/customer.types";
import { router } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const OffersPage = () => {
  const { user } = useCurrentUser();
  const { isLoading, myStyles, error } = useMyStyles();

  // Use shared MyStyleCard for each style
  const renderStyleWithOffersLink = ({ item }: { item: MyStyles }) => (
    <MyStyleCard item={item} from="offers-tab" />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={layout.container}>
        <HomeHeader
          title={user?.full_name as string}
          onPress={() =>
            router.push({
              pathname: "/notifications/[filter]",
              params: { filter: "all" },
            })
          }
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Body style={{ color: Colors.primary, marginTop: 10 }}>
            Loading your styles...
          </Body>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={layout.container}>
        <HomeHeader
          title={user?.full_name as string}
          onPress={() =>
            router.push({
              pathname: "/notifications/[filter]",
              params: { filter: "all" },
            })
          }
        />
        <View style={styles.centerContainer}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!myStyles || myStyles.length === 0) {
    return (
      <SafeAreaView style={layout.container}>
        <HomeHeader
          title={user?.full_name as string}
          onPress={() =>
            router.push({
              pathname: "/notifications/[filter]",
              params: { filter: "all" },
            })
          }
        />
        <View style={styles.centerContainer}>
          <Title style={{ textAlign: "center", marginBottom: 16 }}>My Offers</Title>
          <Body style={{ textAlign: "center", color: Colors.primaryGray, marginBottom: 16 }}>
            You haven't uploaded any styles yet.
          </Body>
          <Pressable
            style={styles.uploadButton}
            onPress={() => router.push("/customer/upload-style")}
          >
            <Body style={styles.uploadButtonText}>Upload a style to start receiving offers</Body>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={layout.container}>
      <HomeHeader
        title={user?.full_name as string}
        onPress={() =>
          router.push({
            pathname: "/notifications/[filter]",
            params: { filter: "all" },
          })
        }
      />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: 20 }}>
          <Title style={{ marginBottom: 8 }}>My Offers</Title>
          <Body style={{ marginBottom: 24, color: Colors.primaryGray }}>
            Tap on any style to view offers from stylists
          </Body>
          
          <FlatList
            data={myStyles}
            renderItem={renderStyleWithOffersLink}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              gap: 20,
              paddingBottom: 100,
            }}
            columnWrapperStyle={{ 
              gap: 20,
              justifyContent: 'space-between',
              paddingHorizontal: 0
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OffersPage;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  styleCard: {
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
    backgroundColor: "white",
  },
  styleImageContainer: {
    height: 110,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  styleImage: {
    width: "100%",
    height: "100%",
  },
  viewOffersButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#E2EEE8",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  styleInfo: {
    flexDirection: "column",
    height: 57,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 2,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  uploadButtonText: {
    color: Colors.primaryLight,
    fontFamily: "SEMIBOLD",
    textAlign: "center",
  },
});
import OfferCard from "@/components/customer/OfferCard";
import TitleHeader from "@/components/header/TitleHeader";
import { useChatWebSocket } from "@/contexts/ChatWebSocketContext";
import { useCurrentUser } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { useMyStylesOffers } from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { MyStylesOffer } from "@/types/customer.types";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const Offers = () => {
  const { id, from } = useLocalSearchParams();
  const { user } = useCurrentUser();
  const { startConversation } = useChat();
  const { setTemporaryContact } = useChatWebSocket();

  const { offers, error, isLoading } = useMyStylesOffers(id as string);

  // Handle back navigation based on where user came from
  const handleBackNavigation = () => {
    if (from === 'offers-tab') {
      router.push('/customer/offers');
    } else {
      router.back();
    }
  };

  const renderOffers = ({ item }: { item: MyStylesOffer }) => {
    // Calculate actual delivery days
    const calculateDeliveryDays = () => {
      try {
        const today = new Date();
        // Try delivery_date, then fallback to stylist's delivery_days
        const deliveryDateString = item.delivery_date;
        const deliveryDate = new Date(deliveryDateString);
        
        // Calculate difference in days
        const timeDifference = deliveryDate.getTime() - today.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        // If the date is in the past or very far in the future, use stylist's delivery_days
        if (daysDifference <= 0 || daysDifference > 365) {
          return item.stylist_info?.delivery_days || 1;
        }
        
        return daysDifference;
      } catch (error) {
        // Fallback to stylist's delivery days if date calculation fails
        return item.stylist_info?.delivery_days || 1;
      }
    };

    const actualDeliveryDays = calculateDeliveryDays();

    // Handle chat button press
    const handleChatPress = async () => {
      if (!user?.id || !item.stylist_id) {
        console.error("Missing user ID or stylist ID for conversation.");
        return;
      }

      const data = {
        participant1_id: user.id,
        participant2_id: item.stylist_id,
      };

      const result = await startConversation(data);

      if (result.success) {
        // Store temporary contact info before navigating
        setTemporaryContact(result.data.id, {
          name: item.stylist_info?.name || "Unknown",
          profile_image_url: "", // Add profile image if available
          user_id: item.stylist_id,
        });

        router.push({
          pathname: "/customer/messages/[id]",
          params: { id: result.data.id },
        });
      } else {
        console.error("Failed to start conversation:", result.error);
      }
    };



    return (
      <View style={styles.cardWrapper}>
        <OfferCard
          rating={item.stylist_info?.rating ? item.stylist_info.rating.toString() : "5"}
          deliveryDays={`${actualDeliveryDays}`}
          location={item.stylist_info?.location || "Location not set"}
          price={item.price}
          stylistName={item.stylist_info?.name || "Unknown"}
          onChatPressBtn={handleChatPress}
        />
      </View>
    );
  };

  if (isLoading)
    return (
      <SafeAreaView style={styles.container}>
        <TitleHeader title={"Offers"} backArrow onPress={handleBackNavigation} />

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  if (error)
    return (
      <SafeAreaView style={styles.container}>
        <TitleHeader title={"Offers"} backArrow onPress={handleBackNavigation} />

        <View style={styles.centerContainer}>
          <Text style={{ color: "red" }}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  if (!offers || offers.length === 0)
    return (
      <SafeAreaView style={styles.container}>
        <TitleHeader title={"Offers"} backArrow onPress={handleBackNavigation} />

        <View style={styles.centerContainer}>
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              color: Colors.primaryGray,
            }}
          >
            No offers available for this style.
          </Text>
        </View>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TitleHeader title={"Offers"} backArrow onPress={handleBackNavigation} />
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={offers}
          renderItem={renderOffers}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </SafeAreaView>
  );
};

export default Offers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  cardWrapper: {
    width: 167,
    marginBottom: 24,
  },
  flatListContent: {
    paddingBottom: 70,
  },
  columnWrapper: {
    gap: 16,
  },
});

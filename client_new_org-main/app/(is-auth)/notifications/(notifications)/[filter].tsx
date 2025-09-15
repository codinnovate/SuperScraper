import { useNotifications } from "@/hooks/use-notifications";
import Colors from "@/styles/colors";
import { Body, Heading } from "@/styles/typography";
import { NotificationItem } from "@/types/notification.types";
import { useTransformedNotificationMessage } from "@/utils/notificationUtils";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface FilterItem {
  id: number;
  title: string;
  filterWord: "all" | "order" | "offer";
}

const filterNotifications = (
  notifications: NotificationItem[],
  filterType: FilterItem["filterWord"] = "all"
): NotificationItem[] => {
  switch (filterType) {
    case "order":
      return notifications.filter(
        (n) => {
          const messageText = n.message.toLowerCase();
          const titleText = n.title.toLowerCase();
          
          // Direct type matches for order-related notifications
          if (n.type === "order_offer" || n.type === "order_status") {
            return true;
          }
          
          // Include any notification that mentions order-related keywords
          // This is more inclusive to catch notifications that might be miscategorized
          const orderKeywords = [
            "order",
            "placed",
            "received", 
            "amount",
            "delivery",
            "payment",
            "completed",
            "cancelled",
            "refund",
            "invoice",
            "receipt"
          ];
          
          const hasOrderKeywords = orderKeywords.some(keyword => 
            messageText.includes(keyword) || titleText.includes(keyword)
          );
          
          // Also check for specific order-related phrases
          const orderPhrases = [
            "new order",
            "order created", 
            "order update",
            "order status",
            "order completed",
            "order cancelled",
            "payment received",
            "delivery scheduled"
          ];
          
          const hasOrderPhrases = orderPhrases.some(phrase =>
            messageText.includes(phrase) || titleText.includes(phrase)
          );
          
          return hasOrderKeywords || hasOrderPhrases;
        }
      );
    case "offer":
      return notifications.filter(
        (n) => {
          const messageText = n.message.toLowerCase();
          const titleText = n.title.toLowerCase();
          
          // Direct type matches for offer-related notifications
          if (n.type === "bid_offer" || n.type === "bid_status") {
            return true;
          }
          
          // Include any notification that mentions offer-related keywords
          const offerKeywords = [
            "offer",
            "bid",
            "proposal",
            "quote",
            "price",
            "amount",
            "counter",
            "accept",
            "reject",
            "expire",
            "expired",
            "style request",
            "style_request"
          ];
          
          const hasOfferKeywords = offerKeywords.some(keyword => 
            messageText.includes(keyword) || titleText.includes(keyword)
          );
          
          // Also check for specific offer-related phrases
          const offerPhrases = [
            "new offer",
            "offer received",
            "offer made",
            "bid received",
            "bid submitted",
            "proposal submitted",
            "price quote",
            "counter offer",
            "offer accepted",
            "offer rejected",
            "offer expired",
            "style request",
            "new bid"
          ];
          
          const hasOfferPhrases = offerPhrases.some(phrase =>
            messageText.includes(phrase) || titleText.includes(phrase)
          );
          
          return hasOfferKeywords || hasOfferPhrases;
        }
      );
    default:
      return notifications;
  }
};

const NotificationsList = () => {
  const { filter } = useLocalSearchParams();
  const [parsedData, setParsedData] = useState<NotificationItem[]>([]);

  const { isLoading, notifications, unreadCount, error } = useNotifications();

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      try {
        // Debug logging to see what notifications we have
        console.log("=== NOTIFICATION DEBUG ===");
        console.log(`Total notifications: ${notifications.length}`);
        console.log(`Current filter: ${filter}`);
        
        notifications.forEach((n, index) => {
          console.log(`[${index}] Type: "${n.type}", Title: "${n.title}", Message: "${n.message.substring(0, 100)}..."`);
        });
        
        const filtered = filterNotifications(notifications, filter as FilterItem["filterWord"]);
        console.log(`After filtering: ${filtered.length} notifications`);
        
        if (filter === "order") {
          console.log("=== ORDER FILTER DEBUG ===");
          notifications.forEach((n, index) => {
            const messageText = n.message.toLowerCase();
            const titleText = n.title.toLowerCase();
            const typeMatch = n.type === "order_offer" || n.type === "order_status";
            
            const orderKeywords = [
              "order", "placed", "received", "amount", "delivery", 
              "payment", "completed", "cancelled", "refund", "invoice", "receipt"
            ];
            
            const orderPhrases = [
              "new order", "order created", "order update", "order status",
              "order completed", "order cancelled", "payment received", "delivery scheduled"
            ];
            
            const hasOrderKeywords = orderKeywords.some(keyword => 
              messageText.includes(keyword) || titleText.includes(keyword)
            );
            
            const hasOrderPhrases = orderPhrases.some(phrase =>
              messageText.includes(phrase) || titleText.includes(phrase)
            );
            
            const keywordMatch = hasOrderKeywords || hasOrderPhrases;
            const final = typeMatch || keywordMatch;
            
            console.log(`[${index}] "${n.title}" - Type: ${n.type}, TypeMatch: ${typeMatch}, KeywordMatch: ${keywordMatch}, Final: ${final}`);
          });
        }
        
        console.log("=== END DEBUG ===");
        
        setParsedData(filtered);
      } catch (err) {
        console.error("Failed to parse data:", err);
      }
    }
  }, [notifications, filter]);

  const NotificationItemComponent = ({ item }: { item: NotificationItem }) => {
    const backgroundColor = item.isRead ? "white" : Colors.notifications;
    const opacity = item.isRead ? 0.5 : 1;
    const transformedMessage = useTransformedNotificationMessage(item.message);

    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/notifications/notification/[id]",
            params: { id: item.id },
          });
        }}
        style={[styles.notificationContainer, { backgroundColor, opacity }]}
      >
        <Heading style={{ fontFamily: "SEMIBOLD" }}>{item.title}</Heading>
        <Body>{`${transformedMessage.slice(0, 150)}...`}</Body>
      </TouchableOpacity>
    );
  };

  const renderNotificationsList = ({ item }: { item: NotificationItem }) => {
    return <NotificationItemComponent item={item} />;
  };

  if (isLoading)
    return (
      <View>
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
      {parsedData.length > 0 ? (
        <FlatList
          data={parsedData}
          renderItem={renderNotificationsList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 20 }}
        />
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <Body style={{ fontSize: 16 }}>No notifications</Body>
        </View>
      )}
    </View>
  );
};

export default NotificationsList;

const styles = StyleSheet.create({
  quickFiltersWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 40,
  },
  item: {
    padding: 10,
    borderRadius: 100,
    paddingLeft: 40,
    paddingRight: 40,
    width: "100%",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    fontFamily: "REGULAR",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationTitle: {
    textAlign: "center",
    width: "100%",
  },
  count: {
    backgroundColor: "red",
  },
  notificationContainer: {
    borderRadius: 8,
    padding: 10,
  },
});

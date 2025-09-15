import { useCurrentUser } from "@/hooks/use-auth";
import { initiatePaymentApi, updateOrderApi } from "@/lib/api/order";
import Colors from "@/styles/colors";
import { ChatOrder } from "@/types/chat.types";
import { OrderStatus } from "@/types/stylist.types";
import { formatShortDate } from "@/utils/format";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import Button from "../Button";

const ChatOrderCard = ({
  order,
  onOrderUpdate,
}: {
  order: ChatOrder;
  onOrderUpdate?: () => void;
}) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);
  const { user } = useCurrentUser();
  const router = useRouter();

  const discountPercent = Number(order.order_details?.discount_amount) || 0;
  const discountStartDate = new Date("2025-04-16");
  const discountEndDate = new Date(
    discountStartDate.getFullYear(),
    discountStartDate.getMonth() + 3,
    discountStartDate.getDate()
  );
  const discountText = `${discountPercent}% off every order for the next 3 months (until ${formatShortDate(
    discountEndDate.toISOString()
  )})`;

  const payableAmount =
    Number(order.order_details.out_fit_fee) +
    Number(order.order_details.delivery_fee) -
    Number(order.order_details.out_fit_fee) * (discountPercent / 100);

  const isDiscountActive =
    new Date() >= discountStartDate && new Date() <= discountEndDate;

  const computedOrderDetails = [
    {
      label: "Outfit Fee",
      value: `₦${order.order_details.out_fit_fee}`,
    },
    ...(isDiscountActive
      ? [
          {
            label: `Amount to pay (${discountPercent}% off)`,
            value: `₦${payableAmount}`,
          },
        ]
      : []),
    ...(Number(order.order_details.delivery_fee) > 0
      ? [
          {
            label: "Delivery Fee",
            value: `₦${order.order_details.delivery_fee}`,
          },
        ]
      : []),
    {
      label: "Delivery Location",
      value: order.order_details.delivery_location,
    },
    {
      label: "Delivery Date",
      value: formatShortDate(order.order_details.delivery_date),
    },
  ];

  const handleDeclinePayment = async () => {
    try {
      setIsDeclineLoading(true);

      const response = await updateOrderApi({
        orderId: order.id,
        status: OrderStatus.REJECTED,
      });

      if (response) {
        Alert.alert(
          "Order Declined",
          "You have successfully declined this order."
        );
        onOrderUpdate?.(); // Refresh the order data
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to decline the order. Please try again.";
        Alert.alert("Decline Failed", errorMessage);
      }
    } finally {
      setIsDeclineLoading(false);
    }
  };

  const handleContinueToPayment = async () => {
    try {
      setIsPaymentLoading(true);

      const payload = {
        order_id: order.id,
        stylist_id: order.stylist_id,
        // amount: Number(100),
        amount: isDiscountActive
          ? Number(payableAmount)
          : Number(
              Number(order.order_details.out_fit_fee) +
                Number(order.order_details.delivery_fee)
            ),
        email: user?.email || "",
      };

      const response = await initiatePaymentApi(payload);
      const payment_url = response?.payment_url;

      if (payment_url) {
        setPaymentUrl(payment_url);
        setShowPaymentModal(true);
      } else {
        Alert.alert(
          "Payment Error",
          "Failed to get payment URL. Please try again."
        );
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          "Failed to initiate payment. Please try again.";
        Alert.alert("Payment Failed", errorMessage);
      }
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setPaymentUrl(null);
    Alert.alert(
      "Payment Successful!",
      "Your payment has been processed successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            onOrderUpdate?.(); // Refresh the order data
          },
        },
      ]
    );
  };

  const handlePaymentError = () => {
    setShowPaymentModal(false);
    setPaymentUrl(null);
    Alert.alert(
      "Payment Failed",
      "There was an issue processing your payment. Please try again."
    );
  };

  const handleClosePayment = () => {
    setShowPaymentModal(false);
    setPaymentUrl(null);
  };

  const handleReviewOrder = () => {
    router.push({
      pathname: "/customer/order/confirm",
      params: { id: order.id },
    });
  };

  const handleCompleteOrder = async () => {
    try {
      const response = await updateOrderApi({
        orderId: order.id,
        status: OrderStatus.IN_REVIEW,
      });

      if (response) {
        Alert.alert(
          "Order Completed",
          "Order has been marked as completed successfully."
        );
        onOrderUpdate?.(); // Refresh the order data
      }
    } catch (error) {
      console.error("Error completing order:", error);
      Alert.alert(
        "Complete Failed",
        "Failed to complete the order. Please try again."
      );
    }
  };

  const handleEditOrder = () => {
    router.push({
      pathname: "/stylist/orders/edit/[id]",
      params: { id: order.id },
    });
  };

  const onWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // Check for success/failure URLs (adjust these based on your payment provider)
    if (url.includes("payment-success") || url.includes("success")) {
      handlePaymentSuccess();
    } else if (
      url.includes("payment-failed") ||
      url.includes("failed") ||
      url.includes("error")
    ) {
      handlePaymentError();
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#E2EEE8",
        borderRadius: 32,
        paddingVertical: 24,
        paddingHorizontal: 24,
        justifyContent: "center",
        maxWidth: 360,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Text
          style={{
            fontFamily: "BOLD",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Order Details
        </Text>
        <Text style={{ fontFamily: "REGULAR", fontSize: 12 }}>
          {order.status === OrderStatus.PENDING && "Pending"}
          {order.status === OrderStatus.IN_REVIEW && "In Review"}
          {order.status === OrderStatus.IN_PROGRESS && "Payment Completed"}
          {order.status === OrderStatus.COMPLETED && "Completed"}
          {order.status === OrderStatus.ACCEPTED && "Accepted"}
          {order.status === OrderStatus.REJECTED && "Rejected"}
          {order.status === OrderStatus.COUNTER_OFFERED && "Counter Offered"}
          {order.status === OrderStatus.EXPIRED && "Expired"}
        </Text>
      </View>
      {isDiscountActive && (
        <Text
          style={{
            fontFamily: "REGULAR",
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {discountText}
        </Text>
      )}
      {user?.id === order.customer_id && (
        <Text
          style={{
            fontFamily: "REGULAR",
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "#c44914ff",
          }}
        >
          All fees are excluding delivery fee (to be paid when you get your
          clothes)
        </Text>
      )}
      <View style={{ marginTop: 32, gap: 16 }}>
        {computedOrderDetails.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Text style={{ fontFamily: "REGULAR", fontSize: 14 }}>
              {item.label}
            </Text>
            <Text style={{ fontFamily: "MEDIUM", fontSize: 14 }}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      {/* Continue to payment and Decline button */}
      {user?.id === order.customer_id &&
        order.status === OrderStatus.PENDING && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 32,
              gap: 16,
            }}
          >
            <Button
              title={isPaymentLoading ? "Loading..." : "Continue to payment"}
              paddingLeft={16}
              paddingRight={16}
              fontFamily="SEMIBOLD"
              onPress={isPaymentLoading ? undefined : handleContinueToPayment}
              style={{ marginLeft: -18 }}
            />
            <Button
              title={isDeclineLoading ? "Declining..." : "Decline"}
              paddingLeft={16}
              paddingRight={16}
              fontFamily="SEMIBOLD"
              backgroundColor={Colors.primaryYellow}
              color="black"
              onPress={isDeclineLoading ? undefined : handleDeclinePayment}
            />
          </View>
        )}

      {/* Review order button */}
      {user?.id === order.customer_id &&
        order.status === OrderStatus.IN_REVIEW && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 32,
              gap: 16,
            }}
          >
            <Button
              title="Review order"
              paddingLeft={16}
              paddingRight={16}
              fontFamily="SEMIBOLD"
              onPress={handleReviewOrder}
            />
          </View>
        )}

      {/* Complete order button */}
      {user?.id === order.stylist_id &&
        order.status === OrderStatus.IN_PROGRESS && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 32,
              gap: 16,
            }}
          >
            <Button
              title="Complete order"
              paddingLeft={16}
              paddingRight={16}
              fontFamily="SEMIBOLD"
              onPress={handleCompleteOrder}
            />
          </View>
        )}

      {/* Edit button */}
      {user?.id === order.stylist_id &&
        order.status === OrderStatus.PENDING && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 32,
            }}
          >
            <Button
              title="Edit"
              paddingLeft={16}
              paddingRight={16}
              fontFamily="SEMIBOLD"
              backgroundColor={Colors.primaryYellow}
              color="black"
              onPress={handleEditOrder}
            />
          </View>
        )}

      {/* Have you made payment? */}
      {/* <View style={{ justifyContent: "center", marginTop: 32 }}>
        <Text
          style={{ fontFamily: "REGULAR", fontSize: 10, textAlign: "center" }}
        >
          Kindly check your order and make payment
        </Text>
        <View style={{ marginTop: 12 }}>
          <Button
            title="Have you made payment?"
            paddingLeft={16}
            paddingRight={16}
            fontFamily="SEMIBOLD"
          />
        </View>
      </View> */}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 18, fontFamily: "SEMIBOLD" }}>
              Complete Payment
            </Text>
            <Button
              title="Close"
              onPress={handleClosePayment}
              backgroundColor="transparent"
              color={Colors.primary}
              fontFamily="MEDIUM"
            />
          </View>

          {/* WebView */}
          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              style={{ flex: 1 }}
              onNavigationStateChange={onWebViewNavigationStateChange}
              startInLoadingState={true}
              renderLoading={() => (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={{ marginTop: 16, fontFamily: "REGULAR" }}>
                    Loading payment page...
                  </Text>
                </View>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No payment URL available</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ChatOrderCard;
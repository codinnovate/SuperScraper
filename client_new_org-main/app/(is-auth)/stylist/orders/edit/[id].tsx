import Button from "@/components/Button";
import OrderHeader from "@/components/header/OrderHeader";
import { useOrder } from "@/hooks/use-order";
import { getOrderByIdApi } from "@/lib/api/order";
import { createOrderSchema } from "@/schema/order.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { Order, OrderDetails } from "@/types/order.types";
import { OrderStatus } from "@/types/stylist.types";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditOrder = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [orderFetching, setOrderFetching] = useState(false);
  const [initialValues, setInitialValues] = useState({
    out_fit_fee: "",
    delivery_location: "",
  });

  const { id } = useLocalSearchParams();
  const { getOrderById, stylistUpdateOrder, isLoading } = useOrder();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setOrderFetching(true);
        const { order } = await getOrderByIdApi(id as string);
        if (order) {
          setOrderDetails(order);
          setInitialValues({
            out_fit_fee: order.order_details.out_fit_fee,
            delivery_location: order.order_details.delivery_location,
          });
          setDate(new Date(order.order_details.delivery_date));
        }
      } catch (error) {
        console.log("Error fetching order: ", error);
      } finally {
        setOrderFetching(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleEditOrder = async (
    values: Omit<OrderDetails, "delivery_date" | "delivery_fee">,
    actions: FormikHelpers<Omit<OrderDetails, "delivery_date" | "delivery_fee">>
  ) => {
    // Use the order details stored in state
    if (!orderDetails) {
      Alert.alert("Order not found.");
      return;
    }

    const payload: Omit<Order, "id" | "created_at"> = {
      customer_id: orderDetails.customer_id,
      stylist_id: orderDetails.stylist_id,
      conversation_id: orderDetails.conversation_id, // TODO: check this
      order_details: {
        out_fit_fee: values.out_fit_fee,
        delivery_fee: "0",
        delivery_location: values.delivery_location,
        delivery_date: date.toISOString(),
      },
      status: OrderStatus.PENDING,
    };

    const result = await stylistUpdateOrder(id as string, payload);

    if (result?.success) {
      actions.resetForm();
      router.back();
    } else {
      Alert.alert(result?.error || "Failed to update order. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[layout.container]}>
      <OrderHeader
        title={"Edit Order"}
        backArrow
        onPress={() => {
          router.dismiss();
        }}
      />
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validateOnMount={true}
        validationSchema={createOrderSchema}
        onSubmit={handleEditOrder}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={{ marginTop: 20, flex: 1 }}>
            <View>
              <Body style={{ fontFamily: "SEMIBOLD" }}>Outfit Fee</Body>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("out_fit_fee")}
                onBlur={handleBlur("out_fit_fee")}
                value={values.out_fit_fee}
                placeholder="out fit fee"
                keyboardType="numeric"
              />
              <Body style={{ color: "red" }}>
                {touched.out_fit_fee && errors.out_fit_fee}
              </Body>
            </View>

            <View>
              <Body style={{ fontFamily: "SEMIBOLD" }}>Delivery Location</Body>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("delivery_location")}
                onBlur={handleBlur("delivery_location")}
                value={values.delivery_location}
                placeholder="delivery location"
                keyboardType="default"
              />
              <Body style={{ color: "red" }}>
                {touched.delivery_location && errors.delivery_location}
              </Body>
            </View>

            <View>
              <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 12 }}>
                Delivery Date
              </Body>
              <Pressable
                style={{
                  borderWidth: 0.5,
                  borderColor: Colors.primaryGray,
                  borderRadius: 50,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TextInput
                  editable={false}
                  style={{
                    flex: 1,
                    fontSize: 10,
                    fontFamily: "REGULAR",
                    height: 45,
                  }}
                  value={date.toISOString().split("T")[0]}
                  placeholder="Delivery Date"
                />

                <Pressable style={{ padding: 5 }} onPress={() => setShow(true)}>
                  <AntDesign name="calendar" size={16} color="black" />
                </Pressable>

                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date;
                      setShow(Platform.OS === "ios");
                      setDate(currentDate);
                    }}
                  />
                )}
              </Pressable>
            </View>

            <View style={styles.floatingBtn}>
              {isLoading || orderFetching ? (
                <View style={styles.loadingBtn}>
                  <ActivityIndicator color={Colors.primaryLight} />
                </View>
              ) : (
                <Button
                  title="Update"
                  onPress={handleSubmit}
                  fontFamily="MEDIUM"
                />
              )}
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default EditOrder;

const styles = StyleSheet.create({
  floatingBtn: {
    width: "100%",
    marginTop: 32,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: Colors.primary,
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    zIndex: 9,
  },

  input: {
    borderWidth: 0.5,
    fontSize: 12,
    fontFamily: "REGULAR",
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginVertical: 10,
    height: 48,
  },
  loadingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
  },
});

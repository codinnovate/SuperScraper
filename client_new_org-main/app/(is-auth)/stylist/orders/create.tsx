import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import Button from "@/components/Button";
import OrderHeader from "@/components/header/OrderHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { useOrder } from "@/hooks/use-order";
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
import { SafeAreaView } from "react-native-safe-area-context";

const CreateOrder = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const { conversation_id, customer_id, stylist_id } = useLocalSearchParams();
  const { user } = useCurrentUser();

  const { createOrder, isLoading } = useOrder();



  const handleCreateOrder = async (
    values: Omit<OrderDetails, "delivery_date" | "delivery_fee">,
    actions: FormikHelpers<Omit<OrderDetails, "delivery_date" | "delivery_fee">>
  ) => {
    // Validate required parameters
    if (!customer_id || !stylist_id || !conversation_id) {
      Alert.alert("Error", "Missing required order information. Please try again.");
      return;
    }

    // Validate that the current user is the stylist
    if (stylist_id !== user?.id) {
      Alert.alert("Error", "You can only create orders for yourself.");
      return;
    }

    const payload: Omit<Order, "id" | "created_at"> = {
      customer_id: customer_id as string,
      stylist_id: stylist_id as string,
      conversation_id: conversation_id as string,
      order_details: {
        out_fit_fee: values.out_fit_fee,
        delivery_fee: "0",
        delivery_location: values.delivery_location,
        delivery_date: date.toISOString(),
      },
      status: OrderStatus.PENDING,
    };

    const result = await createOrder(payload);

    if (result?.success) {
      actions.resetForm();
      router.back();
    } else {
      Alert.alert(result?.error || "Failed to create order. Please try again.");
    }
  };

  return (
    <SafeAreaView style={[layout.container]}>
      <OrderHeader
        title={"Create Order"}
        backArrow
        onPress={() => {
          router.dismiss();
        }}
      />
      <Formik
        initialValues={{
          out_fit_fee: "",
          delivery_location: "",
        }}
        validateOnMount={true}
        validationSchema={createOrderSchema}
        onSubmit={handleCreateOrder}
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

            {/* <View>
              <Body style={{ fontFamily: "SEMIBOLD" }}>Delivery Fee</Body>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("delivery_fee")}
                onBlur={handleBlur("delivery_fee")}
                value={values.delivery_fee}
                placeholder="delivery fee"
                keyboardType="numeric"
              />
              <Body style={{ color: "red" }}>
                {touched.delivery_fee && errors.delivery_fee}
              </Body>
            </View> */}

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
                onPress={() => setShow(true)}
                style={{
                  borderWidth: 0.5,
                  borderColor: Colors.primaryGray,
                  borderRadius: 50,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  height: 48,
                }}
              >
                <Body style={{
                  flex: 1,
                  fontSize: 12,
                  fontFamily: "REGULAR",
                  color: "black"
                }}>
                  {date.toISOString().split("T")[0]}
                </Body>

                <AntDesign name="calendar" size={16} color="black" />

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
              {isLoading ? (
                <View style={styles.loadingBtn}>
                  <ActivityIndicator color={Colors.primaryLight} />
                </View>
              ) : (
                <Button
                  title="Submit"
                  onPress={handleSubmit}
                  fontFamily="MEDIUM"
                  paddingTop={18}
                  paddingBottom={18}
                  paddingLeft={140}
                  paddingRight={140}
                />
              )}
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default CreateOrder;

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
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 10, // Increased horizontal padding for better button appearance
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
    paddingVertical: 18, // Increased vertical padding to match the Button component
    paddingHorizontal: 40, // Increased horizontal padding for better appearance
    borderRadius: 50,
    minWidth: 120, // Added minimum width for consistency
  },
});
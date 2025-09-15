import Button from "@/components/Button";
import OrderHeader from "@/components/header/OrderHeader";
import { useBidDetails, useCreateOfferByStylist, useStylistOffers } from "@/hooks/use-bids";
import { offerSchema } from "@/schema/offer.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormValues {
  price: number | null;
  delivery_date: string;
}

const Bid = () => {
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<
    ImagePicker.ImagePickerAsset[] | undefined
  >();

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [price, setPrice] = useState("");

  const { bid, isLoading, error } = useBidDetails(id as string);

  // Debug bid data
  React.useEffect(() => {
    if (bid) {
      console.log("Bid data:", bid);
      console.log("Bid ID from params:", id);
      console.log("Bid _id:", bid._id);
      console.log("Bid customer_id:", bid.customer_id);
      console.log("Bid style_id:", bid.style_id);
    }
  }, [bid, id]);

  const updateImage = (updatedData: any) => {
    setImage(updatedData);
  };

  //Pick Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 3, // Optional: Limit the number of selections to 4
    });

    if (!result.canceled) {
      setImage(result.assets);
    } else {
      // Error occurred
      console.log("Image picking cancelled or error occurred:", result);
    }
  };
  function setFieldValue(arg0: string, arg1: string) {
    throw new Error("Function not implemented.");
  }

  const { createOfferByStylist, isLoading: createOfferLoading } =
    useCreateOfferByStylist();
  const { offers: stylistOffers, mutate: mutateOffers } = useStylistOffers();

  const handleSendOffer = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      // Validate required fields
      if (!values.price || values.price <= 0) {
        Alert.alert("Error", "Please enter a valid price");
        return;
      }

      if (!values.delivery_date) {
        Alert.alert("Error", "Please select a delivery date");
        return;
      }

      // Validate delivery date is in the future
      const deliveryDate = new Date(values.delivery_date);
      const today = new Date();
      if (deliveryDate <= today) {
        Alert.alert("Error", "Delivery date must be in the future");
        return;
      }

      // Validate bid data
      if (!bid?._id) {
        Alert.alert("Error", "Invalid bid data. Please try again.");
        return;
      }

      if (!bid?.customer_id) {
        Alert.alert("Error", "Customer information not found. Please try again.");
        return;
      }

      // Format date properly for API - backend expects ISO format with time
      const formattedDate = deliveryDate.toISOString(); // Full ISO format: YYYY-MM-DDTHH:mm:ss.sssZ

      const payload = {
        customer_id: bid.customer_id,
        style_id: bid.style_id,
        price: Number(values.price),
        delivery_date: formattedDate,
      };

      console.log("Sending offer with payload:", payload);

      // Use the bid_id for the API call since the endpoint expects the gig ID (which is the bid ID)
      const bidId = bid?._id || id;
      console.log("Using bid_id for API call:", bidId);
      const result = await createOfferByStylist(bidId as string, payload);

      if (result?.success) {
        // Refetch offers data to update the client bids list
        if (mutateOffers) {
          await mutateOffers();
        }
        
        actions.resetForm();
        setDate(new Date());
        setShow(false);
        setPrice("");
        router.back();
      } else {
        console.error("Offer creation failed:", result?.error);
        Alert.alert("Offer creation failed", result?.error || "Failed to send offer. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSendOffer:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[layout.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <OrderHeader
          title={"Bid"}
          backArrow
          onPress={() => {
            router.dismiss();
          }}
        />
        <Formik
          initialValues={{
            price: null as number | null,
            delivery_date: new Date().toISOString(),
          }}
          validateOnMount={true}
          validationSchema={offerSchema}
          onSubmit={handleSendOffer}
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
                <Body style={{ fontFamily: "SEMIBOLD" }}>Price</Body>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  value={values.price !== null ? String(values.price) : ""}
                  placeholder="Price"
                  keyboardType="numeric"
                />
                <Body>{touched.price && errors.price}</Body>
              </View>

              <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 12 }}>
                Delivery Date
              </Body>
              <Pressable
                onPress={() => {}}
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
                  value={
                    new Date(values.delivery_date).toISOString().split("T")[0]
                  }
                  placeholder="Delivery Date"
                  onChangeText={(text) => setFieldValue("price", text)}
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
                      handleChange("delivery_date")(currentDate.toISOString());
                    }}
                  />
                )}
              </Pressable>

              {/* <Heading
               style={{
                 fontFamily: "SEMIBOLD",
                 textAlign: "center",
                 marginTop: 50,
               }}
             >
               Upload Similar Style (optional)
             </Heading>
             <View
               style={{
                 borderWidth: 1,
                 borderRadius: 10,
                 borderStyle: "dashed",
                 paddingVertical: 40,
                 paddingHorizontal: 20,
                 marginBlock: 30,
               }}
             >
               <UploadFile
                 uploadName={" Style"}
                 onPress={pickImage}
                 uploadDetails={image}
                 updateUpload={updateImage}
               />
             </View> */}
              {createOfferLoading ? (
                <View style={[styles.loadingBtn, styles.floatingBtn]}>
                  <ActivityIndicator color={Colors.primaryLight} />
                </View>
              ) : (
                <Pressable
                  style={styles.floatingBtn}
                  onPress={() => handleSubmit()}
                >
                  <Button
                    title="Submit"
                    backgroundColor={Colors.primary}
                    fontFamily="MEDIUM"
                    marginRight={undefined}
                    marginLeft={undefined}
                    fontSize={undefined}
                  />
                </Pressable>
              )}
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Bid;

const styles = StyleSheet.create({
  floatingBtn: {
    width: "100%",
    height: 50,
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
    bottom: 10,
  },
  loadingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
  },
  input: {
    borderWidth: 0.5,
    fontSize: 10,
    fontFamily: "REGULAR",
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 12,
    marginVertical: 10,
    height: 45,
  },
});
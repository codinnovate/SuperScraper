import Button from "@/components/Button";
import OrderHeader from "@/components/header/OrderHeader";
import ImageUploader from "@/components/ImageUploader";
import { useCreateBid } from "@/hooks/use-bids";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body, Heading, Subheading } from "@/styles/typography";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const maxFileSize = 5300000; //5mb

const UploadStylePage = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [image, setImage] = useState<
    ImagePicker.ImagePickerAsset[] | undefined
  >();

  const handleImagesChange = (images: ImagePicker.ImagePickerAsset[]) => {
    setImage(images);
  };

  const { isLoading, createBidByCustomer } = useCreateBid();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("delivery_date", date.toISOString());

    if (image && image.length > 0) {
      // Append all images
      image.forEach((img, index) => {
        formData.append(`styles_images`, {
          uri: img.uri,
          type: img.mimeType || "image/jpeg",
          name: img.fileName || `style_image_${index + 1}.jpg`,
        } as any);
      });
    }

    const result = await createBidByCustomer(formData);

    if (result?.success) {
      Alert.alert("Success", "Style created successfully!", [
        {
          text: "OK",
          onPress: () =>
            router.replace({
              pathname: "/customer/style-uploaded",
              params: { id: result.data.id },
            }),
        },
      ]);
    } else {
      Alert.alert("Error", result?.error || "Failed to create style");
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <OrderHeader
        title={"Upload Style"}
        backArrow
        onPress={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 32, marginBottom: 80 }}
      >
        <ImageUploader
          onImagesChange={handleImagesChange}
          maxFileSize={maxFileSize}
          allowMultiple={true}
          uploadName="style"
          initialImages={image}
        />

        <View style={{ marginTop: 32 }}>
          <Body style={{ fontFamily: "MEDIUM" }}>Delivery Date</Body>
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
                fontSize: 12,
                fontFamily: "MEDIUM",
                height: 48,
              }}
              placeholderTextColor={Colors.inputPlaceholder}
              value={date.toISOString().split("T")[0]}
              placeholder="Delivery Date"
              onChangeText={(text) => {}}
            />

            <Pressable style={{ padding: 5 }} onPress={() => setShow(true)}>
              <AntDesign name="calendar" size={16} color="black" />
            </Pressable>

            {show && (
              <DateTimePicker
                value={date}
                textColor={Colors.primaryDark}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setShow(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </Pressable>
        </View>
        <View style={{ marginTop: 32 }}>
          <Button
            title="Submit"
            backgroundColor={isLoading ? Colors.primaryGray : Colors.primary}
            fontFamily="MEDIUM"
            onPress={isLoading ? undefined : handleSubmit}
          />
        </View>

        <View style={{ gap: 20, marginTop: 50, marginBottom: 10 }}>
          <Heading style={{ textAlign: "center" }}>or</Heading>
          <Subheading
            style={{
              textAlign: "center",
              paddingHorizontal: 100,
              lineHeight: 16,
            }}
          >
            You can explore our stylist curated designs
          </Subheading>
        </View>

        <View style={{ paddingHorizontal: 40, marginBottom: 50 }}>
          <Button
            onPress={() => router.push("/customer/top-styles")}
            title={"Explore"}
            marginRight={undefined}
            marginLeft={undefined}
            fontSize={14}
            fontFamily={"MEDIUM"}
            paddingBottom={8}
            paddingTop={10}
            backgroundColor="#EEC800"
            color={Colors.primaryDark}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadStylePage;

const styles = StyleSheet.create({});
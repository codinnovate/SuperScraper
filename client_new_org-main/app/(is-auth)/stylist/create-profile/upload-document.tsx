import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import ImageUploader from "@/components/ImageUploader";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const maxFileSize = 5300000;

const UploadDocumentPage = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [image, setImage] = useState<
    ImagePicker.ImagePickerAsset[] | undefined
  >();
  const handleImagesChange = (images: ImagePicker.ImagePickerAsset[]) => {
    setImage(images);
  };

  const { isLoading, updateProfile } = useUpdateProfile();

  const handleImageUpload = async () => {
    const formData = new FormData();
    if (image && image.length > 0) {
      // Append all images
      image.forEach((img, index) => {
        formData.append("profile_image_url", {
          uri: img.uri,
          name: `profile-${user?.id}.jpg`,
          type: img.mimeType || "image/jpeg",
        } as any);
      });
    }

    const res = await updateProfile(formData);
    if (res?.success) {
      Alert.alert("Success", "Profile image updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/stylist/add-styles"),
        },
      ]);
    } else {
      Alert.alert("Failed", res?.error || "Failed to update profile image.");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.primaryLight,
        flex: 1,
        paddingVertical: 16,
      }}
    >
      <TitleHeader
        title={"Fill your information"}
        // backArrow
        // onPress={() => router.replace("/stylist/create-profile/information")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[layout.container, { paddingVertical: 32, flex: 1 }]}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.container}>
          <View style={styles.fieldContainer}>
            <ImageUploader
              onImagesChange={handleImagesChange}
              maxFileSize={maxFileSize}
              allowMultiple={false}
              uploadName="your image"
              initialImages={image}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Button at Bottom */}
      <View style={styles.stickyButton}>
        <Button
          title={isLoading ? "Creating Profile..." : "Continue"}
          backgroundColor={isLoading ? Colors.primaryGray : Colors.primary}
          fontFamily="MEDIUM"
          onPress={handleImageUpload}
        />
      </View>
    </SafeAreaView>
  );
};

export default UploadDocumentPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  stickyButton: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 50,
    backgroundColor: "white",
  },
});

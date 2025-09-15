import Avatar from "@/components/Avatar";
import { Body, Title } from "@/styles/typography";
import { launchImageLibraryAsync } from "expo-image-picker";
import React from "react";

import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const AccountProfileHeader = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  const { isLoading, updateProfile } = useUpdateProfile();
  const [isChangeLoading, setIsChangeLoading] = React.useState(false);

  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        const formData = new FormData();
        formData.append("profile_image_url", {
          uri: result.assets[0].uri,
          name: `profile-${user?.id}.jpg`,
          type: result.assets[0].mimeType || "image/jpeg",
        } as any);

        setIsChangeLoading(true);
        // Update profile with new image
        const res = await updateProfile(formData);
        if (res?.success) {
          Alert.alert("Success", "Profile image updated successfully!");
        } else {
          Alert.alert(
            "Failed",
            res?.error || "Failed to update profile image."
          );
        }
      }
    } catch (error) {
      Alert.alert("Failed", "Failed to upload image. Please try again later.");
    } finally {
      setIsChangeLoading(false);
    }
  };

  return (
    <View style={styles.profileBg}>
      <View style={{ position: "relative", width: 80, height: 80 }}>
        <Avatar
          width={80}
          height={80}
          uri={user?.profile_image_url || ""}
          onPress={undefined}
          borderWidth={undefined}
          borderColor={undefined}
        />
        {isChangeLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 80,
              height: 80,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 40,
              zIndex: 2,
            }}
          >
            <Feather
              name="loader"
              size={32}
              color="#000"
              style={{ opacity: 0.8 }}
            />
          </View>
        )}
        <Pressable
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            backgroundColor: Colors.secondaryLight,
            borderRadius: 16,
            padding: 4,
            alignItems: "center",
            justifyContent: "center",
            elevation: 2,
          }}
          onPress={handleImageUpload}
        >
          <Feather name="edit-3" size={16} color={Colors.primaryLight} />
        </Pressable>
      </View>

      <View style={styles.usernameWrapper}>
        <Title style={{ color: Colors.primaryLight }}>{user?.full_name}</Title>
        {/* <Feather name="edit-3" size={16} color={Colors.primaryLight} /> */}
      </View>

      <Body style={{ color: Colors.primaryLight }}>{user?.email}</Body>
    </View>
  );
};

export default AccountProfileHeader;

const styles = StyleSheet.create({
  profileBg: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 40,
    gap: 5,
    padding: 16,
    // marginBottom: 30
  },

  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  referAndShareWrapper: {
    padding: 20,
    paddingBottom: 30,
    paddingTop: 30,
    borderRadius: 32,
    marginVertical: 20,
    backgroundColor: "#F3F4F6",
  },

  shareWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 100,
    marginTop: 10,
    backgroundColor: Colors.primaryLight,
  },

  referAFriendWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 9,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    marginBottom: 30,
  },
});

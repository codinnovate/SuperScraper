import Colors from "@/styles/colors";
import * as SecureStore from "expo-secure-store";
import React, { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ReviewCarousel } from "@/components/carousel/ReviewCarousel";
import AccountAddress from "@/components/form/AccountAddress";
import AccountProfileHeader from "@/components/form/AccountProfileHeader";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";
import { useStylistAccountTabRefetch } from "@/hooks/use-simple-tab-refetch";
import {
    useStylistProfile,
    useStylistReviews,
    useUpdateStylistProfile,
} from "@/hooks/use-stylist";
import { layout } from "@/styles/layout";
import { Body, Heading } from "@/styles/typography";
import { Feather } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";

const commentsList: any = [
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of. ",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "1",
  // },
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of. ",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "2",
  // },
  // {
  //   comment:
  //     "I deal wth female outfit and other ready-made you could think of. ",
  //   name: "Ola",
  //   country: "Nigeria",
  //   id: "3",
  // },
];

const { width } = Dimensions.get("window");
const itemWidth = width;

const DELIVERY_DAYS_STORAGE_KEY = "stylist_delivery_days";

export const Account = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  const { profile, mutate } = useStylistProfile();
  const { logout } = useLogout();

  const { updateStylistProfile, isLoading: isDeliveryDayLoading } =
    useUpdateStylistProfile();
  const { reviews, mutate: mutateReviews } = useStylistReviews(user?.id || "");

  // Account tab refetch
  useStylistAccountTabRefetch(mutate, mutateReviews, true);

  const [isDeliveryDayDisabled, setIsDeliveryDayDisabled] = useState(true);
  const deliveryDayInputRef = useRef<TextInput>(null);
  const [deliveryDayInput, setDeliveryDayInput] = useState("");

  // Load delivery days from secure storage on component mount
  React.useEffect(() => {
    const loadDeliveryDays = async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(DELIVERY_DAYS_STORAGE_KEY);
        if (storedValue) {
          setDeliveryDayInput(storedValue);
        } else if (profile?.delivery_days && profile.delivery_days !== 0) {
          setDeliveryDayInput(profile.delivery_days.toString());
        }
      } catch (error) {
        console.error('Error loading delivery days from storage:', error);
      }
    };
    
    loadDeliveryDays();
  }, []);

  // Update delivery day input when profile changes (but prioritize secure storage)
  React.useEffect(() => {
    const updateFromProfile = async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(DELIVERY_DAYS_STORAGE_KEY);
        if (!storedValue && profile?.delivery_days && profile.delivery_days !== 0) {
          setDeliveryDayInput(profile.delivery_days.toString());
        }
      } catch (error) {
        console.error('Error checking stored delivery days:', error);
      }
    };
    
    updateFromProfile();
  }, [profile?.delivery_days]);

  // Debug: Monitor profile changes
  React.useEffect(() => {
    console.log('Profile changed:', profile);
    console.log('Profile delivery_days:', profile?.delivery_days);
  }, [profile]);

  const handleDeliveryDayUpdate = async () => {
    if (deliveryDayInput.trim() === "") {
      Alert.alert("Error", "Please enter a valid delivery day.");
      return;
    }

    // Clean the input - remove any non-numeric characters except digits
    const cleanInput = deliveryDayInput.trim().replace(/[^0-9]/g, '');
    
    if (cleanInput === "") {
      Alert.alert("Error", "Please enter a valid number for delivery days.");
      return;
    }

    // Convert string to integer and validate
    const deliveryDaysInt = parseInt(cleanInput);
    if (isNaN(deliveryDaysInt) || deliveryDaysInt <= 0) {
      Alert.alert("Error", "Please enter a valid positive number for delivery days.");
      return;
    }

    // Try sending as JSON instead of FormData
    const jsonPayload = {
      delivery_days: deliveryDaysInt
    };

    // Debug: Log what we're sending
    console.log('Original input:', deliveryDayInput);
    console.log('Cleaned input:', cleanInput);
    console.log('Sending delivery_days:', deliveryDaysInt, 'Type:', typeof deliveryDaysInt);
    console.log('JSON payload:', jsonPayload);

    // Store in secure storage first
    try {
      await SecureStore.setItemAsync(DELIVERY_DAYS_STORAGE_KEY, deliveryDaysInt.toString());
    } catch (error) {
      console.error('Error saving delivery days to storage:', error);
    }

    // Optimistic update - update the cache immediately
    const optimisticData = {
      ...profile,
      delivery_days: deliveryDaysInt
    };
    
    // Optimistically update the cache
    await mutate(optimisticData, false);

    const res = await updateStylistProfile(jsonPayload);

    if (res?.success) {
      console.log('Update successful, response:', res);
      setIsDeliveryDayDisabled(true);
      Alert.alert("Success", "Delivery day updated successfully!");
      
      // Revalidate the data from the server
      await mutate();
      console.log('Profile after mutate:', profile);
    } else {
      console.log('Update failed:', res?.error);
      // Revert optimistic update on failure
      await mutate();
      Alert.alert("Failed", res?.error || "Failed to update delivery day.");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryLight, flex: 1 }}>
      <AccountProfileHeader />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={[layout.container, { paddingVertical: 32 }]}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View style={{ gap: 16 }}>
            <View style={{ backgroundColor: Colors.primaryLight }}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 100,
                  backgroundColor: "#F9FAFB",
                }}
              >
                <Body style={{ fontFamily: "MEDIUM", color: "#4D5761" }}>
                  Account
                </Body>
              </View>
            </View>

            {/* address */}
            <AccountAddress />

            {/* bank account */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 10 }}>
                <Heading style={{ fontFamily: "SEMIBOLD" }}>
                  Your Account Details
                </Heading>
                {user?.sub_account && (
                  <Body style={{ color: Colors.primaryDark }}>
                    {user?.sub_account?.account_name} -{" "}
                    {user?.sub_account?.account_number} -{" "}
                    {user?.sub_account?.bank_name}
                  </Body>
                )}
                {!user?.sub_account && (
                  <Body style={{ color: Colors.primaryDark }}>
                    No bank account linked yet
                  </Body>
                )}
              </View>

              {!user?.sub_account ? (
                <Pressable
                  onPress={() => {
                    router.push("/stylist/set-account");
                  }}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <Body
                    style={{ color: Colors.primary, fontFamily: "SEMIBOLD" }}
                  >
                    Edit
                  </Body>
                  <Feather name="edit-3" size={16} color={Colors.primary} />
                </Pressable>
              ) : (
                ""
              )}
            </View>

            {/* delivery day */}
            <View>
              <Heading style={{ fontFamily: "SEMIBOLD" }}>Delivery day</Heading>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flex: 1 }}>
                                     {isDeliveryDayDisabled ? (
                     <Body style={{ color: Colors.primaryDark, fontSize: 14 }}>
                       {deliveryDayInput ? `${deliveryDayInput} days` : "Not set"}
                     </Body>
                   ) : (
                                          <TextInput
                        ref={deliveryDayInputRef}
                        placeholder={"Enter number of days (e.g., 5)"}
                        style={{
                          fontFamily: "REGULAR",
                          color: Colors.primaryDark,
                          fontSize: 14,
                          paddingVertical: 8,
                          paddingHorizontal: 12,
                          backgroundColor: "#F9FAFB",
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: Colors.primary,
                        }}
                        placeholderTextColor={Colors.inputPlaceholder}
                        editable={!isDeliveryDayDisabled}
                        onChangeText={(text) => {
                          // Only allow numeric input
                          const numericText = text.replace(/[^0-9]/g, '');
                          setDeliveryDayInput(numericText);
                        }}
                        value={deliveryDayInput}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                   )}
                </View>

                {isDeliveryDayLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : isDeliveryDayDisabled ? (
                  <Pressable
                    onPress={() => {
                      setIsDeliveryDayDisabled(false);
                      setTimeout(() => {
                        deliveryDayInputRef.current?.focus();
                      }, 100);
                    }}
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                  >
                    <Body
                      style={{ color: "white", fontFamily: "SEMIBOLD" }}
                    >
                      Edit
                    </Body>
                    <Feather name="edit-3" size={16} color="white" />
                  </Pressable>
                ) : (
                  <Pressable
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                    }}
                    onPress={handleDeliveryDayUpdate}
                  >
                    <Body
                      style={{ fontFamily: "SEMIBOLD", color: "white" }}
                    >
                      Update
                    </Body>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <Body
            style={{
              marginBottom: 10,
              marginTop: 30,
              fontFamily: "SEMIBOLD",
            }}
          >
            Reviews from customers
          </Body>

          <View style={{ flex: 1, marginBottom: 20 }}>
            {reviews?.length === 0 ? (
              <Body style={{ textAlign: "center", color: Colors.primaryDark }}>
                No reviews yet
              </Body>
            ) : (
              <ReviewCarousel reviews={commentsList} />
            )}
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 100,
              backgroundColor: "#F9FAFB",
            }}
          >
            <Body>Security</Body>
          </View>

          <Pressable
            style={{ gap: 16, marginBlock: 16 }}
            onPress={() => {
              Linking.openURL(process.env.EXPO_PUBLIC_SUPPORT_LINK || "");
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 10 }}>
                <Heading style={{ fontFamily: "SEMIBOLD" }}>Support</Heading>
                <Body>wa/link907333267</Body>
              </View>

              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </View>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => router.push("/pages/stylist/terms-and-condition")}
            >
              <Heading style={{ fontFamily: "SEMIBOLD" }}>
                Terms and Conditions
              </Heading>
              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/stylist/change-password")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ gap: 10 }}>
                <Heading style={{ fontFamily: "SEMIBOLD" }}>
                  Change Password
                </Heading>
                <Body>Changle your password at anytime</Body>
              </View>

              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={14}
                  color={Colors.backArrow}
                />
              </View>
            </Pressable>

            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={() => {
                logout();
                router.replace("/auth/signin");
              }}
            >
              <Heading style={{ fontFamily: "SEMIBOLD" }}>Logout</Heading>
              <View
                style={{
                  padding: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="logout" size={14} color={Colors.error} />
              </View>
            </Pressable>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Account;

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

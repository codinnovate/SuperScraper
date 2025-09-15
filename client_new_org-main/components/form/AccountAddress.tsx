import Colors from "@/styles/colors";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  TextInput,
  View,
} from "react-native";

import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import { Body, Heading } from "@/styles/typography";
import { useRouter } from "expo-router";

const AccountAddress = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [isDisabled, setIsDisabled] = useState(true);
  const addressInputRef = useRef<TextInput>(null);
  const [addressInput, setAddressInput] = useState(user?.address || "");

  const { isLoading: isAddressLoading, updateProfile } = useUpdateProfile();

  // Update input when user data changes
  useEffect(() => {
    if (user?.address) {
      setAddressInput(user.address);
    }
  }, [user?.address]);

  const handleAddressUpdate = async () => {
    if (addressInput.trim() === "") {
      alert("Please enter a valid address.");
      return;
    }

    const payload = new FormData();
    payload.append("address", addressInput.trim());

    const res = await updateProfile(payload);
    if (res?.success) {
      setIsDisabled(true);
      Alert.alert("Success", "Address updated successfully!");
    } else {
      Alert.alert("Failed", res?.error || "Failed to update address.");
    }
  };

  return (
    <View>
      <Heading style={{ fontFamily: "SEMIBOLD" }}>Address</Heading>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          ref={addressInputRef}
          placeholder={"No 45 Tanke Ilorin"}
          style={{
            fontFamily: "REGULAR",
            color: Colors.primaryDark,
            fontSize: 12,
            flex: 1,
          }}
          placeholderTextColor={Colors.inputPlaceholder}
          editable={!isDisabled}
          onChangeText={setAddressInput}
          value={addressInput}
        />

        {isAddressLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : isDisabled ? (
          <Pressable
            onPress={() => {
              setIsDisabled(!isDisabled);
              setTimeout(() => {
                addressInputRef.current?.focus();
              }, 100);
            }}
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Body style={{ color: Colors.primary, fontFamily: "SEMIBOLD" }}>
              Edit
            </Body>
            <Feather name="edit-3" size={16} color={Colors.primary} />
          </Pressable>
        ) : (
          <Pressable
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
            onPress={() => {
              setIsDisabled(!isDisabled);
              handleAddressUpdate();
            }}
          >
            <Body style={{ fontFamily: "SEMIBOLD", color: Colors.primary }}>
              Update
            </Body>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AccountAddress;

import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import { useUserContext } from "@/contexts/UserContext";
import { useCurrentUser, useUpdateProfile } from "@/hooks/use-auth";
import { useBank } from "@/hooks/use-order";
import { getCurrentUser } from "@/lib/api/auth";
import { createSubAccountApi } from "@/lib/api/order";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { Bank, SubAccountPayload } from "@/types/order.types";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SetAccountPage = () => {
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankDropdown, setBankDropdown] = useState(false);
  const [checkedBank, setCheckedBank] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");

  const { user } = useCurrentUser();
  const { updateUser } = useUserContext();
  const { isLoading: bankLoading, banks } = useBank();

  const { isLoading, updateProfile } = useUpdateProfile();

  const bankOptions = banks.map((bank: Bank) => ({
    name: bank.name,
    code: bank.code,
  }));

  const handleAccountNumberChange = (text: string) => {
    // Remove any non-numeric characters
    const numericOnly = text.replace(/[^0-9]/g, "");
    setAccountNumber(numericOnly);
  };

  const toggleBank = (bankCode: string) => {
    if (checkedBank === bankCode) {
      setCheckedBank(null);
    } else {
      setCheckedBank(bankCode);
    }
    setBankDropdown(false); // Close dropdown after selection
  };

  const validateForm = () => {
    if (!accountName.trim()) {
      Alert.alert("Validation Error", "Please enter account name");
      return false;
    }
    if (!accountNumber.trim()) {
      Alert.alert("Validation Error", "Please enter account number");
      return false;
    }
    if (accountNumber.length < 10) {
      Alert.alert(
        "Validation Error",
        "Account number must be at least 10 digits"
      );
      return false;
    }
    if (!checkedBank) {
      Alert.alert("Validation Error", "Please select a bank");
      return false;
    }
    return true;
  };

  const handleSaveAccount = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload: SubAccountPayload = {
        user_id: user?.id || "",
        email: user?.email || "",
        settlement_bank: checkedBank ?? "",
        business_name: businessName.trim(),
        phone: phone.trim(),
        contact_name: accountName.trim(),
        account_number: accountNumber.trim(),
        percentage_charge: 0.0001,
      };

      await createSubAccountApi(payload);

      // Get and store user profile after successful connection
      const updatedUser: any = await getCurrentUser();
      await updateUser(updatedUser);

      Alert.alert("Success", "Account details saved successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save account details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title="Account Setup"
        backArrow
        onPress={() => router.back()}
      />

      <View style={{ marginTop: 32 }}>
        <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 2 }}>
          Business Name
        </Body>
        <TextInput
          placeholder="Business Name"
          value={businessName}
          onChangeText={setBusinessName}
          style={[
            styles.input,
            {
              marginBottom: 16,
            },
          ]}
        />

        <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 2 }}>
          Account Name
        </Body>
        <TextInput
          placeholder="Account Name"
          value={accountName}
          onChangeText={setAccountName}
          style={[
            styles.input,
            {
              marginBottom: 16,
            },
          ]}
        />

        <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 2 }}>
          Account Number
        </Body>
        <TextInput
          placeholder="Account Number"
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          keyboardType="numeric"
          maxLength={20}
          style={[
            styles.input,
            {
              marginBottom: 16,
            },
          ]}
        />

        {/* Bank Name as a select */}
        <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 2 }}>
          Bank Name
        </Body>
        <View>
          <Pressable
            onPress={() => setBankDropdown(!bankDropdown)}
            style={{
              borderWidth: 0.5,
              borderColor: Colors.primaryGray,
              borderRadius: 50,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              height: 45,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 10,
                fontFamily: "REGULAR",
                color: checkedBank ? "black" : "#999",
              }}
            >
              {checkedBank
                ? bankOptions.find((bank: Bank) => bank.code === checkedBank)
                    ?.name
                : "Select bank"}
            </Text>

            <AntDesign
              name={bankDropdown ? "up" : "down"}
              size={16}
              color="black"
            />
          </Pressable>
        </View>
        {bankDropdown && (
          <View
            style={{
              backgroundColor: "#F3F4F6",
              padding: 20,
              borderRadius: 10,
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            <ScrollView
              style={{ maxHeight: 300 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={{ gap: 12 }}>
                {bankOptions.length > 0 ? (
                  bankOptions.map((item: Bank, index: number) => {
                    const isChecked = checkedBank === item.code;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleBank(item.code)}
                        style={styles.checkboxWrapper}
                      >
                        <MaterialCommunityIcons
                          name={
                            isChecked
                              ? "checkbox-outline"
                              : "checkbox-blank-outline"
                          }
                          size={24}
                          color="black"
                        />
                        <Body style={{ marginLeft: 8, fontFamily: "REGULAR" }}>
                          {item.name}
                        </Body>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "REGULAR",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      No banks available
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}

        <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 2 }}>Phone</Body>
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={[
            styles.input,
            {
              marginBottom: 16,
            },
          ]}
        />

        {/* Save Button */}
        <View style={{ marginTop: 32 }}>
          {isSubmitting ? (
            <View style={styles.loadingBtn}>
              <ActivityIndicator color={Colors.primaryLight} />
              <Text
                style={{ marginLeft: 8, color: "white", fontFamily: "MEDIUM" }}
              >
                Saving...
              </Text>
            </View>
          ) : (
            <Button
              title="Save Account Details"
              onPress={handleSaveAccount}
              backgroundColor={Colors.primary}
              fontFamily="MEDIUM"
              fontSize={16}
            />
          )}
        </View>

        {/* Loading state for banks */}
        {bankLoading && (
          <View style={{ marginTop: 16, alignItems: "center" }}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={{ marginTop: 8, fontFamily: "REGULAR", fontSize: 12 }}>
              Loading banks...
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SetAccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
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

import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import {
  useCreateOrUpdateCustomerProfile,
  useCustomerProfile,
} from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const UploadMeasurement = () => {
  const { profile } = useCustomerProfile();
  const initialFields = [
    { key: "height", value: null },
    { key: "weight", value: null },
    { key: "chest", value: null },
    { key: "waist", value: null },
    { key: "hips", value: null },
    { key: "shoulders", value: null },
    { key: "inseam_leg", value: null },
    { key: "sleeve_length", value: null },
    { key: "neck_size", value: null },
    { key: "shoe_size", value: null },
  ];

  const [fields, setFields] = useState<{ key: string; value: number | null }[]>(
    () => {
      if (profile?.profile?.measurements) {
        return initialFields.map((field) => ({
          key: field.key,
          value:
            field.key in profile.profile.measurements
              ? Number(
                  profile.profile.measurements[
                    field.key as keyof typeof profile.profile.measurements
                  ]
                )
              : null,
        }));
      }
      return initialFields;
    }
  );

  // const addField = () => {
  //   setFields([...fields, { key: "", value: "" }]);
  // };

  const updateField = (index: number, type: "key" | "value", text: string) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index
          ? {
              ...field,
              [type]: type === "value" ? (text ? Number(text) : null) : text,
            }
          : field
      )
    );
  };

  // const removeField = (index: number) => {
  //   setFields(fields.filter((_, i) => i !== index));
  // };

  const { createProfile, updateProfile, isLoading } =
    useCreateOrUpdateCustomerProfile();

  const handleUpdate = async () => {
    const payload = {
      measurements: fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.key]: field.value,
        }),
        {}
      ),
      style_profile: profile?.profile?.style_profile || "",
    };

    let res;

    if (profile?.profile) {
      res = await updateProfile(payload);
    } else {
      res = await createProfile(payload);
    }

    if (res?.success) {
      alert("Measurements updated successfully!");
      router.replace("/customer/account");
    } else {
      alert(res?.error || "Failed to update measurements");
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={"Upload Measurement"}
        backArrow
        onPress={() => router.replace("/customer/account")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View style={{ gap: 20, paddingTop: 32 }}>
          {fields.map((item, index) => (
            <View key={index} style={styles.row}>
              {/* <TextInput
                placeholder="Key"
                inputMode="text"
                autoCapitalize="none"
                autoCorrect={false}
                value={item.key}
                onChangeText={(text) => updateField(index, "key", text)}
                style={[styles.input, { width: 42 }]}
                placeholderTextColor={Colors.inputPlaceholder}
                editable={false}
              /> */}
              <Text style={{ fontFamily: "MEDIUM", fontSize: 14, width: 100 }}>
                {item.key.charAt(0).toUpperCase() + item.key.slice(1)}:
              </Text>
              <TextInput
                placeholder="Value"
                inputMode="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                value={item.value !== null ? String(item.value) : ""}
                onChangeText={(text) => updateField(index, "value", text)}
                style={styles.input}
                placeholderTextColor={Colors.inputPlaceholder}
              />
              {/* {fields.length > 1 && (
                <Pressable onPress={() => removeField(index)}>
                  <Text style={styles.remove}>✕</Text>
                </Pressable>
              )} */}
            </View>
          ))}

          {/* Plus (+) rounded icon */}
          {/* <Pressable style={styles.floatingAdd} onPress={addField}>
            <Feather name="plus" size={24} color="#fff" />
          </Pressable> */}

          {/* Update Button */}
          <View style={{ paddingTop: 32 }}>
            {isLoading ? (
              <View style={styles.loadingBtn}>
                <ActivityIndicator color={Colors.primaryLight} />
              </View>
            ) : (
              <Button
                title="Update"
                onPress={handleUpdate}
                fontFamily="MEDIUM"
                fontSize={16}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadMeasurement;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    padding: 12,
  },
  remove: {
    color: "red",
    fontSize: 20,
    paddingHorizontal: 8,
  },
  floatingAdd: {
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  updateButton: {
    marginTop: 30,
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: "center",
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryGray,
    padding: 15,
    borderRadius: 50,
  },
});

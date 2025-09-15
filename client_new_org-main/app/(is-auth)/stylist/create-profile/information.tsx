import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import { useCreateStylistProfile } from "@/hooks/use-stylist";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
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

const genderOptions = ["Male", "Female"];
const expertiseOptions = [
  "personal_styling",
  "wardrobe_consultation",
  "color_analysis",
  "fashion_consulting",
  "styling_services",
].map((option) =>
  option
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
);

const InformationPage = () => {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [genderDropdown, setGenderDropdown] = useState(false);
  const [expertiseDropdown, setExpertiseDropdown] = useState(false);

  const { createStylistProfile, isLoading } = useCreateStylistProfile();

  const toggleGender = (option: string) => {
    setSelectedGender(option);
    setGenderDropdown(false);
  };

  const toggleExpertise = (option: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.primaryLight,
        flex: 1,
        paddingVertical: 16,
      }}
    >
      <TitleHeader title={"Fill your information"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[layout.container, { paddingVertical: 32 }]}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Congratulations Message */}
        {/* <View style={styles.congratsContainer}>
          <Body style={styles.congratsText}>
            Congratulations! Your email has been confirmed, kindly fill up the
            information below to proceed.
          </Body>
        </View> */}

        <Formik
          initialValues={{
            yearsOfExperience: "",
            bio: "",
            referralCode: "",
          }}
          onSubmit={async (values) => {
            if (!selectedGender) {
              Alert.alert("Error", "Please select your gender");
              return;
            }

            if (!values.yearsOfExperience.trim()) {
              Alert.alert("Error", "Please enter your years of experience");
              return;
            }

            if (selectedExpertise.length === 0) {
              Alert.alert("Error", "Please select at least one expertise");
              return;
            }

            if (!values.bio.trim()) {
              Alert.alert("Error", "Please tell us more about yourself");
              return;
            }

            try {
              const formData = new FormData();

              // Add form fields to FormData
              formData.append("gender", selectedGender);
              formData.append("experience_years", values.yearsOfExperience);
              formData.append("biography", values.bio);

              // Add specializations as a JSON string or individual items
              formData.append("expertise", JSON.stringify(selectedExpertise));

              // Add referral code if provided
              if (values.referralCode?.trim()) {
                formData.append("referral_code", values.referralCode);
              }

              const result = await createStylistProfile(formData);

              if (result?.success) {
                Alert.alert("Success", "Profile created successfully!", [
                  {
                    text: "OK",
                    onPress: () =>
                      router.replace("/stylist/create-profile/upload-document"),
                  },
                ]);
              } else {
                Alert.alert(
                  "Error",
                  result?.error || "Failed to create profile"
                );
              }
            } catch (error) {
              console.error("Error creating profile:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              {/* Gender Selection */}
              <View style={styles.fieldContainer}>
                <Body style={styles.fieldLabel}>Gender</Body>
                <Pressable
                  onPress={() => setGenderDropdown(!genderDropdown)}
                  style={styles.dropdownButton}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      { color: selectedGender ? "black" : "#999" },
                    ]}
                  >
                    {selectedGender || "Select gender"}
                  </Text>
                  <AntDesign
                    name={genderDropdown ? "up" : "down"}
                    size={16}
                    color="black"
                  />
                </Pressable>

                {genderDropdown && (
                  <View style={styles.dropdownContainer}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => toggleGender(option)}
                        style={styles.optionItem}
                      >
                        <MaterialCommunityIcons
                          name={
                            selectedGender === option
                              ? "radiobox-marked"
                              : "radiobox-blank"
                          }
                          size={24}
                          color={Colors.primary}
                        />
                        <Body style={styles.optionText}>{option}</Body>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Years of Experience */}
              <View style={styles.fieldContainer}>
                <Body style={styles.fieldLabel}>
                  Years of experience as a stylist
                </Body>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("yearsOfExperience")}
                  onBlur={handleBlur("yearsOfExperience")}
                  value={values.yearsOfExperience}
                  placeholder="Enter years of experience"
                  keyboardType="numeric"
                />
              </View>

              {/* Your Expertises */}
              <View style={styles.fieldContainer}>
                <Body style={styles.fieldLabel}>Your expertises</Body>
                <Pressable
                  onPress={() => setExpertiseDropdown(!expertiseDropdown)}
                  style={styles.dropdownButton}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: selectedExpertise.length > 0 ? "black" : "#999",
                      },
                    ]}
                  >
                    {selectedExpertise.length > 0
                      ? `${selectedExpertise.length} expertise${
                          selectedExpertise.length > 1 ? "s" : ""
                        } selected`
                      : "Select your expertises"}
                  </Text>
                  <AntDesign
                    name={expertiseDropdown ? "up" : "down"}
                    size={16}
                    color="black"
                  />
                </Pressable>

                {expertiseDropdown && (
                  <View style={styles.dropdownContainer}>
                    {expertiseOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => toggleExpertise(option)}
                        style={styles.optionItem}
                      >
                        <MaterialCommunityIcons
                          name={
                            selectedExpertise.includes(option)
                              ? "checkbox-outline"
                              : "checkbox-blank-outline"
                          }
                          size={24}
                          color={Colors.primary}
                        />
                        <Body style={styles.optionText}>{option}</Body>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Referral Code */}
              {/* <View style={styles.fieldContainer}>
                <Body style={styles.fieldLabel}>Referral code (optional)</Body>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("referralCode")}
                  onBlur={handleBlur("referralCode")}
                  value={values.referralCode}
                  placeholder="Enter referral code if you have one"
                />
              </View> */}

              {/* Tell us more about you */}
              <View style={styles.fieldContainer}>
                <Body style={styles.fieldLabel}>Tell us more about you</Body>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  onChangeText={handleChange("bio")}
                  onBlur={handleBlur("bio")}
                  value={values.bio}
                  placeholder="Tell us about your styling experience, approach, and what makes you unique..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Continue Button */}

              <Button
                title={isLoading ? "Creating Profile..." : "Continue"}
                backgroundColor={
                  isLoading ? Colors.primaryGray : Colors.primary
                }
                fontFamily="MEDIUM"
                onPress={isLoading ? undefined : handleSubmit}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InformationPage;

const styles = StyleSheet.create({
  congratsContainer: {
    backgroundColor: "#FFF9C4",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  congratsText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#92400E",
    textAlign: "center",
  },
  formContainer: {
    marginTop: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: "SEMIBOLD",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    borderWidth: 0.5,
    fontSize: 12,
    fontFamily: "REGULAR",
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    height: 45,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    borderRadius: 12,
    height: 100,
    paddingTop: 12,
  },
  dropdownButton: {
    borderWidth: 0.5,
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    backgroundColor: "#FAFAFA",
  },
  dropdownText: {
    fontSize: 12,
    fontFamily: "REGULAR",
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  optionText: {
    marginLeft: 12,
    fontFamily: "REGULAR",
    fontSize: 12,
  },
  uploadButton: {
    borderWidth: 0.5,
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 45,
    backgroundColor: "#FAFAFA",
  },
  uploadText: {
    fontSize: 12,
    fontFamily: "REGULAR",
    color: "#999",
    flex: 1,
  },
});

// export default InformationPage;

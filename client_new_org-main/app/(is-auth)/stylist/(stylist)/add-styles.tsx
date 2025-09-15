import Button from "@/components/Button";
import OrderHeader from "@/components/header/TitleHeader";
import ImageUploader from "@/components/ImageUploader";
import { useCreateStyle } from "@/hooks/use-stylist";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const maxFileSize = 5300000; //5mb

const categoryOptions = [
  "casual",
  "formal",
  "traditional",
  "wedding",
  "sports",
  "business",
  "party",
  "custom",
];
const genderOptions = ["Male", "Female"];

function AddStyles() {
  const [image, setImage] = useState<
    ImagePicker.ImagePickerAsset[] | undefined
  >();
  const [checkedCategory, setCheckedCategory] = useState<string>("");
  const [checkedGender, setCheckedGender] = useState<string>("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);

  const { createStyle, isLoading } = useCreateStyle();

  const handleCreateStyle = async (values: {
    styleName: string;
    category: string;
    gender: string;
    description?: string;
    price: string;
  }) => {
    if (!image || image.length === 0) {
      return;
    }

    if (!checkedCategory) {
      return;
    }

    if (!checkedGender) {
      return;
    }

    if (!values.styleName.trim()) {
      return;
    }

    if (!values.price.trim()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("style_name", values.styleName);
      formData.append("category", checkedCategory);
      formData.append("gender", checkedGender);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("is_available", "true");

      if (image && image.length > 0) {
        // Append all images
        image.forEach((img, index) => {
          formData.append(`images`, {
            uri: img.uri,
            type: img.mimeType || "image/jpeg",
            name: img.fileName || `style_image_${index + 1}.jpg`,
          } as any);
        });
      }

      const result = await createStyle(formData);

      if (result?.success) {
        Alert.alert("Success", "Style created successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
      }
    } catch (error) {
      console.error("Error creating style:", error);
    }
  };

  const toggleCategory = (option: string) => {
    setCheckedCategory(option);
    setCategoryDropdown(false);
  };

  const toggleGender = (option: string) => {
    setCheckedGender(option);
    setGenderDropdown(false);
  };

  const handleImagesChange = (images: ImagePicker.ImagePickerAsset[]) => {
    setImage(images);
  };

  return (
    <SafeAreaView style={layout.container}>
      <OrderHeader
        title={"Add Styles"}
        backArrow
        onPress={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <ImageUploader
            onImagesChange={handleImagesChange}
            maxFileSize={maxFileSize}
            allowMultiple={true}
            uploadName="style"
            initialImages={image}
          />

          <Formik
            initialValues={{
              styleName: "",
              category: "",
              gender: "",
              description: "",
              price: "",
            }}
            onSubmit={handleCreateStyle}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={{ marginTop: 20 }}>
                <Body style={{ fontFamily: "SEMIBOLD" }}>Style Name</Body>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("styleName")}
                  onBlur={handleBlur("styleName")}
                  value={values.styleName}
                  placeholder="Enter style name"
                />
                {touched.styleName && errors.styleName && (
                  <Text style={{ color: "red" }}>{errors.styleName}</Text>
                )}

                <Body style={{ fontFamily: "SEMIBOLD" }}>Price</Body>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  value={values.price}
                  placeholder="Enter price"
                  keyboardType="numeric"
                />
                {touched.price && errors.price && (
                  <Text style={{ color: "red" }}>{errors.price}</Text>
                )}

                <Body style={{ fontFamily: "SEMIBOLD", marginBottom: 12 }}>
                  Category
                </Body>
                <View>
                  <Pressable
                    onPress={() => setCategoryDropdown(!categoryDropdown)}
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
                        color: checkedCategory ? "black" : "#999",
                      }}
                    >
                      {checkedCategory || "Select category"}
                    </Text>

                    <AntDesign
                      name={categoryDropdown ? "up" : "down"}
                      size={16}
                      color="black"
                    />
                  </Pressable>
                </View>

                {categoryDropdown && (
                  <View
                    style={{
                      backgroundColor: "#F3F4F6",
                      padding: 20,
                      borderRadius: 10,
                      marginBottom: 16,
                      marginTop: 8,
                    }}
                  >
                    <View style={{ gap: 12 }}>
                      {categoryOptions.map((item) => {
                        const isChecked = checkedCategory === item;
                        return (
                          <TouchableOpacity
                            key={item}
                            onPress={() => toggleCategory(item)}
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
                            <Body
                              style={{ marginLeft: 8, fontFamily: "REGULAR" }}
                            >
                              {item}
                            </Body>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                <Body
                  style={{
                    fontFamily: "SEMIBOLD",
                    marginVertical: 12,
                  }}
                >
                  Gender
                </Body>
                <View
                  style={{
                    marginBottom: 12,
                  }}
                >
                  <Pressable
                    onPress={() => setGenderDropdown(!genderDropdown)}
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
                        color: checkedGender ? "black" : "#999",
                      }}
                    >
                      {checkedGender || "Select gender"}
                    </Text>

                    <AntDesign
                      name={genderDropdown ? "up" : "down"}
                      size={16}
                      color="black"
                    />
                  </Pressable>
                </View>

                {genderDropdown && (
                  <View
                    style={{
                      backgroundColor: "#F3F4F6",
                      padding: 20,
                      borderRadius: 10,
                      marginBottom: 16,
                      marginTop: 8,
                    }}
                  >
                    <View style={{ gap: 12 }}>
                      {genderOptions.map((item) => {
                        const isChecked = checkedGender === item;
                        return (
                          <TouchableOpacity
                            key={item}
                            onPress={() => toggleGender(item)}
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
                            <Body
                              style={{ marginLeft: 8, fontFamily: "REGULAR" }}
                            >
                              {item}
                            </Body>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}

                <Body style={{ fontFamily: "SEMIBOLD" }}>Description</Body>
                <TextInput
                  style={[
                    styles.input,
                    { height: 80, textAlignVertical: "top" },
                  ]}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  value={values.description}
                  placeholder="Enter description (optional)"
                  multiline
                  numberOfLines={3}
                />
                {touched.description && errors.description && (
                  <Text style={{ color: "red" }}>{errors.description}</Text>
                )}

                <Button
                  title={isLoading ? "Creating..." : "Create Style"}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default AddStyles;

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
    fontSize: 10,
    fontFamily: "REGULAR",
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 12,
    marginVertical: 10,
    height: 45,
  },
});

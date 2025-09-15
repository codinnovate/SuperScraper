import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import Input from "@/components/input/Input";
import { useForgotPassword } from "@/hooks/use-auth";
import { forgotPasswordSchema } from "@/schema/auth.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ForgotPasswordFormValues {
  email: string;
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { isLoading, forgotPassword } = useForgotPassword();

  const handleContinue = async (
    values: ForgotPasswordFormValues,
    actions: FormikHelpers<ForgotPasswordFormValues>
  ) => {
    const result = await forgotPassword(values.email);

    if (result?.success) {
      actions.resetForm();
      Alert.alert("Success", result.message || "Check your email for otp.");
      router.push({
        pathname: "/auth/forgot-password/enter-pin",
        params: { email: values.email },
      });
    } else {
      Alert.alert(
        "Failed",
        result?.error ||
          "An error occurred while sending the reset link. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={"Forgot Password"}
        backArrow
        onPress={() => router.back()}
      />

      <Formik
        initialValues={{ email: "" }}
        validateOnMount
        validationSchema={forgotPasswordSchema}
        onSubmit={handleContinue}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors,
        }) => (
          <View>
            <View style={{ marginTop: 32 }}>
              <Text style={{ fontFamily: "REGULAR", fontSize: 12 }}>
                Please enter your registered email to reset your password
              </Text>

              <View style={{ marginTop: 32, marginBottom: 50 }}>
                <Body>Email Address</Body>
                <Input
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder="Email Address"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  error={touched.email ? errors.email : undefined}
                />
              </View>
            </View>

            {isLoading ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                  padding: 15,
                  borderRadius: 50,
                }}
              >
                <ActivityIndicator color={Colors.primaryLight} />
              </View>
            ) : (
              <Button
                title="Continue"
                onPress={!values.email ? undefined : handleSubmit}
                marginRight={undefined}
                marginLeft={undefined}
                fontFamily="MEDIUM"
                fontSize={undefined}
              />
            )}
          </View>
        )}
      </Formik>

      <View style={{ flexDirection: "row", flex: 1, alignItems: "flex-end" }}>
        <Text style={styles.checkboxText}>
          I accept EasyFit{" "}
          <Text style={styles.innerTextTAndC}>terms of Use</Text> and{" "}
          <Text style={styles.innerTextTAndC}>Privacy Policy</Text> before
          signing up
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordPage;

const styles = StyleSheet.create({
  checkboxText: {
    fontFamily: "REGULAR",
    color: Colors.primaryDark,
    flex: 1,
    fontSize: 12,
    textAlign: "center",
  },

  innerTextTAndC: {
    color: Colors.primary,
  },
});

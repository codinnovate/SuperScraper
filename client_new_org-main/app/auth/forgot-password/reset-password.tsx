import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import Input from "@/components/input/Input";
import { useForgotPassword } from "@/hooks/use-auth";
import { resetPasswordSchema } from "@/schema/auth.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ResetPasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}

const ResetPasswordPage = () => {
  const router = useRouter();
  const { email, code } = useLocalSearchParams();
  const { resetPassword, isLoading } = useForgotPassword();

  const handleContinue = async (
    values: ResetPasswordFormValues,
    actions: FormikHelpers<ResetPasswordFormValues>
  ) => {
    const result = await resetPassword(
      email as string,
      code as string,
      values.newPassword
    );

    if (result?.success) {
      actions.resetForm();
      Alert.alert("Success", result.message || "Password reset successfully.");
      router.push("/auth/signin");
    } else {
      Alert.alert(
        "Failed",
        result?.error ||
          "An error occurred while resetting the password. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title={"Password Reset"} />
      <Formik
        initialValues={{ newPassword: "", confirmNewPassword: "" }}
        validateOnMount
        validationSchema={resetPasswordSchema}
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
            <View style={{ marginTop: 50 }}>
              <Body>Create New Password</Body>
              <Body style={[{ marginVertical: 20 }]}>
                Your new password must be different from previous used passwords
              </Body>

              <Body style={[{ color: Colors.warning }]}>
                Both passwords must match
              </Body>

              <View style={{ marginTop: 24 }}>
                <Body>New Password</Body>
                <Input
                  variant="password"
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  value={values.newPassword}
                  placeholder="New Password"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={touched.newPassword ? errors.newPassword : undefined}
                />
              </View>

              <View style={{ marginTop: 16, marginBottom: 50 }}>
                <Body>Confirm New Password</Body>
                <Input
                  variant="password"
                  onChangeText={handleChange("confirmNewPassword")}
                  onBlur={handleBlur("confirmNewPassword")}
                  value={values.confirmNewPassword}
                  placeholder="Confirm New Password"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={
                    touched.confirmNewPassword
                      ? errors.confirmNewPassword
                      : undefined
                  }
                />
              </View>

              {/* <Body style={globalStyles.errorMessage}>{touched.newPassword && errors.newPassword}</Body> */}
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
                title="Reset"
                onPress={handleSubmit}
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
        <Body>
          I accept EasyFit <Body>terms of Use</Body> and{" "}
          <Body>Private Policy</Body> before signing up
        </Body>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordPage;

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

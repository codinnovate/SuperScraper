import Button from "@/components/Button";
import Input from "@/components/input/Input";
import { useUpdateProfile } from "@/hooks/use-auth";
import { changePasswordSchema } from "@/schema/auth.schema";
import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import { router } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import React from "react";
import { ActivityIndicator, Alert, View } from "react-native";

interface ChangePasswordFormValues {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

const ChangePassword = () => {
  const { isLoading, changePassword } = useUpdateProfile();

  const handleChangePassword = async (
    values: ChangePasswordFormValues,
    actions: FormikHelpers<ChangePasswordFormValues>
  ) => {
    const result = await changePassword(values);

    if (result?.success) {
      actions.resetForm();
      Alert.alert(
        "Success",
        result.message || "Password changed successfully!"
      );
      router.replace("/customer/account");
    } else {
      Alert.alert(
        "Failed",
        result?.error ||
          "An error occurred while changing the password. Please try again."
      );
    }
  };

  return (
    <View>
      <Formik
        initialValues={{
          old_password: "",
          new_password: "",
          confirm_new_password: "",
        }}
        validateOnMount
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
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
              <Body style={[{ marginVertical: 8 }]}>
                Your new password must be different from previous used passwords
              </Body>

              <View style={{ marginTop: 24 }}>
                <Body>Current Password</Body>
                <Input
                  variant="password"
                  onChangeText={handleChange("old_password")}
                  onBlur={handleBlur("old_password")}
                  value={values.old_password}
                  placeholder="Current Password"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={touched.old_password ? errors.old_password : undefined}
                />
              </View>

              <View style={{ marginTop: 16 }}>
                <Body>New Password</Body>
                <Input
                  variant="password"
                  onChangeText={handleChange("new_password")}
                  onBlur={handleBlur("new_password")}
                  value={values.new_password}
                  placeholder="New Password"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={touched.new_password ? errors.new_password : undefined}
                />
              </View>

              <View style={{ marginTop: 16 }}>
                <Body>Confirm New Password</Body>
                <Input
                  variant="password"
                  onChangeText={handleChange("confirm_new_password")}
                  onBlur={handleBlur("confirm_new_password")}
                  value={values.confirm_new_password}
                  placeholder="Confirm New Password"
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={
                    touched.confirm_new_password
                      ? errors.confirm_new_password
                      : undefined
                  }
                />
              </View>
            </View>

            <View style={{ marginTop: 32 }}>
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
          </View>
        )}
      </Formik>
    </View>
  );
};

export default ChangePassword;

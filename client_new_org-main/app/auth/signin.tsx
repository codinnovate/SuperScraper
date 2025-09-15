import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema } from "@/schema/auth.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import Checkbox from "expo-checkbox";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginFormValues {
  email: string;
  password: string;
}

const SigninPage = () => {
  const { role } = useLocalSearchParams();
  const [hidePassword, setHidePassword] = useState(true);
  const [isChecked, setChecked] = useState(false);

  const { loginUser, isLoading } = useLogin();
  // Google Sign-In removed

  const handleLogin = async (
    values: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) => {
    const result = await loginUser(values);

    if (result?.success && result.user) {
      // Redirect based on user role
      if (result.user.user_type === "customer") {
        router.replace("/customer/home");
      } else if (result.user.user_type === "stylist") {
        router.replace("/stylist/home");
      }
    } else {
      // Show error message
      Alert.alert("Sign In Failed", result?.error || "Please try again");
    }
  };

  const handlePagesRoute = (page: "terms" | "privacy") => {
    if (!role) return;
    if (page === "terms") {
      router.push({ pathname: `/pages/${role}/terms-and-condition` } as any);
    } else if (page === "privacy") {
      router.push({ pathname: `/pages/${role}/privacy-policy` } as any);
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title={"Sign In"} backArrow onPress={() => router.back()} />

      <Formik
        initialValues={{ email: "", password: "" }}
        validateOnMount
        validationSchema={loginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.inputsWrapper}>
            {/* Email */}
            <View>
              <Body style={styles.label}>Email Address</Body>
              <TextInput
                style={styles.input}
                inputMode="email"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Email Address"
              />
              <Body style={styles.errorText}>
                {touched.email && errors.email}
              </Body>
            </View>

            {/* Password */}
            <View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="********"
                  secureTextEntry={hidePassword}
                />
                <Pressable
                  onPress={() => setHidePassword(!hidePassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={hidePassword ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color={Colors.primaryGray}
                  />
                </Pressable>
              </View>
              <Body style={styles.errorText}>
                {touched.password && errors.password}
              </Body>
            </View>

            {/* Remember me / Forgot password */}
            <View style={styles.rememberWrapper}>
              <View style={styles.rememberRow}>
                <Checkbox
                  style={styles.checkbox}
                  value={isChecked}
                  onValueChange={setChecked}
                  color={Colors.primary}
                />
                <Body style={styles.rememberText}>Remember</Body>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/auth/forgot-password")}
              >
                <Body style={styles.forgotText}>Forgot Password?</Body>
              </TouchableOpacity>
            </View>

            {/* Submit */}
            {isLoading ? (
              <View style={styles.loadingBtn}>
                <ActivityIndicator color={Colors.primaryLight} />
              </View>
            ) : (
              <Button
                title="Sign In"
                onPress={
                  isLoading ||
                  !values.email ||
                  !values.password ||
                  Object.keys(errors).length > 0
                    ? undefined
                    : handleSubmit
                }
                backgroundColor={Colors.primary}
                fontFamily="MEDIUM"
                fontSize={16}
                marginRight={undefined}
                marginLeft={undefined}
              />
            )}
          </View>
        )}
      </Formik>


    </SafeAreaView>
  );
};

export default SigninPage;

const styles = StyleSheet.create({
  inputsWrapper: {
    gap: 20,
    marginVertical: 30,
  },
  input: {
    borderWidth: 0.5,
    fontSize: 12,
    fontFamily: "REGULAR",
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginTop: 8,
    height: 48,
  },
  label: {
    fontFamily: "MEDIUM",
    fontSize: 10,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginTop: 10,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: "MEDIUM",
    color: Colors.primaryDark,
  },
  eyeIcon: {
    padding: 5,
  },
  errorText: {
    color: "red",
  },
  rememberWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1.5,
    borderColor: "black",
    borderRadius: 3,
  },
  rememberText: {
    fontSize: 10,
    fontFamily: "REGULAR",
  },
  forgotText: {
    color: Colors.primary,
    fontSize: 10,
    fontFamily: "REGULAR",
  },
  loadingBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
  },
  dividerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 30,
  },
  line: {
    borderBottomWidth: 0.5,
    borderColor: "#D2D6DB",
    height: 1,
    marginTop: 8,
    flex: 1,
  },
  orText: {
    fontSize: 16,
    fontFamily: "SEMIBOLD",
  },
  btnsWrapper: {
    gap: 21,
    marginVertical: 30,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderColor: Colors.primaryGray,
    borderWidth: 0.5,
    padding: 14,
    gap: 20,
  },
  btnTitle: {
    fontFamily: "MEDIUM",
    fontSize: 12,
  },
  termsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginBottom: 20,
  },
  link: {
    color: Colors.primary,
  },
});

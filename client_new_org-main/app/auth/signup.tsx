import { useEmailVerificationContext } from "@/contexts/EmailVerificationContext";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { signUpSchema } from "@/schema/auth.schema";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body, Subheading } from "@/styles/typography";
import { RegisterPayload } from "@/types/auth.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/Button";
import TitleHeader from "../../components/header/TitleHeader";

const SignupPage = () => {
  const { role } = useLocalSearchParams();
  const userType = role === "stylist" ? "stylist" : "customer";

  const router = useRouter();
  const { setVerificationData } = useEmailVerificationContext();
  const { loginUser } = useLogin();

  const [isChecked, setChecked] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [authProcessLoading, setAuthProcessLoading] = useState(false);

  const { registerUser, isLoading } = useRegister();
  // Google Sign-In removed

  const handleSignup = async (
    values: RegisterPayload,
    actions: FormikHelpers<RegisterPayload>
  ) => {
    setAuthProcessLoading(true);
    const result = await registerUser(values);

    if (result?.success) {
      if (result.data) {
        setVerificationData({
          verificationId: result.data.verification_id,
          email: values.email,
          userType: userType,
        });

        // auto log user in after signup
        const loginResult = await loginUser({
          email: values.email,
          password: values.password,
        });

        if (loginResult?.success && loginResult.user) {
          // Redirect based on user role
          if (loginResult.user.user_type == "customer") {
            return router.replace("/customer/home");
          } else if (loginResult.user.user_type == "stylist") {
            return router.replace("/stylist/home");
          }
        } else {
          router.replace("/auth/signin");
          Alert.alert(
            "Login Failed",
            loginResult?.error ||
              "An error occurred during login. Please try again."
          );
        }
      }

      // Alert.alert("Success", "Signup successful. Please login.");
      actions.resetForm();
      router.replace("/auth/signin");
    } else {
      Alert.alert(
        "Signup Failed",
        result?.error || "An error occurred during signup. Please try again."
      );
    }
    setAuthProcessLoading(false);
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
      <View style={styles.header}>
        <TitleHeader
          title="Sign Up"
          onPress={() => router.replace("/onboarding")}
          backArrow
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Formik
            initialValues={{
              fullname: "",
              email: "",
              phone: "",
              address: "",
              password: "",
              user_type: userType,
            }}
            validateOnMount
            validationSchema={signUpSchema}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <View style={styles.inputsWrapper}>
                {/* Fullname */}
                <View>
                  <Body style={styles.label}>Fullname</Body>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("fullname")}
                    onBlur={handleBlur("fullname")}
                    value={values.fullname}
                    placeholder="Fullname"
                  />
                  <Body style={styles.errorText}>
                    {touched.fullname && errors.fullname}
                  </Body>
                </View>

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

                {/* Phone */}
                <View>
                  <Body style={styles.label}>Phone Number</Body>
                  <TextInput
                    style={styles.input}
                    inputMode="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                    value={values.phone}
                    placeholder="Phone Number"
                  />
                  <Body style={styles.errorText}>
                    {touched.phone && errors.phone}
                  </Body>
                </View>

                {/* Address */}
                <View>
                  <Body style={styles.label}>Address</Body>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                    placeholder="Address"
                  />
                  <Body style={styles.errorText}>
                    {touched.address && errors.address}
                  </Body>
                </View>

                {/* Password */}
                <View>
                  <Body style={styles.label}>Password</Body>
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      style={styles.passwordInput}
                      inputMode="text"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      placeholder="**********"
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

                {/* Terms and Submit */}
                <View>
                  <View style={styles.checkboxWrapper}>
                    <View style={styles.checkboxRow}>
                      <Pressable
                        onPress={() => setChecked(!isChecked)}
                        style={styles.checkboxBtn}
                      >
                        <MaterialCommunityIcons
                          name={
                            isChecked ? "checkbox-marked" : "checkbox-blank-outline"
                          }
                          size={20}
                          color={Colors.primary}
                        />
                      </Pressable>
                      <Subheading>
                        I accept EasyFit{" "}
                        <Subheading
                          onPress={() => handlePagesRoute("terms")}
                          style={styles.link}
                        >
                          terms of Use
                        </Subheading>{" "}
                        and{" "}
                        <Subheading
                          onPress={() => handlePagesRoute("privacy")}
                          style={styles.link}
                        >
                          Privacy Policy
                        </Subheading>{" "}
                        before signing up
                      </Subheading>
                    </View>
                    {!isChecked && <Body style={styles.errorText}>{errMsg}</Body>}
                  </View>
                  {/* Submit */}
                  {authProcessLoading ? (
                    <View style={styles.loader}>
                      <ActivityIndicator color={Colors.primaryLight} />
                    </View>
                  ) : (
                    <Button
                      title="Sign up"
                      onPress={
                        isChecked
                          ? handleSubmit
                          : () =>
                              setErrMsg(
                                "You need to accept the terms and conditions"
                              )
                      }
                      backgroundColor={
                        isChecked ? Colors.primary : "rgba(2, 86, 44, 0.5)"
                      }
                      fontFamily="MEDIUM"
                      fontSize={16}
                      marginRight={undefined}
                      marginLeft={undefined}
                    />
                  )}
                </View>
              </View>
            )}
          </Formik>



          {/* Social Auth */}
          {/* <View style={styles.btnsWrapper}>
            <TouchableOpacity
              style={[styles.btn, { opacity: isGoogleSignInLoading ? 0.5 : 1 }]}
              onPress={() => handleGoogleSignIn(userType)}
              disabled={isGoogleSignInLoading}
            >
              <AntDesign name="google" size={13} color="black" />
              <Text style={styles.btnTitle}>Sign up with Google</Text>
            </TouchableOpacity>
          </View> */}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  header: {
    paddingBottom: 30,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  inputsWrapper: {
    gap: 10,
  },
  label: {
    fontFamily: "MEDIUM",
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.primaryGray,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginTop: 8,
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
    textAlign: "left",
  },
  loader: {
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
    marginVertical: 30,
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
    fontSize: 10,
    color: "black",
  },
  checkboxWrapper: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  checkboxBtn: {
    padding: 5,
  },
  link: {
    color: Colors.primary,
  },
});

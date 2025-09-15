import OTPVerification from "@/components/auth/OTPVerification";
import TitleHeader from "@/components/header/TitleHeader";
import { useEmailVerificationContext } from "@/contexts/EmailVerificationContext";
import { useEmailVerification, useLogout } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyEmailPage = () => {
  const { email, role } = useLocalSearchParams();
  const { verifyEmail, resendVerifyEmailOtp, isLoading, isResendLoading } =
    useEmailVerification();
  const {
    verificationId,
    email: contextEmail,
    setVerificationData,
    clearVerificationData,
  } = useEmailVerificationContext();

  const { logout } = useLogout();

  const handleVerifySuccess = async (otp: string) => {
    const result = await verifyEmail(verificationId as string, otp);

    if (result?.success) {
      clearVerificationData();
      Alert.alert("Success", "Email verified successfully! Please login.", [
        {
          text: "OK",
          onPress: () => {
            logout();
            router.replace("/auth/signin");

            // if (role === "customer") {
            //   router.replace("/customer/home");
            // } else if (role === "stylist") {
            //   router.replace("/stylist/home");
            // }
          },
        },
      ]);
    } else {
      Alert.alert(
        "Failed",
        result?.error ||
          "An error occurred while verifying your email. Please try again."
      );
    }
  };

  const handleResendOTP = async () => {
    const result = await resendVerifyEmailOtp(email as string);
    if (result?.success) {
      if (result.data) {
        setVerificationData({
          verificationId: result.data.verification_id,
          email: email as string,
          userType: role as string,
        });
      }

      Alert.alert(
        "Success",
        "A new verification code has been sent to your email."
      );
    } else {
      Alert.alert(
        "Failed",
        result?.error || "Failed to resend verification code."
      );
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title="Verify Email" onPress={() => router.back()} />

      <OTPVerification
        email={email as string}
        onVerifySuccess={handleVerifySuccess}
        onResendOTP={handleResendOTP}
        isLoading={isLoading}
        isResendLoading={isResendLoading}
        title="Verify Email"
      />

      <View style={styles.termsContainer}>
        <Body style={styles.termsText}>
          I accept EasyFit <Body style={styles.linkText}>terms of use</Body> and{" "}
          <Body style={styles.linkText}>Privacy Policy</Body> before signing up
        </Body>
      </View>
    </SafeAreaView>
  );
};

export default VerifyEmailPage;

const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  termsText: {
    textAlign: "center",
    fontSize: 12,
  },
  linkText: {
    color: Colors.primary,
  },
});

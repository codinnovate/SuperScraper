import Button from "@/components/Button";
import Input from "@/components/input/Input";
import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface OTPVerificationProps {
  email: string;
  onVerifySuccess: (otp: string) => void;
  onResendOTP: () => void;
  isLoading: boolean;
  isResendLoading?: boolean;
  otpLength?: number;
  title?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerifySuccess,
  onResendOTP,
  isLoading,
  isResendLoading = false,
  otpLength = 6,
  title = "Verify Email",
}) => {
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const inputRefs = useRef<Array<{ focus: () => void } | null>>([]);
  const [timer, setTimer] = useState(180);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    const countDown = () => {
      if (timer !== 0) {
        return setTimer((timer) => timer - 1);
      } else if (timer === 0) {
        clearInterval(interval);
        return;
      }
    };
    let interval = setInterval(countDown, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const onSubmit = () => {
    Keyboard.dismiss();
    const fullCode = otp.join("");
    onVerifySuccess(fullCode);
  };

  const handleResend = () => {
    setTimer(180);
    setOtp(Array(otpLength).fill(""));
    onResendOTP();
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.substring(0, 2) + "*".repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <View style={{ flex: 1 }}>
      <Body style={styles.paragraph}>
        Enter the {otpLength} digit code we sent to {maskEmail(email)}
      </Body>

      <View>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              style={styles.otpInput}
              inputContainerStyle={{ paddingHorizontal: 0 }}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholder="*"
              maxLength={1}
              keyboardType="number-pad"
            />
          ))}
        </View>
      </View>

      <View style={styles.timerContainer}>
        {isResendLoading ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator color={Colors.primary} />
          </View>
        ) : timer > 0 ? (
          <Body style={styles.timerText}>Wait for {formatTime(timer)} </Body>
        ) : (
          <TouchableOpacity onPress={handleResend} disabled={isResendLoading}>
            <Body style={styles.resendText}>Send again</Body>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingButton}>
          <ActivityIndicator color={Colors.primaryLight} />
        </View>
      ) : (
        <Button
          onPress={otp.every((digit) => digit !== "") ? onSubmit : undefined}
          title={title}
          marginRight={undefined}
          marginLeft={undefined}
          fontFamily={undefined}
          fontSize={undefined}
        />
      )}
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: "REGULAR",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    gap: 16,
    marginVertical: 20,
    justifyContent: "center",
  },
  otpInput: {
    fontFamily: "MEDIUM",
    fontSize: 16,
    color: "black",
    paddingHorizontal: 15,
    paddingTop: 5,
    textAlign: "center",
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  timerText: {
    fontFamily: "REGULAR",
    fontSize: 12,
  },
  resendText: {
    fontFamily: "MEDIUM",
    fontSize: 14,
    color: Colors.primary,
  },
  loadingButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 50,
  },
  linkText: {
    fontFamily: "MEDIUM",
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
  },
});

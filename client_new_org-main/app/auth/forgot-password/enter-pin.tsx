import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import Input from "@/components/input/Input";
import { useForgotPassword } from "@/hooks/use-auth";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Body } from "@/styles/typography";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EnterPinPage = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef<Array<{ focus: () => void } | null>>([]);
  const [timer, setTimer] = useState(120);

  const { verifyPin, isLoading } = useForgotPassword();

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus(); // CHANGE: back to previous
      }
    }
  };

  useEffect(() => {
    const countDown = () => {
      if (timer !== 0) {
        return setTimer((timer) => timer - 1);
      } else if (timer == 0) {
        // console.log("Its equal to 0");
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

    const updateUI = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    // console.log(updateUI);
    return updateUI;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    const fullCode = otp.join("");

    const result = await verifyPin(email as string, fullCode);

    if (result?.success) {
      setTimer(0);
      router.replace({
        pathname: "./reset-password",
        params: { email: email, code: fullCode },
      });
    } else {
      Alert.alert(
        "Failed",
        result?.error ||
          "An error occurred while verifying the pin. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader title="Forgot Password" onPress={() => router.back()} />
      <Text style={styles.paragraph}>
        Enter the {otp.length} digit pin we sent to [@ad**********cy@gmail.com]{" "}
        <Text style={{ fontFamily: "MEDIUM" }}></Text>
      </Text>

      <View style={{ flex: 1 }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              gap: 16,
              marginVertical: 20,
              justifyContent: "center",
            }}
          >
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={{
                  fontFamily: "MEDIUM",
                  fontSize: 16,
                  color: "black",
                  paddingHorizontal: 15,
                  paddingTop: 5,
                  textAlign: "center",
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                }}
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          {timer > 0 ? (
            <Body style={{ fontFamily: "REGULAR", fontSize: 12 }}>
              Wait for {formatTime(timer)}{" "}
            </Body>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setTimer(120);
              }}
            >
              <Body
                style={{
                  fontFamily: "MEDIUM",
                  fontSize: 14,
                  color: Colors.primary,
                }}
              >
                Send again
              </Body>
            </TouchableOpacity>
          )}
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
            onPress={
              otp.every((digit) => digit !== "")
                ? () => {
                    onSubmit();
                  }
                : undefined
            }
            title="Reset Password"
            marginRight={undefined}
            marginLeft={undefined}
            fontFamily={undefined}
            fontSize={undefined}
          />
        )}

        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
        >
          <Body>
            I accept EasyFit <Body>terms of use</Body> and{" "}
            <Body>Privacy Policy</Body> before signing up
          </Body>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EnterPinPage;

const styles = StyleSheet.create({
  headerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 50,
  },
  paragraph: {
    fontFamily: "REGULAR",
    marginTop: 50,
    marginBottom: 10,
  },

  checkboxText: {
    fontFamily: "MEDIUM",
    color: "black",
    fontSize: 10,
    textAlign: "center",

    // flex:1
  },

  innerTextTAndC: {
    color: Colors.primary,
  },
});

import Colors from "@/styles/colors"; // Adjust this import as needed
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

export type InputVariant =
  | "default"
  | "search"
  | "password"
  | "outlined"
  | "error"
  | "rounded"
  | "disabled"
  | "underline"
  | "icon";

interface InputProps extends TextInputProps {
  variant?: InputVariant;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  inputContainerStyle?: object;
}

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      variant = "default",
      error,
      iconLeft,
      iconRight,
      secureTextEntry,
      editable = true,
      onPress,
      inputContainerStyle,
      ...rest
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [text, setText] = useState("");

    const isPassword = variant === "password";
    const isErrored = variant === "error" && !!error;
    const hasError = !!error || isErrored;
    const isDisabled = variant === "disabled" || editable === false;

    const containerStyles = [
      styles.base,
      variant === "outlined" && styles.outlined,
      variant === "rounded" && styles.rounded,
      variant === "underline" && styles.underline,
      isErrored && styles.error,
      isDisabled && styles.disabled,
    ];

    return (
      <View style={{ marginBottom: error ? 18 : 12 }}>
        <View style={[containerStyles, inputContainerStyle]}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}

          <TextInput
            ref={ref}
            style={[styles.input, isDisabled && styles.inputDisabled]}
            secureTextEntry={isPassword && !isPasswordVisible}
            editable={!isDisabled}
            placeholderTextColor={Colors.inputPlaceholder}
            onChangeText={setText}
            value={text}
            {...rest}
          />

          {isPassword && (
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.iconRight}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={18}
                color={Colors.inputIcon}
              />
            </Pressable>
          )}

          {iconRight && (
            <Pressable onPress={onPress} style={styles.iconRight}>
              {iconRight}
            </Pressable>
          )}
        </View>

        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.inputBorder,
    borderWidth: 0.5,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginTop: 8,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontFamily: "MEDIUM",
    color: Colors.primaryDark,
  },

  output: {
    marginTop: 20,
    fontSize: 16,
    color: "red",
  },

  inputDisabled: {
    //   color: Colors.gray400,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    //   borderColor: Colors.gray400,
  },
  rounded: {
    borderRadius: 999,
  },
  underline: {
    borderBottomWidth: 1,
    borderRadius: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: "transparent",
  },
  error: {
    //   borderColor: Colors.danger,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 8,
    //   color: Colors.danger,
  },
  disabled: {
    //   backgroundColor: Colors.gray100,
    //   borderColor: Colors.gray300,
  },
});

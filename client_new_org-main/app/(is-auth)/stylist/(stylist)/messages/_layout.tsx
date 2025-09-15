import { Stack } from "expo-router";
import React from "react";

const MessageStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default MessageStackLayout;

import { useCurrentUser } from "@/hooks/use-auth";
import { Slot, useRouter } from "expo-router";
import React from "react";

const _layout = () => {
  const { user } = useCurrentUser();
  const router = useRouter();

  if (user?.user_type === "stylist") {
    router.replace("/stylist/home");
  }

  return <Slot />;
};

export default _layout;

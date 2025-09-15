import { useCurrentUser } from "@/hooks/use-auth";
import { useStylistProfile } from "@/hooks/use-stylist";
import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";

const _layout = () => {
  const { user } = useCurrentUser();
  const router = useRouter();
  const { profile, isLoading } = useStylistProfile();

  useEffect(() => {
    if (!user) return;

    if (user.user_type === "customer") {
      router.replace("/customer/home");
    }

    if (user.user_type === "stylist" && !isLoading && profile && !profile?.id) {
      router.replace("/stylist/create-profile/information");
    }
  }, [user, isLoading, profile]);

  if (!user || isLoading) return null;

  return <Slot />;
};

export default _layout;

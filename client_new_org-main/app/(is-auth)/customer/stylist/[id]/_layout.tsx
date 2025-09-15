import Button from "@/components/Button";
import TitleHeader from "@/components/header/TitleHeader";
import UnscrollabeNav from "@/components/horizontal-nav/UnscrollabeNav";
import { useChatWebSocket } from "@/contexts/ChatWebSocketContext";
import { useCurrentUser } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { useCustomerStylistProfile } from "@/hooks/use-customer";
import Colors from "@/styles/colors";
import { layout } from "@/styles/layout";
import { Slot, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NAV_ITEMS = [
  {
    id: "portfolio",
    title: "Stylist Portfolio",
    route: "./portfolio",
  },
  {
    id: "details",
    title: "Stylist Details",
    route: "./details",
  },
];

const StylistProfileLayout = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState(NAV_ITEMS[0].id ?? "portfolio");

  const { user } = useCurrentUser();
  const { stylistProfile } = useCustomerStylistProfile(id as string);
  const { setTemporaryContact } = useChatWebSocket();

  const stylistName =
    stylistProfile?.first_name && stylistProfile?.last_name
      ? `${stylistProfile.first_name} ${stylistProfile.last_name}`
      : "Stylist Profile";

  const { startConversation } = useChat();

  const handleConversation = async () => {
    if (!user?.id || !stylistProfile?.user_id) {
      console.error("Missing participant IDs for conversation.");
      return;
    }

    const data = {
      participant1_id: user.id,
      participant2_id: stylistProfile.user_id,
    };

    const result = await startConversation(data);

    if (result.success) {
      // Store temporary contact info before navigating
      setTemporaryContact(result.data.id, {
        name: stylistName,
        profile_image_url: stylistProfile.profile_image_url,
        user_id: stylistProfile.user_id,
      });

      // console.log("✅ Conversation started and temporary contact stored");

      router.push({
        pathname: "/customer/messages/[id]",
        params: { id: result.data.id },
      });
    } else {
      console.error("Failed to start conversation:", result.error);
    }
  };

  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        title={stylistName}
        backArrow
        onPress={() => router.back()}
      />

      <View style={{ marginTop: 24 }}>
        <UnscrollabeNav
          NAV_ITEMS={NAV_ITEMS}
          selectedItem={filter}
          onSelect={setFilter}
        />
      </View>

      <Slot />

      <View style={styles.floatingBtn}>
        <Button
          title="Chat me up"
          backgroundColor={Colors.primary}
          fontFamily="MEDIUM"
          onPress={handleConversation}
          marginRight={undefined}
          marginLeft={undefined}
          fontSize={16}
        />
      </View>
    </SafeAreaView>
  );
};

export default StylistProfileLayout;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  item: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
  },
  floatingBtn: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    marginBottom: 90,
    paddingHorizontal: 16,
  },
});

import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export function CustomHeader({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const StylistTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 30,
          paddingTop: 10,
          height: 90,
          shadowColor: Colors.primary,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 10,
        },
        // header: ({ route }) => (
        //   <CustomHeader title={route.name} />
        // ),

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: ({ focused }) => {
            return (
              <Body
                style={{
                  fontSize: 8,
                  color: Colors.primary,
                  fontFamily: focused ? "SEMIBOLD" : "REGULAR",
                  opacity: focused ? 1 : 0.4,
                }}
              >
                Home
              </Body>
            );
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={16}
                color={Colors.primary}
                style={{ opacity: focused ? 1 : 0.4 }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="(orders)"
        options={{
          tabBarLabel: ({ focused, color }) => {
            return (
              <Body
                style={{
                  fontSize: 8,
                  color: Colors.primary,
                  fontFamily: focused ? "SEMIBOLD" : "REGULAR",
                  opacity: focused ? 1 : 0.4,
                }}
              >
                Orders
              </Body>
            );
          },
          tabBarIcon: ({ focused, color }) => {
            return (
              <MaterialCommunityIcons
                name={focused ? "shopping" : "shopping-outline"}
                size={16}
                color={Colors.primary}
                style={{ opacity: focused ? 1 : 0.4 }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="add-styles"
        options={{
          tabBarLabel: () => {
            return (
              <Text
                style={{
                  fontSize: 8,
                  color: Colors.primary,
                  fontFamily: "SEMIBOLD",
                  paddingBottom: 8,
                }}
              >
                Add Styles
              </Text>
            );
          },

          tabBarIcon: () => {
            return (
              <>
                <View
                  style={{
                    height: 48,
                    width: 48,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: '#fff',
                    marginBottom: 30,
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                  }}
                >
                  <Ionicons
                    name="add-circle"
                    size={50}
                    color={Colors.primary}
                  />
                </View>
              </>
            );
          },

          tabBarItemStyle: {
            marginTop: -15, // ⬆️ Raise this tab item
            borderRadius: 20,
          },
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: ({ focused, color }) => {
            return (
              <Text
                style={{
                  fontSize: 8,
                  color: Colors.primary,
                  fontFamily: focused ? "SEMIBOLD" : "REGULAR",
                  opacity: focused ? 1 : 0.4,
                }}
              >
                Messages
              </Text>
            );
          },
          tabBarIcon: ({ focused, color }) => {
            return (
              <MaterialCommunityIcons
                name={focused ? "message-badge" : "message-badge-outline"}
                size={16}
                color={Colors.primary}
                style={{ opacity: focused ? 1 : 0.4 }}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: ({ focused, color }) => {
            return (
              <Text
                style={{
                  fontSize: 8,
                  color: Colors.primary,
                  fontFamily: focused ? "SEMIBOLD" : "REGULAR",
                  opacity: focused ? 1 : 0.4,
                }}
              >
                Account
              </Text>
            );
          },
          tabBarIcon: ({ focused, color }) => {
            return (
              <MaterialCommunityIcons
                name={focused ? "account-circle" : "account-circle-outline"}
                size={16}
                color={Colors.primary}
                style={{ opacity: focused ? 1 : 0.4 }}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default StylistTabsLayout;

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

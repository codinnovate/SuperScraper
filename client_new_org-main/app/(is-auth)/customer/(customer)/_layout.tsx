import Colors from "@/styles/colors";
import { Body } from "@/styles/typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const CustomerTabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: ({ focused }) => (
            <Body
              style={[
                styles.tabLabel,
                focused ? styles.focusedLabel : styles.unfocusedLabel,
              ]}
            >
              Home
            </Body>
          ),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={16}
              color={Colors.primary}
              style={focused ? styles.focusedIcon : styles.unfocusedIcon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          tabBarLabel: ({ focused }) => (
            <Body
              style={[
                styles.tabLabel,
                focused ? styles.focusedLabel : styles.unfocusedLabel,
              ]}
            >
              Favourites
            </Body>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name={focused ? "favorite" : "favorite-border"}
              size={16}
              color={Colors.primary}
              style={focused ? styles.focusedIcon : styles.unfocusedIcon}
            />
            // <MaterialIcons name="favorite-border" size={24} color="black" />
          ),
        }}
      />

      <Tabs.Screen
        name="upload-style"
        options={{
          tabBarLabel: () => <Body style={styles.uploadLabel}>Upload</Body>,
          tabBarIcon: () => (
            <View style={styles.uploadIconWrapper}>
              <Ionicons name="add-circle" size={50} color={Colors.primary} />
            </View>
          ),
          tabBarItemStyle: styles.uploadItem,
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.focusedLabel : styles.unfocusedLabel,
              ]}
            >
              Messages
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "message-badge" : "message-badge-outline"}
              size={16}
              color={Colors.primary}
              style={focused ? styles.focusedIcon : styles.unfocusedIcon}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="offers"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                styles.tabLabel,
                focused ? styles.focusedLabel : styles.unfocusedLabel,
              ]}
            >
              Offers
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? "offer" : "offer"}
              size={16}
              color={Colors.primary}
              style={focused ? styles.focusedIcon : styles.unfocusedIcon}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default CustomerTabsLayout;

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tabBar: {
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
  tabLabel: {
    fontSize: 8,
    color: Colors.primary,
  },
  focusedLabel: {
    fontFamily: "SEMIBOLD",
    opacity: 1,
  },
  unfocusedLabel: {
    fontFamily: "REGULAR",
    opacity: 0.4,
  },
  focusedIcon: {
    opacity: 1,
  },
  unfocusedIcon: {
    opacity: 0.4,
  },
  uploadLabel: {
    fontSize: 8,
    color: Colors.primary,
    fontFamily: "SEMIBOLD",
    paddingBottom: 8,
  },
  uploadIconWrapper: {
    height: 48,
    width: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  uploadItem: {
    marginTop: -15,
    borderRadius: 20,
  },
});

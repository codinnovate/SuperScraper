import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../components/Button";
import Pagination from "../components/carousel/Pagination";
import SliderItem from "../components/carousel/Slider-item";

import { checkAuthStatus, clearAllData } from "@/lib/storage/secure-store";
import Colors from "@/styles/colors";
import { Subheading, Title } from "@/styles/typography";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width: SRC_WIDTH } = Dimensions.get("window");

interface SliderItemType {
  id: string;
  image: any;
}

const SliderData: SliderItemType[] = [
  {
    image: require("../assets/images/img1.jpg"),
    id: "1",
  },
  {
    image: require("../assets/images/img2.jpg"),
    id: "2",
  },
  {
    image: require("../assets/images/img3.jpg"),
    id: "3",
  },
];

const OnboardingScreen = () => {
  const [data, setData] = useState<SliderItemType[]>(SliderData);
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [roleModal, setRoleModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"sign in" | "sign up">(
    "sign up"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const router = useRouter();

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        setIsLoading(true);

        const authStatus = await checkAuthStatus();

        if (authStatus.isAuthenticated && authStatus.userProfile) {
          const userRole = authStatus.userProfile.user_type;

          // Redirect based on user role
          if (userRole === "customer") {
            router.replace("/customer/home");
          } else if (userRole === "stylist") {
            router.replace("/stylist/home");
          } else {
            // Unknown role, clear data and stay on onboarding
            await clearAllData();
          }
        } else {
          setAuthChecked(true);
        }
      } catch (error) {
        setAuthChecked(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingAuth();
  }, [router]);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      const firstIndex = viewableItems[0]?.index;
      if (firstIndex !== undefined && firstIndex !== null) {
        setPaginationIndex(firstIndex % SliderData.length);
      }
    },
    []
  );

  const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  // Show loading spinner while checking authentication
  if (isLoading || !authChecked) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselWrapper}>
        <Animated.FlatList
          data={data}
          renderItem={({ item, index }) => (
            <SliderItem item={item} index={index} scrollX={scrollX} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScrollHandler}
          scrollEventThrottle={16}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
          onEndReached={() => setData([...SliderData])}
          onEndReachedThreshold={0.5}
        />

        <Pagination
          data={data}
          scrollX={scrollX}
          paginationIndex={paginationIndex}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.textWrapper}>
          <Title style={styles.title}>It's Easy</Title>
          <Subheading style={styles.subheading}>
            Find your perfect stylist and book appointments with ease
          </Subheading>
        </View>

        <View style={styles.btnsInColumnWrapper}>
          <Button
            fontFamily="MEDIUM"
            fontSize={16}
            title="Sign Up"
            onPress={() => {
              setSelectedOption("sign up");
              setRoleModal(true);
            }}
            marginRight={undefined}
            marginLeft={undefined}
          />

          <Button
            fontFamily="MEDIUM"
            fontSize={16}
            title="Sign In"
            backgroundColor={Colors.primaryYellow}
            color="black"
            onPress={() => {
              setSelectedOption("sign in");
              setRoleModal(true);
            }}
            marginRight={undefined}
            marginLeft={undefined}
          />
        </View>
      </View>

      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={roleModal}
          onRequestClose={() => setRoleModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(1, 26, 13, 0.5)",
              justifyContent: "center",
            }}
          >
            <View>
              <Pressable
                onPress={() => {
                  setRoleModal(false);
                }}
                style={styles.closeIcon}
              >
                <AntDesign name="close" size={24} color={Colors.primaryLight} />
              </Pressable>

              <View style={styles.modal}>
                <View style={styles.titleRow}>
                  <Title style={styles.modalTitle}>How do you want to </Title>
                  <Title style={[styles.modalTitle, styles.capitalize]}>
                    {selectedOption}
                  </Title>
                </View>

                <View style={styles.btnsWrapper}>
                  <Button
                    fontFamily="MEDIUM"
                    fontSize={16}
                    title="As a Stylist"
                    onPress={() => {
                      if (selectedOption === "sign up") {
                        setRoleModal(false);
                        router.navigate({
                          pathname: "/auth/signup",
                          params: { role: "stylist" },
                        });
                      } else {
                        setRoleModal(false);
                        router.navigate({
                          pathname: "/auth/signin",
                          params: { role: "stylist" },
                        });
                      }
                    }}
                    marginRight={undefined}
                    marginLeft={undefined}
                  />

                  <Button
                    fontFamily="MEDIUM"
                    fontSize={16}
                    title="As a Customer"
                    backgroundColor={Colors.primaryYellow}
                    onPress={() => {
                      if (selectedOption === "sign up") {
                        setRoleModal(false);
                        router.navigate({
                          pathname: "/auth/signup",
                          params: { role: "customer" },
                        });
                      } else {
                        setRoleModal(false);
                        router.navigate({
                          pathname: "/auth/signin",
                          params: { role: "customer" },
                        });
                      }
                    }}
                    color="black"
                    marginRight={undefined}
                    marginLeft={undefined}
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    flex: 1,
    paddingVertical: 30,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingText: {
    color: Colors.primaryDark,
    fontSize: 16,
  },
  carouselWrapper: {
    gap: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  textWrapper: {
    marginLeft: 60,
    marginRight: 60,
  },
  title: {
    textAlign: "center",
  },
  subheading: {
    textAlign: "center",
    color: Colors.primaryDark,
    marginBottom: 50,
    marginTop: 5,
    lineHeight: 18,
  },
  btnsInColumnWrapper: {
    gap: 16,
  },
  // modal
  closeIcon: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modal: {
    backgroundColor: Colors.primaryLight,
    margin: 40,
    padding: 30,
    borderRadius: 32,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalTitle: {
    textAlign: "center",
    fontFamily: "SEMIBOLD",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  btnsWrapper: {
    gap: 24,
    paddingHorizontal: 10,
    marginTop: 40,
  },
});

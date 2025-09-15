import Button from "@/components/Button";
import Colors from "@/styles/colors";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const EnlargeImageStylist = () => {
  const { images, from } = useLocalSearchParams();

  // Parse the images from the URL parameter
  const parsedImages = React.useMemo(() => {
    if (!images || typeof images !== "string") return [];
    try {
      return JSON.parse(images);
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  }, [images]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState<string | null>(
    parsedImages && parsedImages.length > 0 ? parsedImages[0].url : null
  );

  // Update current image URL when index changes
  useEffect(() => {
    if (
      parsedImages &&
      parsedImages.length > 0 &&
      currentImgIndex >= 0 &&
      currentImgIndex < parsedImages.length
    ) {
      setCurrentImgUrl(parsedImages[currentImgIndex].url);
    }
  }, [currentImgIndex, parsedImages]);

  const goToPrevious = () => {
    if (currentImgIndex > 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImgIndex < parsedImages.length - 1) {
      setCurrentImgIndex(currentImgIndex + 1);
    }
  };

  // Handle close button press
  const handleClose = () => {
    try {
      // Go back to the previous page
      router.back();
    } catch (error) {
      console.error("Error closing modal:", error);
      // If back navigation fails, try to dismiss
      router.dismiss();
    }
  };

  // If no images are available, show a placeholder
  if (!parsedImages || parsedImages.length === 0) {
    return (
      <View style={styles.fullScreenContainer}>
        <SafeAreaView style={styles.safeArea}>
          <Pressable
            style={styles.closeButton}
            onPress={handleClose}
          >
            <AntDesign name="closecircle" size={36} color={Colors.primary} />
          </Pressable>

          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Image
                style={styles.mainImage}
                source={require("@/assets/images/placeholder.png")}
                contentFit="cover"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  type ImageItem = { url: string };

  const renderImageThumbnail = ({
    item,
    index,
  }: {
    item: ImageItem;
    index: number;
  }) => {
    const backgroundColor = currentImgIndex !== index && {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
    };
    const borderProps = currentImgIndex === index && {
      borderColor: Colors.primary,
      borderWidth: 2,
    };

    return (
      <Pressable
        onPress={() => setCurrentImgIndex(index)}
        style={{ marginHorizontal: 5, marginTop: 20, marginBottom: 40 }}
      >
        <View style={[styles.overlay, backgroundColor]} />
        <Image
          style={[{ height: 50, width: 50, borderRadius: 8 }, borderProps]}
          source={item.url || require("@/assets/images/placeholder.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={300}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable 
          style={styles.closeButton} 
          onPress={handleClose}
        >
          <AntDesign name="closecircle" size={36} color={Colors.primary} />
        </Pressable>

        <View style={styles.modalContent}>
          <View>
            {/* Main Image and Thumbnails */}
            <View style={styles.container}>
              {/* Main Image */}
              <Image
                style={styles.mainImage}
                source={
                  currentImgUrl || require("@/assets/images/placeholder.png")
                }
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={500}
              />

              {/* Image Counter - only show if multiple images */}
              {parsedImages.length > 1 && (
                <View style={styles.imageCounter}>
                  <Text style={styles.counterText}>
                    {currentImgIndex + 1} / {parsedImages.length}
                  </Text>
                </View>
              )}

              {/* Thumbnails - only show if multiple images */}
              {parsedImages.length > 1 && (
                <FlatList
                  data={parsedImages}
                  renderItem={({ item, index }) =>
                    renderImageThumbnail({ item, index })
                  }
                  horizontal
                  keyExtractor={(item, index) => `${item.url}-${index}`}
                  showsHorizontalScrollIndicator={false}
                />
              )}

              {/* Navigation buttons - only show if multiple images */}
              {parsedImages.length > 1 && (
                <View style={{ flexDirection: "row", gap: 20 }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={currentImgIndex > 0 ? goToPrevious : undefined}
                      title={"Previous"}
                      marginRight={undefined}
                      marginLeft={undefined}
                      fontFamily={"MEDIUM"}
                      backgroundColor={
                        currentImgIndex > 0
                          ? Colors.success
                          : Colors.primaryGray
                      }
                      fontSize={undefined}
                      paddingTop={10}
                      paddingBottom={10}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Button
                      onPress={
                        currentImgIndex < parsedImages.length - 1
                          ? goToNext
                          : undefined
                      }
                      title={"Next"}
                      marginRight={undefined}
                      marginLeft={undefined}
                      fontFamily={"MEDIUM"}
                      backgroundColor={
                        currentImgIndex < parsedImages.length - 1
                          ? "#EEC800"
                          : Colors.primaryGray
                      }
                      fontSize={undefined}
                      paddingTop={10}
                      paddingBottom={10}
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EnlargeImageStylist;

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Dark overlay background
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 50,
    padding: 2,
  },
  modalContent: {
    backgroundColor: "rgba(2, 86, 44, 0.95)",
    borderRadius: 32,
    width: "95%",
    maxWidth: 420,
    maxHeight: "95%",
    minHeight: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderRadius: 32,
    padding: 20,
  },
  mainImage: {
    height: 500,
    width: 350,
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    borderRadius: 8,
    height: 50,
  },
  imageCounter: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  counterText: {
    color: "white",
    fontSize: 14,
    fontFamily: "MEDIUM",
  },
});
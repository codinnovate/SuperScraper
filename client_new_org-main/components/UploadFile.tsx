// import placeholder from "@/assets/images/placeholder.png";
import Colors from "@/styles/colors";
import { Body, Heading } from "@/styles/typography";
import { formatSizeUnits, shortenFileName } from "@/utils/format";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface Props {
  onPress: () => void;
  uploadDetails?: any[];
  uploadName?: string;
  updateUpload?: (data: any[]) => void;
  isProcessing?: boolean;
}

const UploadFile = (props: Props) => {
  const { onPress, uploadDetails: data, uploadName, updateUpload } = props;
  const [imgDetails, setImgDetails] = useState<any[]>([]);

  useEffect(() => {
    if (data) setImgDetails(data);
  }, [data]);

  const formData = new FormData();

  // Convert image to base64 (optional usage)
  //   const convertImageToBase64 = async (imageUri) => {
  //     const base64 = await FileSystem.readAsStringAsync(imageUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     return `data:image/jpeg;base64,${base64}`;
  //   };

  // Send image to backend (optional usage)
  const sendImage = async (base64Image: string) => {
    try {
      const response = await fetch("YOUR_BACKEND_ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await response.json();
      // Handle response if needed
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View>
      <View style={{ gap: 20 }}>
        {imgDetails &&
          imgDetails.length > 0 &&
          imgDetails.map((imageDetail) => (
            <View
              style={{ gap: 10 }}
              key={imageDetail.assetId || imageDetail.uri}
            >
              <View style={styles.row}>
                <View style={styles.rowGap}>
                  <Image
                    style={styles.thumbnail}
                    source={
                      imageDetail.uri
                        ? { uri: imageDetail.uri }
                        : require("@/assets/images/placeholder.png")
                    }
                    resizeMode="cover"
                  />
                  <View style={{ gap: 5 }}>
                    <Heading>
                      {shortenFileName(imageDetail.fileName || "image.jpg")}
                    </Heading>
                    <Body>{formatSizeUnits(imageDetail.fileSize || 0)}</Body>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    const newItem = imgDetails.filter(
                      (imgDetail) =>
                        (imgDetail.assetId || imgDetail.uri) !==
                        (imageDetail.assetId || imageDetail.uri)
                    );
                    setImgDetails(newItem);
                    if (updateUpload) {
                      updateUpload(newItem);
                    }
                  }}
                >
                  <Ionicons name="close-circle" size={20} color="black" />
                </Pressable>
              </View>

              <View>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressTrack}>
                    <View style={styles.progressFill}></View>
                  </View>
                  <Body>100%</Body>
                </View>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.uploadSection}>
        <SimpleLineIcons name="cloud-upload" size={33} color="black" />
        <View style={{ width: "100%" }}>
          <Pressable style={[styles.uploadButton]} onPress={onPress}>
            <Heading style={styles.uploadButtonText}>
              Upload{uploadName ? ` ${uploadName}` : ""}
            </Heading>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default UploadFile;

const styles = StyleSheet.create({
  thumbnail: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowGap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  progressFill: {
    width: "70%",
    height: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  uploadSection: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 20,
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: Colors.primaryLight,
    fontFamily: "SEMIBOLD",
  },
});

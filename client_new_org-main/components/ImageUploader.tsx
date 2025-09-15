import Colors from "@/styles/colors";
import { Body, Heading } from "@/styles/typography";
import { formatSizeUnits, shortenFileName } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import UploadFile from "./UploadFile";

interface ImageUploaderProps {
  onImagesChange: (images: ImagePicker.ImagePickerAsset[]) => void;
  maxFileSize?: number;
  allowMultiple?: boolean;
  uploadName?: string;
  initialImages?: ImagePicker.ImagePickerAsset[];
}

const ImageUploader = ({
  onImagesChange,
  maxFileSize = 5300000, // 5MB default
  allowMultiple = true,
  uploadName = "file",
  initialImages = [],
}: ImageUploaderProps) => {
  const [images, setImages] =
    useState<ImagePicker.ImagePickerAsset[]>(initialImages);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: !allowMultiple,
        aspect: [4, 3],
        quality: 0.3, // Keep the optimized quality for smaller files
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowMultiple,
        base64: false,
      });

      if (!result.canceled) {
        const validImages = result.assets.filter((asset) => {
          if (asset.fileSize && asset.fileSize > maxFileSize) {
            setErrorMessage(
              `Some files are too large. Maximum size is ${(
                maxFileSize /
                1024 /
                1024
              ).toFixed(1)}MB per file.`
            );
            return false;
          }
          return true;
        });

        if (validImages.length > 0) {
          let updatedImages;
          if (allowMultiple) {
            updatedImages = [...images, ...validImages];
          } else {
            updatedImages = validImages;
          }

          setImages(updatedImages);
          onImagesChange(updatedImages);
          setErrorMessage(null);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setErrorMessage("Error selecting image");
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const updateImage = (
    updatedData: ImagePicker.ImagePickerAsset[] | undefined
  ) => {
    const newImages = updatedData || [];
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <View>
      {/* Upload Area */}
      <View style={styles.uploadContainer}>
        <UploadFile
          uploadName={uploadName}
          onPress={pickImage}
          uploadDetails={undefined}
          updateUpload={updateImage}
          isProcessing={false}
        />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>

      {/* Files uploaded section */}
      {images.length > 0 && (
        <View style={styles.filesContainer}>
          <Heading style={styles.filesTitle}>Files uploaded</Heading>
          {images.map((img, index) => (
            <View style={styles.fileItem} key={index}>
              <View style={styles.fileRow}>
                <View style={styles.fileInfo}>
                  <Image
                    style={styles.thumbnail}
                    source={
                      img.uri
                        ? { uri: img.uri }
                        : require("@/assets/images/placeholder.png")
                    }
                    resizeMode="cover"
                  />
                  <View style={styles.fileDetails}>
                    <Heading style={styles.fileName}>
                      {shortenFileName(img.fileName || "image.jpg")}
                    </Heading>
                    <Body style={styles.fileSize}>
                      {formatSizeUnits(img.fileSize || 0)}
                    </Body>
                  </View>
                </View>
                <Pressable
                  onPress={() => removeImage(index)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.error}
                  />
                </Pressable>
              </View>
              <View style={styles.progressSection}>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressTrack}>
                    <View style={styles.progressFill}></View>
                  </View>
                  <Body style={styles.progressText}>100%</Body>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  uploadContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: "dashed",
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 30,
    borderColor: Colors.primaryGray,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  filesContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 20,
    borderColor: "#D2D6DB",
  },
  filesTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  fileItem: {
    paddingVertical: 12,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  thumbnail: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  fileDetails: {
    gap: 5,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: "SEMIBOLD",
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  removeButton: {
    padding: 5,
  },
  progressSection: {
    marginTop: 4,
  },
  progressBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },
  progressFill: {
    width: "100%",
    height: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
});

export default ImageUploader;

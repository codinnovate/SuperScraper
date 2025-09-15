import { Heading } from "@/styles/typography";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
// import nodata from '../../assets/images/nodata.png';

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

type NodataToLoadProps = {
  body: string;
};

const NodataToLoad: React.FC<NodataToLoadProps> = ({ body }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../../assets/images/nodata.png")}
        // source={nodata}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <Heading
        style={{
          textAlign: "center",
          color: "#9DA4AE",
          fontFamily: "REGULAR",
        }}
      >
        {body}
      </Heading>
    </View>
  );
};

export default NodataToLoad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 50,
  },
  image: {
    height: 90,
    width: 90,
  },
});

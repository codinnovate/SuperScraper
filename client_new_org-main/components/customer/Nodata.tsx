import { Heading } from "@/styles/typography";
import { View } from "react-native";
import Button from "../Button";

const NoData = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        paddingHorizontal: 16,
      }}
    >
      <View style={{ paddingHorizontal: 24 }}>
        <Heading style={{ textAlign: "center" }}>{text}</Heading>
      </View>

      <View style={{ width: "100%" }}>
        <Button
          title={"Explore"}
          onPress={onPress}
          marginRight={undefined}
          marginLeft={undefined}
          fontFamily={"MEDIUM"}
        />
      </View>
    </View>
  );
};

export default NoData;

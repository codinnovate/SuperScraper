import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  Extrapolation,
  useAnimatedStyle,
} from 'react-native-reanimated';

const { width: SRC_WIDTH } = Dimensions.get('screen');

// Define item type (adjust `image` type if needed)
interface SliderItemProps {
  item: {
    image: any; // Use `ImageSourcePropType` if strongly typing from `react-native`
  };
  index: number;
  scrollX: Animated.SharedValue<number>;
}

const SliderItem: React.FC<SliderItemProps> = ({ item, index, scrollX }) => {
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          [(index - 1) * SRC_WIDTH, index * SRC_WIDTH, (index + 1) * SRC_WIDTH],
          [-SRC_WIDTH * 0.30, 0, SRC_WIDTH * 0.30],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          scrollX.value,
          [(index - 1) * SRC_WIDTH, index * SRC_WIDTH, (index + 1) * SRC_WIDTH],
          [0.8, 1, 0.8],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, cardStyle]}>
      <Image source={item.image} style={styles.image} />
    </Animated.View>
  );
};

export default SliderItem;

const styles = StyleSheet.create({
    container: {
      width: SRC_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: 280,
      height: 450,
      borderRadius: 16,
    },
  });
  
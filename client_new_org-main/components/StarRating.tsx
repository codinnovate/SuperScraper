import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type StarRatingProps = {
  rating: number; // 0 to 5, can include half like 3.5
  size?: number;
  color?: string;
};

const StarRating = ({ rating, size = 24, color = '#EEC800' }: StarRatingProps) => {
  const stars = [];
  // Always show at least 1 star (never 0)
  const safeRating = rating && rating > 0 ? rating : 5;
  for (let i = 1; i <= 5; i++) {
    if (safeRating >= i) {
      stars.push(<FontAwesome key={i} name="star" size={size} color={color} />);
    } else if (safeRating + 0.5 >= i) {
      stars.push(<FontAwesome key={i} name="star-half-full" size={size} color={color} />);
    } else {
      stars.push(<FontAwesome key={i} name="star-o" size={size} color={color} />);
    }
  }
  return <View style={styles.container}>{stars}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default StarRating;
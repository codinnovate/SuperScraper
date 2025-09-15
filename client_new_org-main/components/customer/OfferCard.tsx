import Button from '@/components/Button';
import Colors from '@/styles/colors';
import { Body } from '@/styles/typography';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface OfferCardProps {
  rating: string;
  deliveryDays: string;
  location: string;
  price: number;
  stylistName: string;
  onChatPressBtn: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  rating,
  deliveryDays,
  location,
  price,
  stylistName,
  onChatPressBtn
}) => {
  return (
    <Pressable
      style={styles.cardContainer}
    >
      {/* Rating and Delivery Days Section */}
      <View style={styles.topSection}>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={12} color="#EEC800" />
          <Body style={styles.ratingText}>{rating}</Body>
        </View>
        <Body style={styles.deliveryText}>{deliveryDays} delivery days</Body>
      </View>
      
      {/* Stylist Name */}
      <Body style={styles.stylistName} numberOfLines={1}>{stylistName}</Body>

      {/* Location Section */}
      <View style={styles.locationSection}>
        <View style={styles.locationContainer}>
          <EvilIcons name="location" size={12} color={Colors.primary} />
          <Body numberOfLines={2} style={styles.locationText}>
            {location}
          </Body>
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <Body style={styles.priceText}>
          {price && price > 0 ? `N${price.toLocaleString()}` : 'Price not set'}
        </Body>
      </View>

      {/* Chat Button */}
      <View style={styles.buttonContainer}>
        <Button 
          onPress={onChatPressBtn} 
          title={'Chat'} 
          marginRight={undefined} 
          marginLeft={undefined} 
          fontFamily={'MEDIUM'} 
          paddingBottom={8} 
          paddingTop={8} 
          fontSize={10} 
          backgroundColor={Colors.primary} 
          color="white"
          style={styles.chatButton}
        />
      </View>
    </Pressable>
  );
};

export default OfferCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 160,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'SEMIBOLD',
    fontSize: 12,
  },
  deliveryText: {
    fontSize: 11,
    color: Colors.primaryGray,
  },
  stylistName: {
    fontFamily: 'SEMIBOLD',
    fontSize: 13,
    marginBottom: 8,
    color: Colors.primary,
  },
  locationSection: {
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 11,
    color: Colors.primaryGray,
    lineHeight: 16,
  },
  priceSection: {
    marginBottom: 12,
  },
  priceText: {
    fontFamily: 'SEMIBOLD',
    fontSize: 13,
    color: Colors.primary,
  },
  buttonContainer: {
    zIndex: 1,
  },
  chatButton: {
    width: 143,
    height: 32,
  },
});
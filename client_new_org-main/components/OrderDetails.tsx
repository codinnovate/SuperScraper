import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Title, Body } from '../styles/typography'; // adjust if needed
import Button from '@/components/Button'; // adjust if needed

const OrderDetails = () => {
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Order Details</Title>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Body style={styles.label}>Outfits Fee</Body>
          <Body style={styles.value}>N40,000</Body>
        </View>

        <View style={styles.detailRow}>
          <Body style={styles.label}>Delivery Location</Body>
          <Body style={styles.value}>Lagos</Body>
        </View>

        <View style={styles.detailRow}>
          <Body style={styles.label}>Delivery Date</Body>
          <Body style={styles.value}>31/12/2024</Body>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <View style={styles.buttonFlex}>
          <Button
            onPress={undefined}
            title="Continue to payment"
            fontFamily="SEMIBOLD"
          />
        </View>

        <View>
          <Button
            onPress={undefined}
            title="Decline"
            fontFamily="SEMIBOLD"
            backgroundColor="#EEC800"
            paddingRight={20}
            paddingLeft={20}
            color="black"
          />
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E2EEE8',
    padding: 30,
    borderRadius: 40,
    gap: 40,
  },
  title: {
    textAlign: 'center',
  },
  detailsSection: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'SEMIBOLD',
  },
  value: {
    fontFamily: 'MEDIUM',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonFlex: {
    flex: 1,
  },
});

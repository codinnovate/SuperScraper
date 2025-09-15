import TitleHeader from "@/components/header/TitleHeader";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../../styles/colors";
import { layout } from "../../../styles/layout";

const TermsAndConditionPage = () => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        backArrow
        title="Terms and Conditions"
        onPress={() => router.back()}
      />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>
              Eazyfit Terms & Conditions – Customers
            </Text>
            <Text style={styles.lastUpdated}>Last updated: July 2025</Text>
          </View>

          <Text style={styles.intro}>
            Welcome to Eazyfit! By using our platform, you agree to the
            following terms. Please read them carefully before placing an order.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Eligibility</Text>
            <Text style={styles.sectionContent}>
              By using Eazyfit, you confirm that you are at least 18 years old
              or have legal consent from a parent or guardian if under 18.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Platform Role</Text>
            <Text style={styles.sectionContent}>
              Eazyfit is a digital platform connecting you with independent
              fashion designers and tailors ("Stylists"). While we verify and
              vet our stylists, they are not direct employees of Eazyfit.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Orders & Payments</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Orders are placed through our platform and are binding once
                confirmed.
              </Text>
              <Text style={styles.listItem}>
                • Payments are processed via Paystack or other secure gateways.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              4. Measurement Responsibility
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • You are responsible for submitting accurate body measurements
                during order placement.
              </Text>
              <Text style={styles.listItem}>
                • To assist, Eazyfit provides clear measurement tutorials and
                optional paid measurement visits (in select cities).
              </Text>
              <Text style={styles.listItem}>
                • If the measurements provided are incorrect, Eazyfit and the
                stylist may not be held liable for fit issues.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              5. Refund & Adjustment Policy
            </Text>
            <Text style={styles.sectionContent}>
              We aim for satisfaction, but due to the custom nature of
              tailoring:
            </Text>

            <Text style={styles.sectionContent}>
              Refunds or adjustments will only apply if:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • The fabric delivered is significantly different from what was
                agreed.
              </Text>
              <Text style={styles.listItem}>
                • The design made is completely different from what was ordered.
              </Text>
              <Text style={styles.listItem}>
                • The measurements are wrong and not due to customer error.
              </Text>
            </View>

            <Text style={styles.sectionContent}>Resolution options:</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • The stylist may either rework the outfit for free, or refund
                70% of the total cost.
              </Text>
              <Text style={styles.listItem}>
                • Issues must be reported within 24 hours of delivery.
              </Text>
              <Text style={styles.listItem}>
                • Stylists will cover the cost of return delivery where
                required.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Delivery & Timelines</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Delivery timelines are estimated based on stylist availability
                and order complexity.
              </Text>
              <Text style={styles.listItem}>
                • Eazyfit is not liable for delays caused by external logistics
                companies or miscommunication beyond our control.
              </Text>
              <Text style={styles.listItem}>
                • You will receive delivery status updates via SMS, in-app
                alerts, and/or email.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Code of Conduct</Text>
            <Text style={styles.sectionContent}>You agree to:</Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Use Eazyfit for lawful, personal use only.
              </Text>
              <Text style={styles.listItem}>
                • Not harass, abuse stylists, or the platform.
              </Text>
              <Text style={styles.listItem}>
                • Communicate respectfully with all parties.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Intellectual Property</Text>
            <Text style={styles.sectionContent}>
              Designs shown on stylist profiles belong to the original creators.
              Do not copy, reproduce, or reuse without permission.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Platform Rights</Text>
            <Text style={styles.sectionContent}>
              Eazyfit reserves the right to:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Suspend any customer account for abusive behavior, fraud, or
                platform misuse.
              </Text>
              <Text style={styles.listItem}>
                • Update these terms at any time, with notice sent via email or
                in-app.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Contact</Text>
            <Text style={styles.sectionContent}>
              For questions or complaints, please email:
              <Text style={styles.contactEmail}>eazyfit@gmail.com</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  content: {},
  headerSection: {
    marginBottom: 10,
    paddingVertical: 16,
  },
  checkmark: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: "SEMIBOLD",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primaryGray,
    textAlign: "center",
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.primaryGray,
    fontFamily: "REGULAR",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primaryDark,
    marginBottom: 24,
    fontFamily: "REGULAR",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SEMIBOLD",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primaryDark,
    marginBottom: 12,
    fontFamily: "REGULAR",
  },
  bulletSection: {
    marginBottom: 16,
    paddingLeft: 12,
  },
  bulletTitle: {
    fontSize: 15,
    fontFamily: "SEMIBOLD",
    marginBottom: 4,
  },
  bulletContent: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primaryDark,
    fontFamily: "REGULAR",
  },
  listContainer: {
    paddingLeft: 8,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primaryDark,
    marginBottom: 8,
    fontFamily: "REGULAR",
  },
  checkmarkItem: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primaryDark,
    marginBottom: 8,
    fontFamily: "REGULAR",
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primaryDark,
    marginTop: 12,
    fontFamily: "REGULAR",
  },
  emailLink: {
    fontFamily: "SEMIBOLD",
  },
  contactEmail: {
    fontSize: 16,
    paddingLeft: 4,
    fontFamily: "SEMIBOLD",
    marginVertical: 8,
  },
});

export default TermsAndConditionPage;

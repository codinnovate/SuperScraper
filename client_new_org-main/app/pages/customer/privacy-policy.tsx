import TitleHeader from "@/components/header/TitleHeader";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../../styles/colors";
import { layout } from "../../../styles/layout";

const PrivacyPolicyPage = () => {
  return (
    <SafeAreaView style={layout.container}>
      <TitleHeader
        backArrow
        title="Privacy Policy"
        onPress={() => router.back()}
      />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Eazyfit Privacy Policy – Customers</Text>
            <Text style={styles.lastUpdated}>Last updated: July 2025</Text>
          </View>

          <Text style={styles.intro}>
            We care about your privacy and are committed to protecting your
            personal information. This policy explains how we collect, use, and
            safeguard your data as a customer on the Eazyfit platform.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. What We Collect</Text>
            <Text style={styles.sectionContent}>
              When you use Eazyfit, we collect:
            </Text>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Personal Information:</Text>
              <Text style={styles.bulletContent}>
                Name, phone number, email address, gender
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Measurement Data:</Text>
              <Text style={styles.bulletContent}>
                Your body measurements for tailoring
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Order Details:</Text>
              <Text style={styles.bulletContent}>
                Selected styles, payment history, delivery address
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Communication Data:</Text>
              <Text style={styles.bulletContent}>
                Messages you send within the app
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Device & Usage Info:</Text>
              <Text style={styles.bulletContent}>
                Device type, IP address, location (if enabled)
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Data</Text>
            <Text style={styles.sectionContent}>
              We use your information to:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Process your orders and connect you with stylists
              </Text>
              <Text style={styles.listItem}>
                • Enable payments and send order updates
              </Text>
              <Text style={styles.listItem}>
                • Improve the platform experience
              </Text>
              <Text style={styles.listItem}>
                • Send measurement tutorials, follow-up messages, and promotions
              </Text>
              <Text style={styles.listItem}>
                • Ensure safety and compliance with our policies
              </Text>
            </View>

            <Text style={styles.sectionContent}>
              We may also use anonymized data for business analysis and product
              improvement.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Who Sees Your Data</Text>
            <Text style={styles.sectionContent}>
              Your information may be shared with:
            </Text>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Stylists:</Text>
              <Text style={styles.bulletContent}>
                Only your name, measurements, and relevant order details
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Logistics partners:</Text>
              <Text style={styles.bulletContent}>
                For delivery of your outfit
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Payment processors:</Text>
              <Text style={styles.bulletContent}>
                Such as Paystack, to process transactions
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Support agents:</Text>
              <Text style={styles.bulletContent}>
                To assist with feedback or disputes
              </Text>
            </View>

            <Text style={styles.sectionContent}>
              We never sell your personal information to third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Storage & Security</Text>
            <Text style={styles.sectionContent}>
              Your data is stored securely on cloud servers compliant with
              global standards. We implement:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Secure login & encrypted connections
              </Text>
              <Text style={styles.listItem}>
                • Access restrictions for sensitive data
              </Text>
              <Text style={styles.listItem}>
                • Regular system audits and backups
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionContent}>You can:</Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Request to access or correct your data
              </Text>
              <Text style={styles.listItem}>
                • Ask us to delete your account and personal information
              </Text>
              <Text style={styles.listItem}>
                • Opt out of marketing emails and SMS at any time
              </Text>
            </View>

            <Text style={styles.contactInfo}>
              To do so, contact:{" "}
              <Text style={styles.emailLink}>privacy@eazyfit.ng</Text>
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Cookies & Tracking</Text>
            <Text style={styles.sectionContent}>
              We may use cookies and device tracking to:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Improve performance</Text>
              <Text style={styles.listItem}>• Understand usage patterns</Text>
              <Text style={styles.listItem}>• Personalize your experience</Text>
            </View>

            <Text style={styles.sectionContent}>
              You can disable cookies via your browser settings.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Policy Updates</Text>
            <Text style={styles.sectionContent}>
              We may occasionally update this policy. When we do, we'll notify
              you via email or in-app message.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Questions?</Text>
            <Text style={styles.sectionContent}>
              Contact our data protection team at:
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
    paddingHorizontal: 4,
    fontFamily: "SEMIBOLD",
    marginVertical: 8,
  },
});

export default PrivacyPolicyPage;

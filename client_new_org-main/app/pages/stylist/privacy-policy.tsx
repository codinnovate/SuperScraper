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
            <Text style={styles.title}>
              Privacy Policy – Stylists (Clients on Eazyfit)
            </Text>
            <Text style={styles.lastUpdated}>Last updated: July 2025</Text>
          </View>

          <Text style={styles.intro}>
            At Eazyfit, we are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, and protect your
            personal information as a stylist (client) on our platform.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.sectionContent}>
              When you sign up as a stylist on Eazyfit, we collect:
            </Text>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>
                Personal Identification Information:
              </Text>
              <Text style={styles.bulletContent}>
                Full name, email address, phone number, gender, location, age
                verification.
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Banking Information:</Text>
              <Text style={styles.bulletContent}>
                Account name, account number, and bank name (used for payouts).
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Professional Information:</Text>
              <Text style={styles.bulletContent}>
                Design uploads, photos of your work, tailoring certifications
                (if applicable), and business name (if provided).
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Device & Usage Data:</Text>
              <Text style={styles.bulletContent}>
                IP address, login times, device type, and feature usage for
                performance and fraud prevention.
              </Text>
            </View>

            <View style={styles.bulletSection}>
              <Text style={styles.bulletTitle}>Verification Data:</Text>
              <Text style={styles.bulletContent}>
                Photos or videos from field agent visits to verify your
                tailoring setup and location.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. How We Use Your Information
            </Text>
            <Text style={styles.sectionContent}>We use your data to:</Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Verify your identity and tailor status
              </Text>
              <Text style={styles.listItem}>
                • Showcase your profile and work to potential customers
              </Text>
              <Text style={styles.listItem}>
                • Enable payments and process commissions
              </Text>
              <Text style={styles.listItem}>
                • Communicate policy updates, order alerts, and support messages
              </Text>
              <Text style={styles.listItem}>
                • Improve platform performance and safety
              </Text>
              <Text style={styles.listItem}>
                • Resolve customer complaints or disputes
              </Text>
              <Text style={styles.listItem}>
                • Monitor compliance with our Terms & Conditions
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Who We Share It With</Text>
            <Text style={styles.sectionContent}>
              We do not sell your information. We may share parts of your data:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • With customers (e.g. your display name, uploaded designs)
              </Text>
              <Text style={styles.listItem}>
                • With our logistics or verification partners (for deliveries or
                setup verification)
              </Text>
              <Text style={styles.listItem}>
                • With Paystack or other payment providers (for payout
                processing)
              </Text>
              <Text style={styles.listItem}>
                • If legally required (e.g. fraud investigations or court
                orders)
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionContent}>
              We take data protection seriously. Your data is stored on secure
              servers and access is limited to authorized personnel only. We use
              SSL encryption and secure payment gateways to protect sensitive
              information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.sectionContent}>
              As a stylist, you have the right to:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Request access to your stored data
              </Text>
              <Text style={styles.listItem}>
                • Ask us to correct inaccurate data
              </Text>
              <Text style={styles.listItem}>
                • Request that we delete your account (data may be retained for
                legal or fraud-related reasons)
              </Text>
              <Text style={styles.listItem}>
                • Decline certain communications, such as marketing
              </Text>
            </View>

            <Text style={styles.contactInfo}>
              To make any of these requests, email us at{" "}
              <Text style={styles.emailLink}>privacy@eazyfit.ng</Text>.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Retention</Text>
            <Text style={styles.sectionContent}>
              Your data will be retained for as long as your stylist account is
              active. If your account is terminated or inactive for more than 12
              months, we may delete your data unless legally required to retain
              it.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Updates to This Policy</Text>
            <Text style={styles.sectionContent}>
              We may update this policy as laws or platform practices change.
              You will be notified of significant updates via email or in-app
              notifications.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.sectionContent}>
              If you have questions or concerns about your data, email us at:
              <Text style={styles.contactEmail}>eazyfit@gmail.com</Text>
              or use the in-app support channel.
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

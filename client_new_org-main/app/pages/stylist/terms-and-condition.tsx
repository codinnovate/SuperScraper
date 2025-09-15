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
              Terms and Conditions – Stylists (Clients on Eazyfit)
            </Text>
            <Text style={styles.lastUpdated}>Last updated: July 2025</Text>
          </View>

          <Text style={styles.intro}>
            Welcome to Eazyfit! These Terms and Conditions ("Terms") govern your
            use of the Eazyfit platform as a stylist. By signing up or using
            Eazyfit, you agree to the following:
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              1. Eligibility & Registration
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • You must be at least 18 years old to use the platform as a
                stylist.
              </Text>
            </View>

            <Text style={styles.sectionContent}>All stylists must upload:</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• At least 3 original designs</Text>
              <Text style={styles.listItem}>• A valid bank account number</Text>
              <Text style={styles.listItem}>
                • Accept these Terms before taking any orders
              </Text>
            </View>

            <Text style={styles.sectionContent}>
              Stylists will only be allowed to take orders after being verified
              by a local field agent.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Platform Usage & Rules</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • All communication with customers must happen within the app.
              </Text>
              <Text style={styles.listItem}>
                • Stylists must not include business cards, contact numbers, or
                social media handles in any order/package.
              </Text>
              <Text style={styles.listItem}>
                • Any attempt to bypass the platform or divert customers will
                lead to immediate suspension or permanent ban.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Orders & Delivery</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • You are expected to accept or decline orders promptly after
                receiving them.
              </Text>
              <Text style={styles.listItem}>
                • You must only begin tailoring after payment confirmation is
                received.
              </Text>
              <Text style={styles.listItem}>
                • You are responsible for delivering the finished outfit through
                the agreed logistics method.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Refunds & Reworks</Text>
            <Text style={styles.sectionContent}>If the outfit delivered:</Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Has the wrong fabric</Text>
              <Text style={styles.listItem}>
                • Significantly deviates from the agreed design
              </Text>
              <Text style={styles.listItem}>
                • Has major measurement issues not caused by the customer
              </Text>
            </View>

            <Text style={styles.sectionContent}>
              Then you must choose one of:
            </Text>
            <View style={styles.listContainer}>
              <Text style={styles.checkmarkItem}>
                ✅ Reworking the outfit at no extra cost
              </Text>
              <Text style={styles.checkmarkItem}>
                ✅ Refunding 70% of the total payment (you keep 30% to cover
                costs)
              </Text>
            </View>

            <Text style={styles.sectionContent}>
              Stylists bear the cost of any return delivery in these cases.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Earnings & Commission</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • During the launch phase, you will receive 100% of the
                customer's payment (excluding charges).
              </Text>
              <Text style={styles.listItem}>
                • After 3 months, Eazyfit will automatically deduct a commission
                (to be communicated) and send your share directly to your bank
                account.
              </Text>
              <Text style={styles.listItem}>
                • Stylists must not demand additional payment outside the
                platform.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Quality & Conduct</Text>
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • All uploaded designs must be your original work.
              </Text>
              <Text style={styles.listItem}>
                • If you consistently receive poor reviews or complaints, you
                may be suspended or delisted.
              </Text>
              <Text style={styles.listItem}>
                • You agree to comply with any future onboarding calls or policy
                updates communicated by the Eazyfit team.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Termination</Text>
            <Text style={styles.sectionContent}>
              Eazyfit reserves the right to:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • Remove any stylist who violates these terms
              </Text>
              <Text style={styles.listItem}>
                • Withhold payouts if fraud or customer manipulation is
                suspected
              </Text>
              <Text style={styles.listItem}>
                • Take legal action if damage to the platform occurs due to a
                stylist's actions
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Support</Text>
            <Text style={styles.sectionContent}>
              Need help? Reach out to our support team via chat or email at:
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

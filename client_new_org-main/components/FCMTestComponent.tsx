import { useNotificationContext } from '@/contexts/NotificationContext';
import { useCurrentUser } from '@/hooks/use-auth';
import Colors from '@/styles/colors';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FCMTestComponent: React.FC = () => {
  const { testNotification, sendGigNotification, sendBulkNotification } = useNotificationContext();
  const { user } = useCurrentUser();

  const handleTestNotification = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      await testNotification(
        user.id,
        'Test Notification',
        'This is a test notification from the app!',
        { type: 'test', timestamp: Date.now() }
      );
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
      console.error('Test notification error:', error);
    }
  };

  const handleTestGigNotification = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      await sendGigNotification(
        user.id,
        'New Gig Available',
        'A new styling gig has been posted!',
        'gig-123',
        'gig_created'
      );
      Alert.alert('Success', 'Gig notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send gig notification');
      console.error('Gig notification error:', error);
    }
  };

  const handleTestBulkNotification = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      await sendBulkNotification(
        [user.id],
        'Bulk Notification',
        'This is a bulk notification test!',
        { type: 'bulk_test', timestamp: Date.now() }
      );
      Alert.alert('Success', 'Bulk notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send bulk notification');
      console.error('Bulk notification error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Testing</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleTestNotification}>
        <Text style={styles.buttonText}>Send Test Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestGigNotification}>
        <Text style={styles.buttonText}>Send Gig Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleTestBulkNotification}>
        <Text style={styles.buttonText}>Send Bulk Notification</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        Check the console logs for device token registration status.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FCMTestComponent;

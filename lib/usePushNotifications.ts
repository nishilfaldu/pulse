import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [isRegistering, setIsRegistering] = useState(false);
  const recordPushToken = useMutation(api.notifications.recordPushNotificationToken);

  // Complete registration flow
  const registerForPushNotifications = async () => {
    try {
      setIsRegistering(true);

      // Set up Android channel if needed
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Check if we're on a physical device
      if (!Device.isDevice) {
        console.warn('Must use physical device for push notifications');
        return false;
      }

      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Permission not granted for push notifications');
        return false;
      }

      // Get project ID
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.error('Project ID not found');
        return false;
      }

      // Get push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      const pushToken = tokenData.data;
      setExpoPushToken(pushToken);

      // Register token with Convex
      await recordPushToken({ token: pushToken });
      console.log('✅ Push notifications registered:', pushToken);

      return true;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    expoPushToken,
    isRegistering,
    registerForPushNotifications,
  };
}

// External dependencies
import { Permissions, Notifications } from 'expo';
import Constants from 'expo-constants';

// Local dependencies
import * as Settings from '../Settings';

/**
 * Registers device to Expo IO Push notifiction service.
 *
 * @return {String} Expo notification token when access granted.
 */
export async function registerDeviceToExpo() {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  return await Notifications.getExpoPushTokenAsync();
}

/**
 * Register Expo token to Trustroots notifiction service
 * This is needed so that Trustroot is able to send notifications via Expo.io
 *
 * @param {String} token Expo push notification token
 */
export async function registerExpoTokenToTrustroots(token) {
  console.log('->registerExpoTokenToTrustroots: ' + token);

  return new Promise((resolve, reject) => {
    fetch(Settings.API_ENDPOINT + 'users/push/registrations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        platform: 'expo',
        // Do not send confirmation push notification about adding this device
        doNotNotify: true,
        deviceId: Constants.deviceId || '',
      }),
    }).then(response => {
      console.log('fetch response: ', response);
      if (!response.ok) {
        return reject(new Error('Failed to register token with API.'));
      }
      resolve();
    });
  });
}

/**
 * Register Expo token to Trustroots notifiction service
 * This is needed so that Trustroot is able to send notifications via Expo.io
 *
 * @param {String} token Expo push notification token
 */
export async function unRegisterExpoTokenFromTrustroots() {
  console.log('->unRegisterExpoTokenFromTrustroots');

  return new Promise((resolve, reject) => {
    Notifications.getExpoPushTokenAsync().then(token => {
      if (!token) {
        console.log('No token to unregister.');
        return;
      }

      fetch(Settings.API_ENDPOINT + 'users/push/registrations/' + token, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(response => {
        console.log('unRegisterExpoTokenFromTrustroots fetch response: ', response);
        if (!response.ok) {
          return reject(new Error('Failed to unregister token with API.'));
        }
        resolve();
      });
    });
  });
}

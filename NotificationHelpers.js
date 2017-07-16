import { Permissions, Notifications } from 'expo';
import * as Settings from './Settings'

/// Registers device to Expo IO Push notifiction service. 
/// Return Expo notification token 
export async function registerDeviceToExpo() {
  const { existingStatus } = await Permissions.getAsync(
    Permissions.REMOTE_NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(
      Permissions.REMOTE_NOTIFICATIONS
    );
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }
  return await Notifications.getExponentPushTokenAsync();
}

/// Register Expo token to Trustroots notifiction service
/// This is needed so that Trustroot is able to send notifications via Expo.io
export async function registerExpoTokenToTrustroots(token) {
    await fetch(Settings.PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token,
            platform: "expo"
          }), 
      })
}


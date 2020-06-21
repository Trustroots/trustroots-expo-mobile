// External dependencies
import { Alert, Linking } from 'react-native';
import Constants from 'expo-constants';

/**
 * Checks if Response object has `x-tr-update-needed` header and if so,
 * prompts user to update their app.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/Response
 *
 * @param {Response object} fetchResponse - Response returned from `fetch()` request
 */
export function handleAppUpdateResponse(fetchResponse) {
  // No updates requred if missing the header
  if (!fetchResponse || !fetchResponse.headers.has('x-tr-update-needed')) {
    console.log('Check for updates: no update needed');
    return;
  }

  let alertMessage =
    'You should update Trustroots app or otherwise it will not continue functioning.';

  if (Constants.manifest.version) {
    alertMessage += ' Your current version is ' + String(Constants.manifest.version);
  }

  // Works on both iOS and Android
  Alert.alert(
    'App needs an update',
    alertMessage,
    [
      {
        text: 'Ask me later',
        onPress: () => console.log('Update: ask me later pressed'),
        style: 'cancel',
      },
      {
        text: 'Update (Play Store)',
        onPress: () => {
          const appStoreUrl =
            'https://play.google.com/store/apps/details?id=org.trustroots.trustrootsApp';

          Linking.openURL(appStoreUrl).catch((err) => {
            console.error('Opening Play Store URL failed: ', err);
          });
        },
      },
    ],
    { cancelable: false }
  );
}

import { Alert, Linking } from 'react-native';
import * as Settings from '../Settings';

function _handleUpdateNeeded(msg) {
  // Works on both iOS and Android
  Alert.alert(
    'App needs an update',
    msg || 'You should update Trustroots app or otherwise it will not continue functioning.',
    [
      {
        text: 'Ask me later',
        onPress: () => console.log('Update: ask me later pressed'),
        style: 'cancel',
      },
      {
        text: 'Open in Play Store',
        onPress: () => {
          const appStoreUrl =
            'https://play.google.com/store/apps/details?id=org.trustroots.trustrootsApp';

          Linking.openURL(appStoreUrl).catch(err => {
            console.error('Opening Play Store URL failed: ', err);
          });
        },
      },
    ],
    { cancelable: false }
  );
}

/**
 * Sends statistics via API
 *
 * @param {Object} stats Statistics object.
 * @param {String} collection Required collection name.
 */
export async function sendStat(stats, collection) {
  console.log('sendStat');

  if (!stats || !collection) {
    console.error('sendStat: Missing arguments');
    return;
  }

  // Required parameter
  stats.collection = String(collection);

  await fetch(Settings.API_ENDPOINT + 'statistics', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stats),
  }).then(response => {
    // If stats API responds "needs update" headers,
    // tell user to update the app.
    if (response.headers.map['x-tr-update-needed']) {
      let msg = response.headers.map['x-tr-update-needed'][0];
      _handleUpdateNeeded(msg);
    }
  });
}

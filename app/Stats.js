// Local dependencies
import * as Settings from '../Settings';
import { handleAppUpdateResponse } from './AppUpdate';

/**
 * Sends statistics via API
 *
 * @param {String} collection Required collection name.
 * @param {Object} stats Statistics object.
 */
export async function sendStat(collection, stats) {
  console.log('sendStat');

  if (!collection || !stats) {
    console.error('sendStat: Missing arguments `collection` or `stats`');
    return;
  }

  await fetch(Settings.API_ENDPOINT + 'statistics', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection: String(collection),
      stats,
    }),
  }).then(response => {
    // If stats API responds "needs update" headers,
    // tell user to update the app.
    handleAppUpdateResponse(response);
  });
}

import React from 'react';
import { Alert, Platform, StatusBar, View, StyleSheet, WebView } from 'react-native';
import { Constants, Notifications } from 'expo';
import {
  registerDeviceToExpo,
  registerExpoTokenToTrustroots,
  unRegisterExpoTokenFromTrustroots,
} from './app/Notifications';
import { sendStat } from './app/Stats';
import * as Settings from './Settings';

console.log('Trustroots mobile app');
console.log('Settings: ', Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarUnderlay: {
    height: Constants.statusBarHeight || 24,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  webView: {
    marginTop: Constants.statusBarHeight || 20,
  },
});

/**
 * App & device information.
 *
 * This should contain only data which doesn't reveal user identity as it's
 * passed on without user being authenticated.
 *
 * See Expo constants:
 * @link https://docs.expo.io/versions/latest/sdk/constants.html
 */
const appInfo = {
  version: Constants.manifest.version || '0.0.0',
  expoVersion: Constants.expoVersion || '',
  deviceName: Constants.deviceName || '',
  deviceYearClass: Constants.deviceYearClass || '',
  os: Platform.OS || '',
};

// True when during this app runtime notifications are enabled already,
// so that we don't attempt to enable them again.
let notificationsRegistered = false;

// JS injected to `WebView`
// Embedded website will change its functionality based on this.
const appInfoJavaScript = 'window.trMobileApp=' + JSON.stringify(appInfo) + ';';

// App wraps trustroots web site and handles notifications.
// Application tries to automaticatically register
// notifications as you load it first time.
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: Settings.BASE_URL };
  }

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    // Send platform stats
    sendStat(appInfo, 'mobileAppInit');
  }

  _handleNotification = notification => {
    if (notification.origin === 'selected') {
      this.setState({ url: notification.data.url || this.state.url });
    }
  };

  async _registerNotifications() {
    console.log('registerNotifications');
    // Do not register multiple times during the app runtime
    if (notificationsRegistered) {
      return;
    }

    var token = await registerDeviceToExpo();

    await registerExpoTokenToTrustroots(token)
      .then(() => {
        notificationsRegistered = true;
      })
      .catch(() => {
        notificationsRegistered = false;
      });
  }

  async _unRegisterNotifications() {
    console.log('unRegisterNotifications');
    await unRegisterExpoTokenFromTrustroots()
      .then(() => {
        notificationsRegistered = false;
      })
      .catch(() => {
        notificationsRegistered = true;
      });
  }

  _handleMessage = msg => {
    console.log('handleMessage: ', msg.nativeEvent.data);
    if (msg) {
      if (msg.nativeEvent.data === 'authenticated') {
        this._registerNotifications();
      } else if (msg.nativeEvent.data === 'unRegisterNotifications') {
        this._unRegisterNotifications();
      }
    }
  };

  // Runs each time new view finished loading at the `WebView`
  // I.e. on each URL change
  _handleLoadEnd = () => {
    console.log('handleLoadEnd');
    this.webView.injectJavaScript(
      //   This is needed because we want to subscribe notifications only
      //   if user is authenticated window.postMessage accepts one
      //   argument, data, which will be available on the event object,
      //   event.nativeEvent.data. data must be a string.
      `
        if (window.user && window.user._id && typeof window.postMessage === 'function') {
          window.postMessage('authenticated');
        }
      `
    );
  };

  _handleError = err => {
    console.log('handleError: ', err);
    // Works on both iOS and Android
    Alert.alert(
      'App failed to load resources',
      'Ensure that you are connected to internet.',
      [
        {
          text: 'OK',
          onPress: () => console.log('Handle error: OK'),
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
        <WebView
          ref={o => (this.webView = o)}
          source={{ uri: this.state.url }}
          style={styles.webview}
          injectedJavaScript={appInfoJavaScript}
          onMessage={this._handleMessage}
          onError={this._handleError}
          onLoadEnd={this._handleLoadEnd}
        />
      </View>
    );
  }
}

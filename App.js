/**
 * Trustoots Mobile app
 *
 * App wraps Trustroots.org web site and handles push notifications.
 *
 * @link https://github.com/Trustroots/trustroots-expo-mobile
 */

// External dependencies
import React from 'react';
import { Alert, BackHandler, Linking, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';
import { Notifications } from 'expo';

// Local dependencies
import {
  registerDeviceToExpo,
  registerExpoTokenToTrustroots,
  unRegisterExpoTokenFromTrustroots,
} from './app/Notifications';
import { requirePermission } from './app/Permissions';
import { sendStat } from './app/Stats';
import * as Settings from './Settings';

/**
 * App's main (and only!) component
 */
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // True when during this app runtime notifications are enabled already,
      // so that we don't attempt to enable them again.
      notificationsRegistered: false,
      notificationsRegisteringLoading: false,
    };
  }

  /**
   * App & device information.
   *
   * This should contain only data which doesn't reveal user identity as it's
   * passed on without user being authenticated.
   *
   * See Expo constants:
   * @link https://docs.expo.io/versions/latest/sdk/constants.html
   */
  appInfo = {
    version: Constants.manifest.version || '0.0.0',
    expoVersion: Constants.expoVersion || '',
    deviceName: Constants.deviceName || '',
    deviceYearClass: Constants.deviceYearClass || '',
    os: Platform.OS || '',
  };

  webViewUrl = `${Settings.BASE_URL}/?app`;

  // Common component styles
  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#12b591',
    },
    statusBar: {
      backgroundColor: '#000000',
    },
    webView: {
      marginTop: this.appInfo.os === 'ios' ? parseInt(Constants.statusBarHeight || 20, 10) : 0,
    },
  });

  // JS injected to `WebView`
  // Embedded website will change its functionality based on this.
  appInfoJavaScript = 'window.trMobileApp=' + JSON.stringify(this.appInfo) + ';';

  UNSAFE_componentWillMount() {
    // Subscribe to push notifications
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    // Handle hardware back button
    BackHandler.addEventListener('hardwareBackPress', this._handleHardwareBackPress);

    // Send anonymous platform stats via API
    // See app/Stats.js for more
    sendStat('mobileAppInit', this.appInfo);
  }

  componentDidMount() {
    this._initAppConnectInterval();
    requirePermission();
  }

  componentWillUnmount() {
    console.log('Clearing app connect interval due unmount');
    this._clearAppConnectInterval();
  }

  /**
   * Signal underlaying website it's wrapped in a native app.
   * We can't ensure the listener is ready so we'll loop this a few times.
   * Website responds with post message event "trNativeAppBridgeInitialized",
   * which is then handled at `_handleMessage()` and `_clearAppConnectInterval()`
   */
  _initAppConnectInterval = () => {
    console.log('Setting app connect interval');
    let i = 0;
    this.appConnectInterval = setInterval(() => {
      console.log('Performing app connect interval #' + i);
      this.webView.postMessage('trMobileAppInit');
      // Maximum limit we attempt to let webview know it's inside an app
      if (i >= 10) {
        console.log('Clearing app connect interval due attempt limit reached.');
        clearInterval(this.appConnectInterval);
        this.appConnectInterval = false;
      }
      i++;
    }, 1500); // Attempt every 1.5 seconds
  };

  /**
   * Clears interval
   */
  _clearAppConnectInterval = () => {
    if (this.appConnectInterval) {
      clearInterval(this.appConnectInterval);
    }
  };

  /**
   * Handle pressing hardware back button
   */
  _handleHardwareBackPress = () => {
    // Tell WebView to jump one history step backwards
    this.webView.goBack();

    // Prevent the regular handling of the back button.
    // Otherwise we'd just exit the app.
    return true;
  };

  /**
   * Handle tapping on incoming push notifications
   */
  _handleNotification = notification => {
    if (notification.origin === 'selected') {
      this.setState({ url: notification.data.url || this.webViewUrl });
    }
  };

  /**
   * Register push notifications token with API
   */
  async _registerNotifications() {
    console.log('registerNotifications');
    // Do not register multiple times during the app runtime
    if (this.state.notificationsRegistered || this.state.notificationsRegisteringLoading) {
      return;
    }

    this.setState({ notificationsRegisteringLoading: true });

    const token = await registerDeviceToExpo();

    await registerExpoTokenToTrustroots(token)
      .then(() => {
        console.log('Successfully registered push notification token.');
        this.setState({
          notificationsRegisteringLoading: false,
          notificationsRegistered: true,
        });
      })
      .catch(error => {
        console.log('Failed to register push notification token:', error);
        this.setState({
          notificationsRegisteringLoading: false,
          notificationsRegistered: false,
        });
      });
  }

  /**
   * Unregister push notifications token with API
   */
  async _unRegisterNotifications() {
    console.log('unRegisterNotifications');
    this.setState({ notificationsRegisteringLoading: true }, async () => {
      await unRegisterExpoTokenFromTrustroots()
        .then(() => {
          console.log('Successfully unregistered push notification token.');
          this.setState({
            notificationsRegisteringLoading: false,
            notificationsRegistered: false,
          });
        })
        .catch(error => {
          console.log('Failed to unregister push notification token:', error);
          this.setState({
            notificationsRegisteringLoading: false,
            notificationsRegistered: true,
          });
        });
    });
  }

  /**
   * Handle messages sent from WebView
   */
  _handleMessage = event => {
    console.log('Handling incoming message:', event.nativeEvent.data);
    let data;

    try {
      data = JSON.parse(event.nativeEvent.data);
      console.log('Parsed incoming message:', data);
      // Action is required
      if (!data.action || typeof data.action !== 'string') {
        console.log('Incoming message missing `action`.');
        return;
      }
    } catch (error) {
      console.log('Failed to parse incoming message:', error);
      return;
    }

    // Site on webView messaged back it knows it's wrapped in mobile app
    if (data.action === 'trNativeAppBridgeInitialized') {
      console.log('Clearing app connect interval due success callback from webview');
      this._clearAppConnectInterval();
      return;
    }

    // User authenticated -> register notifications
    if (data.action === 'authenticated') {
      this._registerNotifications();
      return;
    }

    // Un-register notifications
    if (data.action === 'unRegisterNotifications') {
      this._unRegisterNotifications();
      return;
    }

    // Open links
    if (data.action === 'openUrl' && data.url && typeof data.url === 'string') {
      this._openUrl(data.url);
      return;
    }

    // Log
    if (data.action === 'log' && data.log && typeof data.log === 'string') {
      console.log(data.log);
      return;
    }

    console.log('Unrecognized `action` string in message.');
  };

  _openUrl = url => {
    console.log('openUrl: ', String(url));
    Linking.openURL(String(url)).catch(error => {
      console.log('Opening URL failed: ', error);
    });
  };

  // Runs each time new view finished loading at the `WebView`
  // I.e. on each URL change
  _handleLoadEnd = () => {
    console.log('handleLoadEnd');
    this.webView.injectJavaScript(
      //   This is needed because we want to subscribe notifications only
      //   if user is authenticated window.ReactNativeWebView.postMessage
      //   accepts one argument, data, which will be available on the event
      //   object, event.nativeEvent.data. data must be a string.
      `
        if (window.user && window.user._id && typeof window.ReactNativeWebView.postMessage === 'function') {
          window.ReactNativeWebView.postMessage('{ "action": "authenticated" }');
        }
        ${this.appInfoJavaScript}
      `
    );
  };

  _handleError = error => {
    console.log('Handle WebView error: ', error);
    // Works on both iOS and Android
    Alert.alert(
      'App failed to load resources',
      'Ensure that you are connected to internet.',
      [
        {
          text: 'OK',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View style={this.styles.container}>
        <StatusBar backgroundColor={this.styles.statusBar.backgroundColor} barStyle="default" />
        <WebView
          domStorageEnabled
          injectedJavaScript={this.appInfoJavaScript}
          onError={this._handleError}
          onLoadEnd={this._handleLoadEnd}
          onMessage={this.appInfo.os === 'ios' ? null : this._handleMessage}
          ref={o => (this.webView = o)}
          source={{ uri: this.webViewUrl }}
          style={this.styles.webView}
        />
      </View>
    );
  }
}

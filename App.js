import React, { Component } from 'react';
import { View, StyleSheet, Text, WebView  } from 'react-native';
import { Permissions, Notifications } from 'expo';
import { registerDeviceToExpo, registerExpoTokenToTrustroots } from './NotificationHelpers'
import * as Settings from './Settings'

console.log('settings', Settings)

// App wraps trustroots web site and handles notifications.
// Application tries to automaticatically register
// notifications as you load it first time.
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { url: Settings.BASE_URL };
  }

  componentWillMount() {
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    if (notification.origin === 'selected') {
      this.setState({ url: notification.data.url || this.state.url });
    }
  };

  async _registerNotifications() {
    var token = await registerDeviceToExpo();
    await registerExpoTokenToTrustroots(token);
  }

  _handleMessage = (msg) => {
    var userId = msg.nativeEvent.data;
    if (userId) {
      this. _registerNotifications();
    }
  }

  _handleLoadEnd = (msg) => {

    // See Expo constants
    // https://docs.expo.io/versions/v18.0.0/sdk/constants.html
    var version = Expo.Constants.manifest.version || '0.0.0';
    var platform = Expo.Constants.platform || '';
    var deviceName = Expo.Constants.deviceName || '';
    var deviceYearClass = Expo.Constants.deviceYearClass || '';

    // This is needed because we want to subscribe notifications only if user is authenticated
    this.webView
      .injectJavaScript(
        "window.isMobileApp=true;" +
        "window.mobileVersion='" + version + "';" +
        "window.mobilePlatform='" + platform + "';" +
        "window.mobileDeviceName='" + deviceName + "';" +
        "window.mobileDeviceYearClass='" + deviceYearClass + "';" +
        "window.postMessage(window.user && window.user._id);"
      )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={ (o) => this.webView = o }
          source={{ uri: this.state.url }}
          style={{ marginTop: 20 }}
          onMessage={ this._handleMessage }
          onLoadEnd={ this._handleLoadEnd } />
      </View>
    );
  }
}

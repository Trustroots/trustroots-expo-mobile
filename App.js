import React, { Component } from 'react';
import { View, StyleSheet, Text, WebView  } from 'react-native';
import { Permissions, Notifications } from 'expo';

async function registerForPushNotificationsAsync() {
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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { url: 'https://trustroots.org' };
    this._subscribeNotifications();
  }

  componentWillMount() {
    registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = notification => {
    if (notification.origin === 'selected') {
      this.setState({ url: notification.data.url || this.state.url});
    }
  };

  async _subscribeNotifications() {
    var token = await registerForPushNotificationsAsync();
    console.log(token);
    // register token to the user.
    // call register notification endpoint
  }
  
  _handleMessage = (msg) => {
    var userId = msg.nativeEvent.data;
    if(userId) {
        registerForPushNotificationsAsync();
    }
  }
  
  _handleLoadEnd = (msg) => {
    // This is needed because we want to subscribe notifications only if user is authenticated
    this.refs['viewer'].injectJavaScript("window.isMobileApp=true; window.postMessage(window.user && window.user._id);")
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView 
          ref="viewer"
          source={{ uri: this.state.url }} 
          style={{ marginTop: 20 }} 
          onMessage={this._handleMessage} 
          onLoadEnd={this._handleLoadEnd } />
      </View>
    );
  }
}
# Trustroots Mobile App

[Trustroots.org](https://www.trustroots.org) mobile app built with [Expo.io](https://expo.io) and [React Native](https://facebook.github.io/react-native/).

Install for Android via [Play Store](http://android.trustroots.org) or [download APK](http://apk.trustroots.org).

Currently the app merely wraps Trustroots.org site in a `WebView` component and provides push notifications.

## Getting started with development

### Before you start
1. You need Node.js installed
1. Run `npm ci` in project directory
1. Create settings file: `cp Settings-example.js Settings.js` (and modify contents if needed)

### Running the app on physical phone

1. [Get an Expo account](https://expo.io/signup). You register from Expo web site or by using command line utility.
1. Install Expo App to your mobile phone:
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://itunes.apple.com/app/apple-store/id982107779)
  - or download APK or IPA [via tools page](https://expo.io/tools).

You have two options for deploying, graphical or command line. Expo XDE might be easier path to get everything up and running.

#### Using Expo XDE graphical app

1. Install [Expo XDE](https://expo.io/tools) to your development machine (supports Windows/OSX/Linux).
1. Open App in Expo XDE. It should start compiling it.
1. Connect your mobile phone to development server. In XDE there is share button when you click it you should see QR code you can scan with Expo App. Command line utility prints QR code to console.

#### Using `exp` commandline utility
1. Install exp `npm install -g exp`
1. In project directory:
  - If your phone is connected via cable: `exp start --android --tunnel`
  - If your phone is connected to same network as your computer `exp start --android --lan`
1. Open mobile app and scan QR code

### Running in emulator
If you prefer emulator instead of using physical phone check out [instructions form Expo site](https://docs.expo.io/versions/latest/introduction/installation.html#mobile-client-expo-for-ios-and-android).

Note that emulator cannot process push notifications.

## Running local development version of the site inside the app

By default app is configured to load site from `https://www.trustroots.org` in the [WebView](https://facebook.github.io/react-native/docs/webview.html), but you can change this to load your local version.

Before you start, [install and run Trustroots](https://github.com/trustroots/trustroots) on your local machine.

To load your local version:
1. You should have Trustroots website running at [http://localhost:3000](http://localhost:3000).
1. Find your computer's [private network IP](https://www.wikihow.com/Find-the-IP-Address-of-Your-PC). You can verify it by loading `http://YOUR-IP-ADDRESS:3000/` in your browser.
1. Open `Settings.js` and set `BASE_URL` to `http://YOUR-IP-ADDRESS:3000/`.
1. Done! You should now see the page refresh on your phone or emulator if you change any files at the website.

_Note that if you want to use https or different port, you need to configure those from Trustroots's [configuration files](https://github.com/Trustroots/trustroots/tree/master/config/env)._

## Debugging

- Read [Debugging React Native](https://facebook.github.io/react-native/docs/debugging.html)
- Check out [React devtools](https://github.com/facebook/react-devtools)

## License
MIT

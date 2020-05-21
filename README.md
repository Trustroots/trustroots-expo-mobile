# Trustroots Mobile App

[Trustroots.org](https://www.trustroots.org) mobile app built with [Expo.io](https://expo.io) and [React Native](https://facebook.github.io/react-native/).

Install for Android via [Play Store](http://android.trustroots.org) or [download APK](http://apk.trustroots.org).

Currently the app merely wraps Trustroots.org site in a `WebView` component and provides push notifications.

## Getting started with development

### Before you start
1. You need Node.js installed
1. Install Expo CLI `npm install expo-cli --global`
1. Run `npm ci` in project directory
1. Create settings file: `cp Settings-example.js Settings.js` (and modify contents if needed)
1. Start the application by running `npm start`

### Running the app on physical phone

1. [Get an Expo account](https://expo.io/signup). You register from Expo web site or by using command line utility.
1. Install Expo App to your mobile phone:
  - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [iOS](https://itunes.apple.com/app/apple-store/id982107779)
  - or download APK or IPA [via tools page](https://expo.io/tools).

### Running in emulator
If you prefer emulator instead of using physical phone check out [instructions form Expo site](https://docs.expo.io/versions/latest/introduction/installation.html#mobile-client-expo-for-ios-and-android).

Note that emulator cannot process push notifications.

Type `expo start --ios` or `expo start --android` to open the application in emulators.

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

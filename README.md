# Trustroots Mobile App

[Trustroots.org](https://www.trustroots.org) mobile app built with [Expo.io](https://expo.io).

Install for Android via [Play Store](http://android.trustroots.org).

Currently the app merely wraps Trustroots.org site in a `WebView` component.

## Getting started

### Before you start:
1. You need NPM and Node. Install them. Currently it's recommended to use NPM v3 or v4, because there are still some defects in NPM v5.
1. Run `npm install` in project directory
1. Create settings file: `cp Settings-example.js Settings.js` (and modify contents if needed)

### Running the app on physical phone

1. [Get an Expo account](https://expo.io/signup). You register from Expo web site or by using command line utility.
1. Install Expo App to your mobile phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent), [iOS](https://itunes.apple.com/app/apple-store/id982107779) or download APK [via tools page](https://expo.io/tools)).

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
If you prefer emulator instead of using physical phone check out [instructions form Expo site](https://docs.expo.io/versions/introduction/installation.html).

Note that emulator cannot process push notifications.

### Running local development version of the site inside the app

By default app is configured to load site from `https://www.trustroots.org` in the [WebView](https://facebook.github.io/react-native/docs/webview.html), but you can change this to load your local version.

Before you start, [install and run Trustroots](https://github.com/trustroots/trustroots) on your local machine.

To load your local version:
1. You should have Trustroots website running at [http://localhost:3000](http://localhost:3000).
1. Find your computer's network IP, e.g. `192.168.1.3`. You can verify it by loading `http://YOUR-IP-ADDRESS:3000/` in your browser.
1. Open `Settings.js` and set `BASE_URL` to `http://192.168.1.3:3000/`.
1. Done! You should now see the page refresh on your phone or emulator if you change any files at the website.

_Note that if you want to use https or different port, you need to configure those from Trustroots's [configuration files](https://github.com/Trustroots/trustroots/tree/master/config/env)._

## Writing code

Lint your code using `npm run lint` (or `npm test`).

You can see exact validation rules from [expo:eslint-config-universe](https://github.com/expo/eslint-config-universe/tree/master/shared), or just try to follow surrounding code. You could also install [Eslint integration](https://eslint.org/docs/user-guide/integrations) in your editor. See also [Editorconfig](http://editorconfig.org/) for your editor.

## Debugging

- Read [Debugging React Native](https://facebook.github.io/react-native/docs/debugging.html)
- Check out [React devtools](https://github.com/facebook/react-devtools)

## License
MIT

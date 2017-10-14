# Trustroots Mobile App

[Trustroots.org](https://www.trustroots.org) mobile app built with [Expo.io](https://expo.io).

Currently the app merely wraps Trustroots.org site in a `WebView` component.

Getting started
---------------

#### There are two options:
1. Follow [these instructions](https://docs.expo.io/versions/introduction/installation.html) to instal Expo XDE. This is easier path to get everything up and running.
2. Install exp command line utility: `npm install -g exp`

#### Before you start:
1. You need NPM and Node. Install them. Currently it's recommended to use NPM v3 or v4, because there are still some defects in NPM v5.
1. Run `npm install` in project directory

#### Running the app on physical phone

1. [Get an Expo account](https://expo.io/signup). You register from Expo web site or by using command line utility.
1. Install Expo App to your mobile phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent), [iOS](https://itunes.apple.com/app/apple-store/id982107779) or download APK [via tools page](https://expo.io/tools)).

You have two options for deploying, graphical or command line:

##### Using Expo XDE
1. Install [Expo XDE](https://expo.io/tools) to your development machine (supports Windows/OSX/Linux).
1. Open App in Expo XDE. It should start compiling it.
1. Connect your mobile phone to development server. In XDE there is share button when you click it you should see QR code you can scan with Expo App. Command line utility prints QR code to console.

##### Using `exp` commandline utility
1. Install exp `npm install -g exp`
1. In project directory:
  - If your phone is connected via cable: `exp start --android --tunnel`
  - If your phone is connected to same network as your computer `exp start --android --lan`
1. Open mobile app and scan QR code

#### Running in emulator
If you prefer emulator instead of using physical phone check out [instructions form Expo site](https://docs.expo.io/versions/introduction/installation.html).

## License
MIT

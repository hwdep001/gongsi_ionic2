This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## ajv

```bash
$ npm install ajv
```

## promise-polyfill

```bash
$ npm install promise-polyfill --save-exact
```

## [storage](https://ionicframework.com/docs/storage/)

`https://ionicframework.com/docs/storage/`:

```bash
$ ionic cordova plugin add cordova-sqlite-storage
$ npm install --save @ionic/storage
```

## angularfire2 && firebase

`https://github.com/angular/angularfire2/blob/master/docs/1-install-and-setup.md`

```bash
$ npm install -g @angular/cli@latest
$ npm install -g typings
$ npm install -g typescript
$ npm install angularfire2 firebase --save
```

## Cordova OAuth login

```bash
# Plugin to pass application build info (app name, ID, etc) to the OAuth widget.
$ cordova plugin add cordova-plugin-buildinfo --save
# Plugin to handle Universal Links (Android app link redirects)
$ cordova plugin add cordova-universal-links-plugin --save
# Plugin to handle opening secure browser views on iOS/Android mobile devices
$ cordova plugin add cordova-plugin-browsertab --save
# Plugin to handle opening a browser view in older versions of iOS and Android
$ cordova plugin add cordova-plugin-inappbrowser --save
# Plugin to handle deep linking through Custom Scheme for iOS
# Substitute com.firebase.cordova with the iOS bundle ID of your app.
$ cordova plugin add cordova-plugin-customurlscheme --variable \
  URL_SCHEME=com.firebase.cordova --save
```
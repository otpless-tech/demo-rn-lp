# OTPless Integration Demo for React Native

<p align="center">
  <img src="./assets/zepto-logo.svg" alt="Zepto Logo" width="250" />
</p>

## Overview

OTPless is a mobile login SDK purpose-built to help Zepto drive the highest possible authentication success rates—without friction, latency, or user drop-offs. This demo showcases the seamless integration of OTPless authentication into a React Native application with a Zepto-styled UI.

We combine Silent Network Authentication (SNA), WhatsApp, SMS, and Truecaller in a layered fallback stack. Every login attempt is intelligently routed through the fastest, most reliable channel, with automatic switching and failover to ensure no user is left behind.

Our goal is simple: Increase Zepto's conversions. As partners—not as vendors—we are deeply committed to Zepto's speed, scale, security and success.

### Key Features

- 🔐 Multi-channel authentication (SNA, WhatsApp, SMS, Truecaller)
- 🚀 Intelligent routing to the fastest, most reliable channel
- 🔄 Automatic fallback mechanisms to ensure login success
- ⚡ Zero-friction user experience with minimal latency
- 📊 Higher conversion rates through optimized authentication
- 🛡️ Enterprise-grade security with token-based verification
- 📱 Native integration with React Native for both iOS and Android

## Prerequisites

- Node.js (v18 or newer)
- React Native CLI
- XCode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)
- An OTPless account and APP_ID ([Get yours here](https://otpless.com/))

## Complete OTPless Integration Guide

### Step 1: Install OTPless SDK Dependency

Install the OTPless SDK dependency by running the following command in your terminal at the root of your React Native project:

```bash
npm install otpless-react-native-lp --save
# or
yarn add otpless-react-native-lp
```

### Step 2: Platform-specific Integrations

#### Android Configuration

1. Add intent filter inside your `android/app/src/main/AndroidManifest.xml` file into your Main activity code block:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data
      android:host="otpless"
      android:scheme= "otpless.YOUR_APP_ID_LOWERCASE"/>
</intent-filter>
```

> **Important:** Replace `YOUR_APP_ID` with [your actual App ID](https://otpless.com/dashboard/customer/dev-settings/apiKeys) provided in your OTPless dashboard.

2. Add Network Security Config inside your `android/app/src/main/AndroidManifest.xml` file into your `<application>` code block (Only required if you are using the SNA feature):

```xml
android:networkSecurityConfig="@xml/otpless_network_security_config"
```

3. Change your activity launchMode to singleTop and exported true for your Main Activity:

```xml
android:launchMode="singleTop"
android:exported="true"
```

#### iOS Configuration

1. Add the following block to your `ios/Info.plist` file:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>otpless.YOUR_APP_ID_LOWERCASE</string>
        </array>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>otpless</string>
    </dict>
</array>
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>whatsapp</string>
    <string>otpless</string>
    <string>gootpless</string>
    <string>com.otpless.ios.app.otpless</string>
    <string>googlegmail</string>
</array>
```

> **Important:** Replace `YOUR_APP_ID` with [your actual App ID](https://otpless.com/dashboard/customer/dev-settings/apiKeys) provided in your OTPless dashboard.

2. Add the following block to your `ios/Info.plist` file (Only required if you are using the SNA feature):

```xml
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>80.in.safr.sekuramobile.com</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSTemporaryExceptionMinimumTLSVersion</key>
            <string>TLSv1.1</string>
        </dict>
        <key>partnerapi.jio.com</key>
        <dict>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <true/>
            <key>NSTemporaryExceptionMinimumTLSVersion</key>
            <string>TLSv1.1</string>
        </dict>
    </dict>
</dict>
```

3. Go to Xcode build settings. Search for "Defines Module", this option will appear in packaging section. Change it to "Yes".

4. Create a `Connector.swift` file (it will ask to create a bridging header, click Yes). Copy-paste the following code into your Connector.swift file:

```swift
import OtplessSwiftLP
import Foundation

class Connector: NSObject {
  @objc public static func isOtplessDeeplink(_ url: URL) -> Bool {
    return OtplessSwiftLP.shared.isOtplessDeeplink(url: url)
  }
  
  @objc public static func processDeepLink(_ url: URL) {
    OtplessSwiftLP.shared.processOtplessDeeplink(url: url)
  }
  
  @objc public static func loadUrl(_ url: URL) {
    OtplessSwiftLP.shared.processOtplessDeeplink(url: url)
  }
}
```

5. Update your `AppDelegate` file to handle OTPless redirections:

For Objective-C (`AppDelegate.mm`):
```objective-c
#import "YourProjectName-Swift.h"

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    if([Connector isOtplessDeeplink:url]){
        [Connector loadUrl:url];
        return true;
    }
    [super application:app openURL:url options:options];
    return true;
}
```

For Swift (`AppDelegate.swift`):
```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  if Connector.isOtplessDeeplink(url) {
    Connector.loadUrl(url)
    return true
  }
  return true
}
```

### Step 3: Configure Sign up/Sign in

1. Import the OTPless module on your login page:

```javascript
import { OtplessReactNativeModule } from 'otpless-react-native-lp';
```

2. Add OTPless instance and initialize the SDK:

```javascript
// Initialize the OTPless module
const otplessModule = useRef(new OtplessReactNativeModule()).current;

useEffect(() => {
  // Initialize with your APP_ID
  initializeModule();
  
  // Clean up when component unmounts
  return () => {
    otplessModule.clearListener();
    otplessModule.stop();
  };
}, []);

const initializeModule = () => {
  otplessModule.initialize('YOUR_APP_ID');
  otplessModule.setResponseCallback(onResponse);
};
```

3. Initiate OTPless Login Flow:

```javascript
// Function to trigger OTPless authentication
const startOtplessAuth = () => {
  otplessModule.start();
};
```

4. Handle the authentication response:

```javascript
// Handle OTPless response
const onResponse = (data) => {
  if (data.token) {
    // Success! Send token to your backend
    console.log('Authentication successful, token:', data.token);
    // Call your API to verify token and login the user
    loginUser(data.token);
  } else {
    // Handle authentication error
    console.error('Authentication failed:', data.errorMessage);
  }
};
```

5. When the user successfully logs in, stop OTPless:

```javascript
otplessModule.stop();
```

### Step 4: Backend Verification

Implement token verification on your backend server:

```javascript
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    // Call OTPless API to verify the token
    const response = await axios.post('https://api.otpless.com/verify', {
      token,
      clientId: process.env.OTPLESS_CLIENT_ID,
      clientSecret: process.env.OTPLESS_CLIENT_SECRET
    });
    
    if (response.data.success) {
      // Token is valid - user is authenticated
      // Create user or login existing user
      // Generate your app's session token
      
      res.json({
        success: true,
        user: response.data.user,
        sessionToken: 'your-session-token'
      });
    } else {
      // Token verification failed
      res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## ⚠️ Important: Local Development Configuration

When developing locally with Metro bundler, you may encounter network security issues due to the Android and iOS security configurations.

### Android Network Security Config Issue

The application uses a network security configuration that whitelists specific domains for cleartext (HTTP) traffic:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">80.in.safr.sekuramobile.com</domain>
    <domain includeSubdomains="true">partnerapi.jio.com</domain>
  </domain-config>
</network-security-config>
```

Since Metro bundler uses HTTP localhost for development, you need to add localhost to this whitelist:

1. Create a modified security config for development in `android/app/src/debug/res/xml/otpless_network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="true">80.in.safr.sekuramobile.com</domain>
    <domain includeSubdomains="true">partnerapi.jio.com</domain>
    <domain includeSubdomains="true">localhost</domain>
    <domain includeSubdomains="true">10.0.2.2</domain>
    <domain includeSubdomains="true">127.0.0.1</domain>
  </domain-config>
</network-security-config>
```

2. Android will automatically use this debug version when running in debug mode.

### iOS Local Development

For iOS, you may need to allow arbitrary loads for local development in your Info.plist:

```xml
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSAllowsLocalNetworking</key>
  <true/>
  <key>NSExceptionDomains</key>
  <dict>
    <key>localhost</key>
    <dict>
      <key>NSExceptionAllowsInsecureHTTPLoads</key>
      <true/>
    </dict>
  </dict>
</dict>
```

## Running the Demo

### iOS

```bash
npx react-native run-ios
```

### Android

```bash
npx react-native run-android
```

## Best Practices

1. **Backend Verification**: Always verify the OTPless token on your backend server.
2. **Error Handling**: Implement proper error handling for authentication failures.
3. **Testing**: Test the integration thoroughly on real devices.
4. **App ID Security**: Keep your APP_ID secure and never expose it in client-side code in production.

## Troubleshooting

### iOS Issues

1. **Build Errors**: Ensure your Objective-C Bridging Header is properly set up.
2. **URL Scheme**: Verify that your URL scheme matches your APP_ID in the format `otpless.YOUR_APP_ID`.
3. **Deep Linking**: Test deep linking by opening WhatsApp and returning to your app.

### Android Issues

1. **Intent Filters**: Ensure your AndroidManifest.xml has the correct intent filters.
2. **Permissions**: Check that all required permissions are properly set.
3. **Security Config**: Verify that network security configuration is correctly implemented.

## Resources

- [OTPless Documentation](https://docs.otpless.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Deep Linking in React Native](https://reactnative.dev/docs/linking)

## Support

For issues specific to this demo, please create an issue in this repository.

For OTPless-specific questions, contact support@otpless.com.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for Zepto using React Native and OTPless SDK
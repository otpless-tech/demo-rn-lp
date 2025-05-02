# OTPless Integration Guide for Zepto

This document provides detailed step-by-step instructions for integrating OTPless SDK into your Zepto React Native application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [OTPless Dashboard Setup](#otpless-dashboard-setup)
3. [React Native Project Setup](#react-native-project-setup)
4. [iOS Configuration](#ios-configuration)
5. [Android Configuration](#android-configuration)
6. [React Native Implementation](#react-native-implementation)
7. [Local Development Configuration](#local-development-configuration)
8. [Backend Integration](#backend-integration)
9. [Testing](#testing)
10. [Going to Production](#going-to-production)

## Prerequisites

Before starting the integration, make sure you have:

- OTPless Developer Account (Get one at [OTPless Dashboard](https://otpless.com/))
- Your Zepto React Native project set up
- Xcode (for iOS) and Android Studio (for Android) installed
- CocoaPods installed for iOS dependency management

## OTPless Dashboard Setup

1. Log in to your OTPless Dashboard.
2. Create a new application or select your existing application.
3. Note down your APP_ID (It will look something like `H7A18MQGF2DLZY7PIJRQ`).
4. Configure allowed domains in your dashboard settings.
5. Add your team members who need access to the dashboard.

## React Native Project Setup

1. **Install the OTPless React Native package:**

   ```bash
   npm install otpless-react-native-lp --save
   # or
   yarn add otpless-react-native-lp
   ```

2. **Link native dependencies** (if needed):

   ```bash
   npx react-native link otpless-react-native-lp
   ```

## iOS Configuration

### 1. Pod Installation

The OTPless pod should be automatically installed when you run:

```bash
cd ios
pod install
cd ..
```

### 2. Create Bridging Header (if not already present)

Create a file named `YourAppName-Bridging-Header.h` in your iOS folder and add:

```objc
#ifndef YourAppName_Bridging_Header_h
#define YourAppName_Bridging_Header_h

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#endif /* YourAppName_Bridging_Header_h */
```

### 3. Configure Bridging Header in Build Settings

1. Open your project in Xcode.
2. Select your project target.
3. Go to "Build Settings" tab.
4. Search for "Bridging Header".
5. Set "Objective-C Bridging Header" to `YourAppName/YourAppName-Bridging-Header.h`.
6. Also set "Defines Module" to "Yes".

### 4. Create Connector Class

Create a new Swift file named `Connector.swift` in your iOS folder:

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

### 5. Update Info.plist

Add the following to your Info.plist:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>otpless.YOUR_APP_ID</string>
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

**Important:** Replace `YOUR_APP_ID` with your actual APP_ID from the OTPless dashboard.

### 6. Update AppDelegate

If your app uses Swift, modify your `AppDelegate.swift` to handle deep links:

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
  if Connector.isOtplessDeeplink(url) {
    Connector.loadUrl(url)
    return true
  }
  return true
}
```

## Android Configuration

1. Ensure you've installed the React Native package.

2. Update your `android/app/src/main/AndroidManifest.xml`:

   ```xml
   <manifest ...>
     <application ...>
       <!-- Other activities and configurations -->
       
       <!-- Deep linking for OTPless -->
       <activity
         android:name=".MainActivity"
         android:exported="true">
         <!-- Existing intent filters -->
         
         <!-- Add this new intent filter -->
         <intent-filter>
           <action android:name="android.intent.action.VIEW" />
           <category android:name="android.intent.category.DEFAULT" />
           <category android:name="android.intent.category.BROWSABLE" />
           <data android:scheme="otpless.YOUR_APP_ID" />
         </intent-filter>
       </activity>
     </application>
   </manifest>
   ```

3. Update your `MainApplication.java` to include the OTPless package.

## React Native Implementation

### 1. Import and Initialize the Module

```javascript
import React, { useRef, useEffect } from 'react';
import { OtplessReactNativeModule } from 'otpless-react-native-lp';

function LoginScreen() {
  // Initialize the OTPless module
  const otplessModule = useRef(new OtplessReactNativeModule()).current;
  
  useEffect(() => {
    // Initialize with your APP_ID
    otplessModule.initialize('YOUR_APP_ID');
    
    // Set callback to handle authentication response
    otplessModule.setResponseCallback(handleOtplessResponse);
    
    // Clean up when component unmounts
    return () => {
      otplessModule.clearListener();
      otplessModule.stop();
    };
  }, []);
  
  // Handle OTPless response
  const handleOtplessResponse = (data) => {
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
  
  // Function to trigger OTPless authentication
  const startOtplessAuth = () => {
    otplessModule.start();
  };
  
  // Your authentication API
  const loginUser = async (token) => {
    try {
      // Send token to your backend for verification
      const response = await fetch('https://your-api.zepto.in/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // User authenticated successfully
        // Store user session and navigate to home screen
      } else {
        // Handle authentication error
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };
  
  return (
    // Your login UI with a button to trigger authentication
    <Button title="Continue with WhatsApp" onPress={startOtplessAuth} />
  );
}
```

## Local Development Configuration

⚠️ **Important Warning**: When developing locally using Metro bundler, you may encounter connectivity issues due to security configurations.

### Android Network Security Config Issue

OTPless uses a network security configuration that whitelists specific domains for HTTP traffic:

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

1. Create a development-specific security config in `android/app/src/debug/res/xml/otpless_network_security_config.xml`:

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

This debug configuration will be used automatically when running in development mode.

### iOS Local Development Configuration

For iOS development with Metro, modify your `Info.plist` to allow local networking:

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

## Backend Integration

Your backend needs to verify the token received from the OTPless authentication:

1. Create an API endpoint to receive the token.
2. Call the OTPless verification API to validate the token.
3. If valid, create a session for the user.
4. Return appropriate response to your mobile app.

**Example Backend Code (Node.js):**

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
      // Token is valid
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

module.exports = router;
```

## Testing

1. **Test on Real Devices:** Always test OTPless integration on real devices, not just simulators.
2. **Test Deep Linking:** Verify the app can handle deep links correctly by testing the flow from WhatsApp.
3. **Error Handling:** Test different error scenarios:
   - No network connection
   - User cancels authentication
   - Invalid or expired tokens

## Going to Production

Before releasing to production:

1. **Audit Implementation:** Review code for security and best practices.
2. **Update Dashboard:** Ensure your OTPless dashboard is configured for production.
3. **User Education:** Add help text to guide users through the authentication process.
4. **Fallback Mechanism:** Implement alternative authentication methods if OTPless fails.
5. **Monitor Metrics:** Set up analytics to track authentication success rates.

## Support

If you need additional assistance with your integration:

- **OTPless Support:** support@otpless.com
- **Internal Zepto Support:** Contact the mobile platform team
- **Documentation:** Refer to [OTPless Documentation](https://docs.otpless.com/)

---

This guide will be regularly updated as the OTPless SDK evolves or as we discover new best practices. Last updated: May 2024. 
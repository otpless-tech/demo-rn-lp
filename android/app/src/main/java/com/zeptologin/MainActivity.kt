/**
 * OTPless Android Integration - Main Activity
 * 
 * For OTPless to function properly, this file requires no code changes.
 * The integration relies on:
 * 
 * 1. Proper configuration in AndroidManifest.xml:
 *    - Intent filter with action.VIEW
 *    - Categories: DEFAULT and BROWSABLE
 *    - Data with host="otpless" and scheme="otpless.YOUR_APP_ID_LOWERCASE"
 *    - launchMode="singleTop"
 *    - exported="true"
 * 
 * 2. React Native's built-in deep link handling mechanism which
 *    automatically passes the deep link to the JavaScript layer.
 * 
 * No additional code is needed here as React Native's infrastructure
 * handles the intent routing automatically when properly configured
 * in the manifest.
 */
package com.zeptologin

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ZeptoLogin"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   * 
   * The ReactActivityDelegate handles routing of deep links to the React Native layer
   * including those from OTPless authentication flow.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

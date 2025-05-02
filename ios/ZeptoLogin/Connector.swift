/**
 * OTPless Swift Connector for React Native
 * 
 * This file serves as a bridge between the OTPless SDK (native iOS) and React Native
 * It exposes methods for handling deep links and processing them using the OTPless SDK
 * 
 * Key responsibilities:
 * 1. Detect OTPless deep links coming from WhatsApp, Google, etc.
 * 2. Process these deep links through the OTPless SDK
 * 3. Forward authentication responses to React Native components
 */

import OtplessSwiftLP
import Foundation

class Connector: NSObject {
  /**
   * Determines if a URL is an OTPless deep link
   * 
   * This method is called from AppDelegate when a deep link is received
   * to check if it should be handled by OTPless SDK
   * 
   * @param url The URL received from deep linking
   * @return Boolean indicating if the URL is an OTPless deep link
   */
  @objc public static func isOtplessDeeplink(_ url: URL) -> Bool {
    return OtplessSwiftLP.shared.isOtplessDeeplink(url: url)
  }
  
  /**
   * Process an OTPless deep link
   * 
   * This method passes the deep link to the OTPless SDK for processing
   * Once processed, the SDK will invoke the callback set in React Native
   * 
   * @param url The URL received from deep linking
   */
  @objc public static func processDeepLink(_ url: URL) {
    OtplessSwiftLP.shared.processOtplessDeeplink(url: url)
  }
  
  /**
   * Alternative method to process a URL
   * 
   * This method can be used interchangeably with processDeepLink
   * It's provided for compatibility and convenience
   * 
   * @param url The URL received from deep linking
   */
  @objc public static func loadUrl(_ url: URL) {
    OtplessSwiftLP.shared.processOtplessDeeplink(url: url)
  }
} 
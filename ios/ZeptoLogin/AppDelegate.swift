import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "ZeptoLogin",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  /**
   * Handle deep links for OTPless integration
   * 
   * This method is called when the app receives a URL (deep link)
   * It checks if the URL is an OTPless deep link and processes it if it is
   * 
   * For OTPless to work:
   * 1. Info.plist must have the proper URL scheme: otpless.[APP_ID]
   * 2. LSApplicationQueriesSchemes must include: whatsapp, otpless, gootpless, 
   *    com.otpless.ios.app.otpless, googlegmail
   * 
   * @param app The UIApplication instance
   * @param url The URL that was received
   * @param options Additional options for handling the URL
   * @return Boolean indicating if the URL was handled
   */
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // Check if this is an OTPless deep link
    if Connector.isOtplessDeeplink(url) {
      // Process the OTPless deep link
      Connector.loadUrl(url)
      return true
    }
    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

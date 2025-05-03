import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import ZeptoLogo from './assets/zepto-logo.svg';
import ZeptoBg from './assets/zepto-bg.svg';
import LinearGradient from 'react-native-linear-gradient';
import { OtplessReactNativeModule } from 'otpless-react-native-lp';
import VerificationSuccessScreen from './VerificationSuccessScreen';

const { width, height } = Dimensions.get('window');
// Your unique APP_ID from OTPless dashboard - must match URL schemes in Info.plist and AndroidManifest.xml
const APP_ID = 'H7A18MQGF2DLZY7PIJRQ';

export type RootStackParamList = {
  PhoneNumber: undefined;
  VerificationSuccess: {
    token: string;
    phone: string;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

function PhoneNumberScreen({ navigation }: { navigation: any }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const otplessModule = useRef(new OtplessReactNativeModule()).current;

  useEffect(() => {
    // Initialize OTPless when component mounts
    initializeModule();
    // Clean up OTPless resources when component unmounts to prevent memory leaks
    return () => {
      otplessModule.clearListener();
      otplessModule.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeModule = () => {
    // Connect to OTPless with your APP_ID
    otplessModule.initialize(APP_ID);
    // Register callback to receive authentication response
    otplessModule.setResponseCallback(onResponse);
  };

  const handleContinue = () => {
    setError('');
    setLoading(true);
    const baseRequest: any = {};
    if (Platform.OS === 'ios') {
      baseRequest.safariCustomizationOptions = {
        preferredBarTintColor: '#5B0171',
        dismissButtonStyle: 'cancel',
      };
    } else {
      baseRequest.customTabParam = {
        toolbarColor: '#5B0171',
        navigationBarColor: '#5B0171',
        navigationBarDividerColor: '#FF3269',
        backgroundColor: '#5B0171',
      };
    }

    const request = phoneNumber ? {
      ...baseRequest,
      "extraQueryParams": {
        "phone": phoneNumber,
        "countryCode": "91"
      }
    } : baseRequest;

    // Launch OTPless authentication flow (opens WhatsApp or shows authentication options)
    otplessModule.start(request);
  };

  /**
   * Handle response from OTPless authentication
   * 
   * @param data - Contains authentication result with either:
   *   - token: The authentication token to verify with your backend
   *   - errorMessage: Details if authentication failed or was cancelled
   */
  const onResponse = (data: any) => {
    //Alert.alert('onResponse', JSON.stringify(data));
    setLoading(false);
    if (data.token) {
      navigation.navigate('VerificationSuccess', {
        token: data.token,
        phone: phoneNumber,
      });
    } else {
      if (data.errorCode !== 10000) {
        Alert.alert('OTPless Error', data.errorMessage || 'Authentication failed.');
      }
    }
  };

  const handleTermsPress = () => {
    Linking.openURL('https://zepto.in/terms');
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://zepto.in/privacy');
  };

  return (
    <View style={styles.container}>
      {/* Full-screen SVG background */}
      <View style={styles.bgSvgContainer} pointerEvents="none">
        <ZeptoBg width={width} height={height} />
      </View>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#4B0082" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.contentContainer}>
              {/* Zepto SVG Logo */}
              <View style={styles.logoContainer}>
                <ZeptoLogo width={180} height={60} />
              </View>
              {/* Tagline */}
              <View style={styles.taglineContainer}>
                <Text style={styles.tagline}>Groceries</Text>
                <Text style={styles.tagline}>delivered in</Text>
                <Text style={styles.tagline}>10 minutes</Text>
              </View>
              {/* Phone Input */}
              <View style={[
                styles.inputContainer,
                error ? { borderColor: '#FF5252', borderWidth: 1 } : null,
              ]}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Phone Number"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={text => {
                    setPhoneNumber(text.replace(/[^0-9]/g, ''));
                    if (error) setError('');
                  }}
                  maxLength={10}
                  editable={!loading}
                />
              </View>
              {/* Error message below input */}
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              {/* Continue Button with Gradient or Loader/Tick */}
              <LinearGradient
                colors={["#FF5858", "#FF7E5F"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradientWrapper}
              >
                <TouchableOpacity
                  onPress={handleContinue}
                  activeOpacity={0.8}
                  style={styles.continueButtonTouchable}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.continueButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
            {/* Terms and Privacy */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>Terms of Use</Text>
                <Text style={styles.termsText}> & </Text>
                <Text style={styles.termsLink} onPress={handlePrivacyPress}>Privacy Policy</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PhoneNumber"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#4B0082' }
        }}
      >
        <Stack.Screen
          name="PhoneNumber"
          component={PhoneNumberScreen}
        />
        <Stack.Screen
          name="VerificationSuccess"
          component={VerificationSuccessScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
    position: 'relative',
  },
  bgSvgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: height * 0.08,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 18,
  },
  taglineContainer: {
    width: '100%',
    marginBottom: 48,
    alignItems: 'flex-start',
  },
  tagline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 38,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 32,
    paddingVertical: 4,
    paddingHorizontal: 18,
    marginBottom: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  countryCode: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: '#333',
    paddingLeft: 0,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 18,
  },
  continueButtonGradientWrapper: {
    width: '100%',
    borderRadius: 32,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  continueButtonTouchable: {
    height: 48,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  termsContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  termsText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  termsLink: {
    color: '#FF5252',
    fontSize: 14,
    fontWeight: '500',
  },
});
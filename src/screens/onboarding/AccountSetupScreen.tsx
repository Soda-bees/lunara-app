import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { useOnboarding } from '../../context/OnboardingContext';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/colors';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import {
  configureGoogleSignIn,
  onAppleButtonPress,
  signInWithGoogle,
} from '../../services/auth/socialAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSetup'>;

export const AccountSetupScreen: React.FC<Props> = ({ navigation, route }) => {
  const { updateData, data } = useOnboarding();
  const googleUser = route.params?.googleUser;

  // Pre-fill with Google user data if available
  const [fullName, setFullName] = useState(
    googleUser?.name || data.fullName || '',
  );
  const [email, setEmail] = useState(googleUser?.email || data.email || '');
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState(data.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  // Check if user is from Google (either from route params or context)
  const [isGoogleUser, setIsGoogleUser] = useState(
    !!googleUser || !!data.googleIdToken,
  );

  // Update email/name if Google user data comes from context
  useEffect(() => {
    if (data.googleIdToken && !googleUser) {
      setIsGoogleUser(true);
      if (data.email && !email) setEmail(data.email);
      if (data.fullName && !fullName) setFullName(data.fullName);
    }
  }, [data.googleIdToken, data.email, data.fullName]);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordStrong = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  // For Google users, password is optional (they'll complete onboarding without password)
  // Password will be set during final signup
  const canProceed = isGoogleUser
    ? fullName && isEmailValid
    : fullName && isEmailValid && isPasswordStrong && passwordsMatch;

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleContinue = () => {
    if (canProceed) {
      // For Google users, don't save password (they'll complete signup at the end)
      // Google ID token is already stored in onboarding context from SignIn/SignUp
      const dataToSave = isGoogleUser
        ? { fullName, email }
        : { fullName, email, password };
      updateData(dataToSave, 'LetsGetStarted');
      navigation.navigate('LetsGetStarted');
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <OnboardingHeader
          title="Create your account"
          subtitle="We'll personalize everything to you"
          currentStep={1}
          totalSteps={8}
        />
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Alex Morgan"
              placeholderTextColor={colors.placeholder}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                emailBlurred && email && !isEmailValid && styles.inputError,
                isGoogleUser && styles.inputDisabled,
              ]}
              placeholder="you@example.com"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={isGoogleUser ? undefined : setEmail}
              editable={!isGoogleUser}
              onBlur={() => setEmailBlurred(true)}
              onFocus={() => setEmailBlurred(false)}
            />
            {emailBlurred && email && !isEmailValid && (
              <Text style={styles.error}>Enter a valid email address</Text>
            )}
            {isGoogleUser && (
              <Text style={styles.helper}>Email from your Google account</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  password && !isPasswordStrong && styles.inputError,
                ]}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={showPassword ? images.show : images.hide}
                  style={styles.eyeIconText}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helper}>
              Use 8+ characters with a mix of letters and numbers.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Confirm password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  confirmPassword && !passwordsMatch && styles.inputError,
                ]}
                placeholder="Re-enter your password"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  source={showConfirmPassword ? images.show : images.hide}
                  style={styles.eyeIconText}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.socialAuthContainer}>
              <View style={styles.socialAuthDivider}>
                <View style={styles.hr}></View>
                <Text style={styles.socialAuthText}>or continue with</Text>
                <View style={styles.hr}></View>
              </View>
              <View style={styles.socialAuthButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={onAppleButtonPress}
                >
                  <Image
                    style={styles.socialButtonIcon}
                    source={images.appleIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={signInWithGoogle}
                >
                  <Image
                    style={styles.socialButtonIcon}
                    source={images.googleIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {confirmPassword && !passwordsMatch && (
              <Text style={styles.error}>Passwords must match</Text>
            )}
          </View>
        </View>
        <View style={styles.bottomButton}>
          <EmpatheticButton
            title="Continue"
            onPress={handleContinue}
            disabled={!canProceed}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    gap: spacing.lg,
  },

  section: {
    gap: spacing.xs,
  },

  label: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: colors.textMuted,
  },

  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingRight: spacing.xl + spacing.md,
    backgroundColor: '#F8FAFC',
    color: '#000000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  eyeIconText: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  inputError: {
    borderColor: colors.errorSolid,
    backgroundColor: '#FFF1F2',
  },

  helper: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  error: {
    color: colors.errorSolid,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  privacy: {
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  bottomButton: {
    marginTop: sizes.screenHeight * 0.02,
    gap: spacing.sm,
  },

  socialAuthContainer: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  socialAuthDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  hr: {
    height: 1,
    backgroundColor: colors.border,
    flex: 1,
  },

  socialAuthText: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    paddingHorizontal: spacing.sm,
  },

  socialAuthButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },

  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: sizes.screenHeight * 0.07,
    width: sizes.screenHeight * 0.07,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.screenHeight * 0.1,
  },

  socialButtonIcon: {
    height: sizes.screenHeight * 0.032,
    width: sizes.screenHeight * 0.032,
    resizeMode: 'contain',
  },
});

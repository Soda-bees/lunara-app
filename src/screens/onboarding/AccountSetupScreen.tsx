import React, { useState } from 'react';
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
import { colors, radius, spacing } from '../../constants/theme/theme';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSetup'>;

export const AccountSetupScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [fullName, setFullName] = useState(data.fullName || '');
  const [email, setEmail] = useState(data.email || '');
  const [password, setPassword] = useState(data.password || '');
  const [confirmPassword, setConfirmPassword] = useState(data.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordStrong = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const canProceed =
    fullName && isEmailValid && isPasswordStrong && passwordsMatch;

  const handleContinue = () => {
    if (canProceed) {
      updateData({ fullName, email, password }, 'LetsGetStarted');
      // navigation.navigate('BasicInfo');
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
              ]}
              placeholder="you@example.com"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEmailBlurred(true)}
              onFocus={() => setEmailBlurred(false)}
            />
            {emailBlurred && email && !isEmailValid && (
              <Text style={styles.error}>Enter a valid email address</Text>
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
          <Text style={styles.privacy}>
            By continuing, you agree to our terms and privacy policy.
          </Text>
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
    color: colors.text,
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
    borderColor: colors.error,
    backgroundColor: '#FFF1F2',
  },

  helper: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  error: {
    color: colors.error,
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
    marginTop: sizes.screenHeight * 0.14,
    gap: spacing.sm,
  },
});

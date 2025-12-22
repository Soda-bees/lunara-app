import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { EmpatheticButton } from '../../components/EmpatheticButton/EmpatheticButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const email = route.params?.email;
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigation.replace('ForgotPassword');
    }
  }, [email, navigation]);

  const isOtpValid = otp.trim().length >= 4;
  const isPasswordStrong = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    email && isOtpValid && isPasswordStrong && passwordsMatch && !isLoading;

  const handleReset = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      // TODO: call reset-password endpoint with email + otp + new password
      await new Promise<void>(resolve => setTimeout(resolve, 700));
      navigation.replace('Login', { from: route.params?.from });
    } catch (e) {
      setError('Invalid code or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>🧩</Text>
            <Text style={styles.title}>Verify code & reset</Text>
            <Text style={styles.subtitle}>
              We've sent a one-time code to{' '}
              <Text style={styles.bold}>{email}</Text>. Enter it below and set a
              new password.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>One-time code</Text>
            <TextInput
              keyboardType="number-pad"
              style={[styles.input, otp && !isOtpValid && styles.inputError]}
              placeholder="Enter 4-6 digit code"
              placeholderTextColor={colors.placeholder}
              value={otp}
              onChangeText={setOtp}
            />

            <Text style={[styles.label, { marginTop: spacing.sm }]}>
              New password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showPassword}
                style={[
                  styles.passwordInput,
                  password && !isPasswordStrong && styles.inputError,
                ]}
                placeholder="At least 8 characters"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIconText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { marginTop: spacing.sm }]}>
              Confirm new password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showConfirmPassword}
                style={[
                  styles.passwordInput,
                  confirmPassword && !passwordsMatch && styles.inputError,
                ]}
                placeholder="Re-enter password"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIconText}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>

            {!passwordsMatch && confirmPassword && (
              <Text style={styles.error}>Passwords must match</Text>
            )}
            {password && !isPasswordStrong && (
              <Text style={styles.error}>Use at least 8 characters</Text>
            )}
          </View>

          {error && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{error}</Text>
            </View>
          )}

          <EmpatheticButton
            title={isLoading ? 'Resetting...' : 'Reset password'}
            onPress={handleReset}
            disabled={!canSubmit}
          />

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => navigation.replace('ForgotPassword')}
            >
              <Text style={styles.link}>Resend code</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={[styles.link, styles.linkPrimary]}>
                Back to sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  header: { alignItems: 'center', gap: spacing.xs },
  icon: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { color: colors.textMuted, textAlign: 'center' },
  bold: { fontWeight: '700', color: colors.text },
  form: { gap: spacing.xs },
  label: { fontWeight: '700', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F8FAFC',
    color: '#000000',
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
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    padding: spacing.xs,
  },
  eyeIconText: {
    fontSize: 20,
    color: colors.textMuted,
  },
  inputError: { borderColor: colors.error, backgroundColor: '#FFF1F2' },
  error: { color: colors.error, fontSize: 13 },
  banner: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
  },
  bannerText: { color: '#B91C1C', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: { fontWeight: '700', color: colors.textMuted },
  linkPrimary: { color: colors.primary },
});

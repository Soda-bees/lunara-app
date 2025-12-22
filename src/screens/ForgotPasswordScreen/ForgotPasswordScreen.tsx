import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { EmpatheticButton } from '../../components/EmpatheticButton/EmpatheticButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const [email, setEmail] = useState('');
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = isEmailValid && !isLoading;

  const handleSendOtp = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      // TODO: call forgot-password endpoint
      await new Promise<void>(resolve => setTimeout(resolve, 600));
      navigation.replace('ResetPassword', { email, from: route.params?.from });
    } catch (e) {
      setError('Unable to send code right now. Please try again.');
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
            <Text style={styles.icon}>📧</Text>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a one-time code to reset your
              password.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                emailBlurred && email && !isEmailValid && styles.inputError,
              ]}
              placeholder="you@example.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              onBlur={() => setEmailBlurred(true)}
              onFocus={() => setEmailBlurred(false)}
            />
            {emailBlurred && email && !isEmailValid && (
              <Text style={styles.error}>Enter a valid email</Text>
            )}
          </View>

          {error && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{error}</Text>
            </View>
          )}

          <EmpatheticButton
            title={isLoading ? 'Sending code...' : 'Send code'}
            onPress={handleSendOtp}
            disabled={!canSubmit}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
  footer: { alignItems: 'center' },
  link: { fontWeight: '700' },
  linkPrimary: { color: colors.primary },
});

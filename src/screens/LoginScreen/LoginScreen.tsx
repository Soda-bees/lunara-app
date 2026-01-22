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
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { RootStackParamList } from '../../navigation/stackNavigation';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmit = isEmailValid && password.length >= 1 && !isLoading;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);
    try {
      // TODO: replace with real login API
      await new Promise<void>(resolve => setTimeout(resolve, 600));
      const redirectTo = route.params?.from ?? 'Home';
      navigation.replace(redirectTo as any);
    } catch (e) {
      setError('Unable to sign in right now. Please try again.');
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
            <Text style={styles.icon}>🔐</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
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

            <Text style={[styles.label, { marginTop: spacing.sm }]}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholder="Your password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIconText}>
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.links}>
              <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                <Text style={styles.link}>Back to welcome</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPassword', { from: 'Login' })
                }
              >
                <Text style={[styles.link, styles.linkPrimary]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.banner}>
                <Text style={styles.bannerText}>{error}</Text>
              </View>
            )}
          </View>

          <EmpatheticButton
            title={isLoading ? 'Signing in...' : 'Sign in'}
            onPress={handleLogin}
            disabled={!canSubmit}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountSetup')}
            >
              <Text style={[styles.link, styles.linkPrimary]}>
                Create an account
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
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  icon: { fontSize: 32 },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { color: colors.textMuted },
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
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  link: { color: colors.textMuted, fontWeight: '700' },
  linkPrimary: { color: colors.primary },
  banner: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginTop: spacing.xs,
  },
  bannerText: { color: '#B91C1C', fontWeight: '700' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerText: { color: colors.textMuted },
});

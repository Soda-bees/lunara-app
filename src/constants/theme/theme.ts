/**
 * @deprecated Prefer `import { colors, spacing, radius } from '../colors'`.
 *
 * Compatibility shim: preserves historical `theme.colors.primary` as brand gold
 * (`colors.heading`). Hex values live only in `constants/colors`.
 */

import { colors as tokens, spacing, radius } from '../colors';

export const colors = {
  black: tokens.black,
  background: tokens.onboardingBackground,
  gradientTop: tokens.gradientTop,
  gradientBottom: tokens.gradientBottom,
  surface: tokens.surface,
  /** Historical onboarding primary — maps to brand gold. */
  primary: tokens.heading,
  primaryMuted: tokens.primaryMuted,
  lightPrimary: tokens.headingLight,
  text: tokens.black,
  textMuted: tokens.textMuted,
  placeholder: tokens.placeholder,
  border: tokens.border,
  success: tokens.success,
  error: tokens.errorSolid,
  darkGrey: tokens.darkGrey,
};

export { spacing, radius };

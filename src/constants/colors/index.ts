/**
 * Canonical design tokens for Lunara UI.
 *
 * New screens/components should import from here only:
 *   import { colors, spacing, radius } from '../../constants/colors';
 *
 * Do not add hex literals in feature files when a token already exists.
 * `constants/theme/theme` is a deprecated compatibility shim for unmigrated callers.
 *
 * Note: `colors.primary` is the app olive accent. Brand gold (onboarding CTAs)
 * is `colors.heading` (historically `theme.colors.primary`).
 */

export const colors: { [key: string]: string } = {
  white: '#ffffff',
  black: '#000000',
  error: 'rgba(200, 0, 0, 0.8)',
  /** Solid error used by onboarding / forms (former theme.colors.error). */
  errorSolid: '#F43F5E',
  primary: '#717660',
  primaryLight: '#B8BBAF',
  /** Pink muted accent (former theme.colors.primaryMuted). */
  primaryMuted: '#E799AD',
  // borderColor: '#E4E4E4',
  inputColor: '#FAFAFA',
  disable: '#F3F3F3',
  inputGrey: '#FAFAFA',
  inputBorderGrey: '#F5F5F5',
  placeholderColor: '#C3C3C3',
  /** Slate placeholder (former theme.colors.placeholder). */
  placeholder: '#94A3B8',
  bgLight: '#FFF9F9',
  base: '#F8F2FB',
  /** Soft onboarding page background (former theme.colors.background). */
  onboardingBackground: '#F8FAFC',
  gradientTop: '#FDF4FF',
  gradientBottom: '#faf0ffff',
  surface: '#FFFFFF',
  follicularLight: '#ECD9F4',
  menstrualLight: '#FCE2EB',
  lutealLight: '#DDE4F9',
  ovulationLight: '#D7E4EA',
  follicular: '#B388EB',
  menstrual: '#F8ADBE',
  luteal: '#B3D7FE',
  ovulation: '#61B9BE',
  maroon: '#9D2F50',
  lightBlue: '#EDEFF7',
  darkBlue: '#468FDE',
  primaryDisable: '#FFF2F4',
  chartBar: '#98FB98',
  targetLine: '#FF69B4',
  touchAbleBlue: '#C0EAED',
  slightlyPinkish: '#FFF2F4',
  lightPink: '#FFE8EC',
  dateBg: '#E7E5D6',
  tabBGColor: '#EEEFEC',
  backgroundGrey: '#FBF8FE',
  //////////////////////////////////////////////////////////////
  borderColorDark: '#D4D4D4',
  borderColor: '#E8E8E8',
  /** Slate border (former theme.colors.border). */
  border: '#E2E8F0',
  lineGray: '#DADADA',
  placeHolderGray: '#A0A0A0',
  inputBorderGray: '#EBEBEB',
  buttonBorderGrey: '#EAEAEA',
  borderColorLight: '#f0f0f0',
  textAreaGrey: '#F9F9F9',
  disabledText: '#7D7D7D',
  darkPink: '#F1557A',
  disablePink: '#FFF6F8',
  dotGrey: '#D4D4D4',
  phasesGray: '#FAF9FF',
  /** Brand gold / onboarding primary accent (former theme.colors.primary). */
  heading: '#E4AF5D',
  headingLight: '#FFF9F0',
  maroonText: '#901933',
  text: '#333',
  /** Muted body copy (former theme.colors.textMuted). */
  textMuted: '#7D7D7D',
  background: '#fff',
  green: '#7DA38D',
  darkGrey: '#7D7D7D',
  borderPink: '#F7DEE7',
  lightOranger: '#FFF4E3',
  success: '#22C55E',
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 35,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

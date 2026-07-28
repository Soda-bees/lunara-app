import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../GradientText';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

type Props = {
  loading?: boolean;
  isTracking?: boolean;
  isPregnant?: boolean;
  cycleDay?: number;
  averageCycleLength?: number;
  phase?: string;
  tagline?: string | null;
  widthMultiplier?: number;
  backgroundGradientColors?: string[];
  wrapperStyle?: StyleProp<ViewStyle>;
};

const getPhaseDisplayName = (phase?: string): string => {
  if (!phase || phase === 'unknown') return 'Unknown';
  return phase.charAt(0).toUpperCase() + phase.slice(1);
};

const getPhaseIcon = (phase?: string) => {
  switch (phase) {
    case 'menstrual':
      return images.menstrualIcon;
    case 'follicular':
      return images.follicularIcon;
    case 'ovulatory':
      return images.ovulationIcon;
    case 'luteal':
      return images.lutealIcon;
    default:
      return images.lutealIcon;
  }
};

const progressPercentage = (
  cycleDay?: number,
  cycleLength?: number,
): number => {
  if (!cycleDay || !cycleLength) return 0;
  return Math.min(100, Math.max(0, (cycleDay / cycleLength) * 100));
};

export default function CycleIndicatorCard({
  loading = false,
  isTracking = false,
  isPregnant = false,
  cycleDay,
  averageCycleLength = 28,
  phase,
  tagline,
  widthMultiplier = 0.82,
  backgroundGradientColors,
  wrapperStyle,
}: Props) {
  const gradientColors =
    backgroundGradientColors && backgroundGradientColors.length > 0
      ? backgroundGradientColors
      : [colors.white, colors.white];
  const cardStyle = [
    styles.card,
    {
      width: sizes.screenWidth * widthMultiplier,
    },
    wrapperStyle,
  ];

  if (loading) {
    return (
      <LinearGradient
        style={cardStyle}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="small" color={colors.heading} />
        <Text style={styles.infoText}>Loading cycle indicator...</Text>
      </LinearGradient>
    );
  }

  if (isPregnant) {
    return (
      <LinearGradient
        style={cardStyle}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.infoText}>
          Cycle indicator is hidden while pregnancy mode is active.
        </Text>
      </LinearGradient>
    );
  }

  if (!isTracking) {
    return (
      <LinearGradient
        style={cardStyle}
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.infoText}>
          Enable cycle tracking to view your cycle indicator.
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      style={cardStyle}
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Text style={styles.spacedText}>CYCLE PROGRESS</Text>

      <View style={styles.rowFull}>
        <View style={styles.rowBottom}>
          <GradientText fontSize={42} fontFamily="Inter-Regular">
            {cycleDay || '—'}
          </GradientText>
          <Text style={[styles.numberTextMedium, { top: -12 }]}>
            {' '}
            / {averageCycleLength || 28}
          </Text>
        </View>
        <View style={styles.dayTextContainer}>
          <Text style={styles.textBlackNormal}>Day {cycleDay || '—'}</Text>
        </View>
      </View>
      <View style={styles.progressIndicator}>
        <LinearGradient
          style={[
            styles.progress,
            {
              width: `${progressPercentage(
                cycleDay,
                averageCycleLength || 28,
              )}%`,
            },
          ]}
          colors={['#E4AF5D', '#E799AD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      <View style={styles.rowFull}>
        <View>
          <Text style={styles.spacedText}>CURRENT PHASE</Text>
          <GradientText fontSize={24} fontFamily="PlayfairDisplay-SemiBold">
            {getPhaseDisplayName(phase)}
          </GradientText>
        </View>
        <Image source={getPhaseIcon(phase)} style={styles.phaseIcon} />
      </View>

      <Text style={styles.textDarkGrey}>{tagline || '—'}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: '#D4D4D455',
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    gap: 10,
    marginVertical: 12,
    alignSelf: 'center',
  },
  infoText: {
    fontSize: 13,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },
  spacedText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    letterSpacing: 1.2,
  },
  rowFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  numberTextMedium: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  dayTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlackNormal: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressIndicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  phaseIcon: {
    width: sizes.screenWidth * 0.14,
    height: sizes.screenWidth * 0.14,
    resizeMode: 'contain',
  },
  textDarkGrey: {
    color: colors.darkGrey,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
});

import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from '../style';
import movementGuideStyles from '../movementGuideStyles';
import images from '../../../constants/images';
import GradientWrapper from '../../../components/GradientWrapper';
import MovementMap from '../../../components/MovementMap';
import { sizes } from '../../../constants/sizes';
import { colors } from '../../../constants/colors';
import {
  getPhaseInfo,
  getMovementScience,
  type PhaseInfo,
  type MovementScienceItem,
  type LoggedWorkout,
} from '../../../services/api';

type Props = {
  date: string;
  dailyMovementLogs: LoggedWorkout[];
  /** Partner / read-only: hide create/edit Log Movement CTA. */
  readOnly?: boolean;
  onLogMovementPress?: () => void;
};

const FALLBACK_PHASE_INFO: PhaseInfo = {
  phaseName: 'Your Current Phase',
  phaseTitle: 'Movement Focus',
  description:
    'Listen to your body and choose movement that feels right for you today.',
  benefit: 'Supports overall health and well-being',
  avoid: "Overexertion or ignoring your body's signals",
  phase: 'unknown',
  isPregnant: false,
  isBreastfeeding: false,
  isPostpartum: false,
};

export default function TrackMovementSection({
  date,
  dailyMovementLogs,
  readOnly = false,
  onLogMovementPress,
}: Props) {
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [movementScienceData, setMovementScienceData] = useState<
    MovementScienceItem[]
  >([]);
  const [movementGuideLoading, setMovementGuideLoading] = useState(false);
  const [movementGuideError, setMovementGuideError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setMovementGuideLoading(true);
        setMovementGuideError(null);
        const [phaseRes, scienceRes] = await Promise.all([
          getPhaseInfo(date),
          getMovementScience(),
        ]);
        if (cancelled) return;
        if (phaseRes.success && phaseRes.data) {
          setPhaseInfo(phaseRes.data);
        }
        if (scienceRes.success && scienceRes.data) {
          setMovementScienceData(scienceRes.data);
        } else {
          setMovementScienceData([
            {
              title: 'Muscle & Insulin',
              description:
                'Muscle contraction increases insulin sensitivity—helping regulate blood sugar and hormone balance.',
              image: '💪',
            },
            {
              title: 'Walking After Meals',
              description:
                'A 10-minute walk after eating can reduce estrogen dominance and improve digestion.',
              image: '🚶‍♀️',
            },
          ]);
        }
      } catch (e: any) {
        if (!cancelled) {
          setMovementGuideError(
            e?.message || 'Unable to load movement information.',
          );
        }
      } finally {
        if (!cancelled) setMovementGuideLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [date]);

  const displayPhaseInfo = phaseInfo || FALLBACK_PHASE_INFO;

  return (
    <>
      <View style={movementGuideStyles.sectionIntro}>
        <Text style={movementGuideStyles.sectionTitle}>
          Hormone-Intelligent Movement
        </Text>
        <Text style={movementGuideStyles.sectionSubtitle}>
          Align your workouts with your cycle for optimal results
        </Text>
      </View>

      {!readOnly ? (
        <TouchableOpacity
          style={styles.logMovementButton}
          onPress={onLogMovementPress}
        >
          <Text style={styles.logMovementButtonText}>Log Movement</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.dailyLogCard}>
        <Text style={styles.dailyLogTitle}>{"Today's Movement Log"}</Text>
        {dailyMovementLogs.length === 0 ? (
          <Text style={styles.emptyText}>No movement logged yet today.</Text>
        ) : (
          dailyMovementLogs.map(entry => (
            <View style={styles.logRow} key={entry._id || entry.loggedAt}>
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>
                  {entry.workoutTitleSnapshot || 'Workout'}
                </Text>
                <Text style={styles.logMeta}>
                  {entry.durationMinutes} min
                  {entry.isCustom ? ' • Custom' : ''}
                </Text>
              </View>
              <Text style={styles.logMeta}>
                {new Date(entry.loggedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))
        )}
      </View>

      <GradientWrapper variant="basic">
        <View style={movementGuideStyles.phaseBody}>
          <View style={movementGuideStyles.rowFull}>
            <View style={movementGuideStyles.rowBottom}>
              <View>
                <Text style={movementGuideStyles.numberTextMedium}>
                  Your Current Phase
                </Text>
                <Text style={movementGuideStyles.phaseTitleLarge}>
                  {displayPhaseInfo.phaseName}
                </Text>
                <View style={movementGuideStyles.risingMainView}>
                  <Text
                    style={[
                      movementGuideStyles.numberTextMedium,
                      { color: colors.heading },
                    ]}
                  >
                    {displayPhaseInfo.phaseTitle}
                  </Text>
                </View>
              </View>
            </View>
            <Image
              source={images.dumbellIcon}
              style={movementGuideStyles.dumbellsIcon}
            />
          </View>
          <Text style={movementGuideStyles.textDarkGrey}>
            {displayPhaseInfo.description}
          </Text>
          <View style={movementGuideStyles.cautionView}>
            <Image source={images.energyHigh} style={movementGuideStyles.icon} />
            <View>
              <Text style={movementGuideStyles.heading}>Hormone Benefit</Text>
              <Text style={movementGuideStyles.durationText}>
                {displayPhaseInfo.benefit}
              </Text>
            </View>
          </View>
          <View style={movementGuideStyles.cautionView}>
            <Image
              source={images.informationIcon}
              style={[movementGuideStyles.icon, { tintColor: 'red' }]}
            />
            <View>
              <Text style={movementGuideStyles.heading}>What to Avoid</Text>
              <Text style={movementGuideStyles.durationText}>
                {displayPhaseInfo.avoid}
              </Text>
            </View>
          </View>
        </View>
      </GradientWrapper>

      <MovementMap />

      {movementGuideLoading && (
        <View style={movementGuideStyles.loadingContainer}>
          <ActivityIndicator color={colors.heading} />
          <Text style={movementGuideStyles.loadingText}>
            Loading movement science...
          </Text>
        </View>
      )}

      {movementGuideError ? (
        <View style={movementGuideStyles.errorContainer}>
          <Text style={movementGuideStyles.errorText}>
            {movementGuideError}
          </Text>
        </View>
      ) : null}

      <View style={movementGuideStyles.movementScienceView}>
        <Text style={movementGuideStyles.mainHeading}>Movement Science</Text>
        {movementScienceData.map((item, index) => (
          <View style={movementGuideStyles.cautionView} key={index}>
            <Text style={movementGuideStyles.movementIcon}>{item.image}</Text>
            <View>
              <Text
                style={[
                  movementGuideStyles.heading,
                  {
                    fontFamily: 'PlayfairDisplay-Medium',
                    width: sizes.screenWidth * 0.45,
                  },
                ]}
              >
                {item.title}
              </Text>
              <Text style={movementGuideStyles.durationText}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
}

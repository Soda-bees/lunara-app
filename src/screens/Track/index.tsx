import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import movementGuideStyles from './movementGuideStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Header from '../../components/Header';
import { CategoryButton } from '../../components/CategoryButton';
import images from '../../constants/images';
import Nutrition from '../../components/Nutrition';
import Mindful from '../../components/Mindful';
import CycleIndicatorCard from '../../components/CycleIndicatorCard';
import { useCycleData } from '../../context/CycleDataContext';
import MovementLogModal from '../../components/MovementLogModal';
import { useWorkoutPlan } from '../../hooks/useWorkoutPlan';
import GradientWrapper from '../../components/GradientWrapper';
import MovementMap from '../../components/MovementMap';
import { sizes } from '../../constants/sizes';
import { colors } from '../../constants/colors';
import {
  getPhaseInfo,
  getMovementScience,
  type PhaseInfo,
  type MovementScienceItem,
} from '../../services/api';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';

type Category = 'Nutrition' | 'Movement' | 'Mindful';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

type TrackRouteParams = {
  initialCategory?: Category;
};

export default function Track() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { isPartnerMode } = usePartnerMode();
  const { cycleStatus } = useCycleData();
  const cycle = cycleStatus.data;
  const isPregnant =
    Boolean(cycle?.isPaused) && cycle?.pauseReason === 'pregnancy';
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('Nutrition');
  const [movementModalVisible, setMovementModalVisible] = useState(false);
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [movementScienceData, setMovementScienceData] = useState<
    MovementScienceItem[]
  >([]);
  const [movementGuideLoading, setMovementGuideLoading] = useState(false);
  const [movementGuideError, setMovementGuideError] = useState<string | null>(
    null,
  );

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);
  const { plan: workoutPlan, logWorkout, refetch } = useWorkoutPlan(today);
  const dailyMovementLogs = useMemo(() => {
    const logs = workoutPlan?.loggedWorkouts || [];
    return [...logs].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
    );
  }, [workoutPlan?.loggedWorkouts]);

  useFocusEffect(
    useCallback(() => {
      const params = route.params as TrackRouteParams | undefined;
      if (params?.initialCategory === 'Movement') {
        setSelectedCategory('Movement');
        navigation.setParams({ initialCategory: undefined } as never);
      }
    }, [navigation, route.params]),
  );

  useEffect(() => {
    if (selectedCategory !== 'Movement') return;

    let cancelled = false;
    const load = async () => {
      try {
        setMovementGuideLoading(true);
        setMovementGuideError(null);
        const [phaseRes, scienceRes] = await Promise.all([
          getPhaseInfo(today),
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
  }, [selectedCategory, today]);

  const fallbackPhaseInfo: PhaseInfo = {
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

  const displayPhaseInfo = phaseInfo || fallbackPhaseInfo;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.forgotText}>Track Your Day</Text>
          <Text style={styles.paraText}>
            Log nutrition, movement, and mindfulness in one place
          </Text>
          <CycleIndicatorCard
            loading={cycleStatus.loading}
            isTracking={Boolean(cycle?.isTracking)}
            isPregnant={isPregnant}
            cycleDay={cycle?.cycleDay}
            averageCycleLength={cycle?.averageCycleLength || 28}
            phase={cycle?.phase}
            tagline={cycle?.tagline}
            widthMultiplier={0.9}
            backgroundGradientColors={['#FBFAF8', '#DFE7F7']}
          />

          <View style={styles.categoryContainer}>
            <CategoryButton
              icon={images.nutritionsIcon}
              label="Nutrition"
              isActive={selectedCategory === 'Nutrition'}
              onPress={setSelectedCategory}
            />
            <CategoryButton
              icon={images.trackMovementIcon}
              label="Movement"
              isActive={selectedCategory === 'Movement'}
              onPress={setSelectedCategory}
            />
          </View>
          {selectedCategory === 'Nutrition' ? (
            <Nutrition />
          ) : selectedCategory === 'Movement' ? (
            <>
              <View style={movementGuideStyles.sectionIntro}>
                <Text style={movementGuideStyles.sectionTitle}>
                  Hormone-Intelligent Movement
                </Text>
                <Text style={movementGuideStyles.sectionSubtitle}>
                  Align your workouts with your cycle for optimal results
                </Text>
              </View>

              <TouchableOpacity
                style={styles.logMovementButton}
                onPress={() => {
                  if (isPartnerMode) {
                    showPartnerReadOnlyAlert();
                    return;
                  }
                  setMovementModalVisible(true);
                }}
              >
                <Text style={styles.logMovementButtonText}>Log Movement</Text>
              </TouchableOpacity>
              <View style={styles.dailyLogCard}>
                <Text style={styles.dailyLogTitle}>
                  {"Today's Movement Log"}
                </Text>
                {dailyMovementLogs.length === 0 ? (
                  <Text style={styles.emptyText}>
                    No movement logged yet today.
                  </Text>
                ) : (
                  dailyMovementLogs.map(entry => (
                    <View
                      style={styles.logRow}
                      key={entry._id || entry.loggedAt}
                    >
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
                    <Image
                      source={images.energyHigh}
                      style={movementGuideStyles.icon}
                    />
                    <View>
                      <Text style={movementGuideStyles.heading}>
                        Hormone Benefit
                      </Text>
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
                      <Text style={movementGuideStyles.heading}>
                        What to Avoid
                      </Text>
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
                <Text style={movementGuideStyles.mainHeading}>
                  Movement Science
                </Text>
                {movementScienceData.map((item, index) => (
                  <View style={movementGuideStyles.cautionView} key={index}>
                    <Text style={movementGuideStyles.movementIcon}>
                      {item.image}
                    </Text>
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
          ) : selectedCategory === 'Mindful' ? (
            <Mindful />
          ) : null}
        </View>
      </ScrollView>
      <MovementLogModal
        visible={movementModalVisible}
        onClose={() => setMovementModalVisible(false)}
        onSave={async ({ workoutId, durationMinutes }) => {
          await logWorkout(workoutId, 'add', durationMinutes);
          await refetch();
        }}
      />
    </SafeAreaView>
  );
}

import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../components/GradientText';
import { gradients } from '../../constants/gradientColors';
import {
  getCurrentCycleStatus,
  CycleStatusResponse,
  getPregnancyStatus,
  PregnancyStatusResponse,
} from '../../services/api';
import moment from 'moment';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  // Get parent tab navigator for tab navigation
  const tabNavigation = (navigation as any).getParent?.() || navigation;
  const [showInsightDetails, setShowInsightDetails] = useState<Boolean>(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedSleep, setSelectedSleep] = useState<number | null>(null);
  const [cycleStatus, setCycleStatus] = useState<
    CycleStatusResponse['data'] | null
  >(null);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const emojis = ['😄', '🙂', '😐', '😞'];
  const energyEmojis = [
    images.energizedEmoji,
    images.highEmoji,
    images.mediumEmoji,
  ];

  const handleSleepTracker = () => {
    navigation.navigate('SleepTracker');
  };

  // Fetch cycle and pregnancy data
  const fetchCycleData = async () => {
    try {
      setLoading(true);

      // Check pregnancy status first
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success && pregnancyResponse.data.isPregnant) {
        setPregnancyStatus(pregnancyResponse.data);
        setCycleStatus(null);
        return;
      }

      // If not pregnant, fetch cycle status
      const response = await getCurrentCycleStatus();
      if (response.success && response.data.isTracking) {
        setCycleStatus(response.data);
      } else {
        setCycleStatus(null);
      }
      setPregnancyStatus(null);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setCycleStatus(null);
      setPregnancyStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCycleData();
    }, []),
  );

  // Helper functions
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
        return images.lutealIcon; // Default fallback
    }
  };

  const getEnergyLevelText = (energyLevel?: string | null): string => {
    if (!energyLevel) return '—';
    switch (energyLevel) {
      case 'low':
        return 'Low - Rest';
      case 'rising':
        return 'Rising - High';
      case 'high':
        return 'High - Peak';
      case 'declining':
        return 'Declining - Medium';
      default:
        return '—';
    }
  };

  const calculateProgressPercentage = (
    cycleDay?: number,
    cycleLength?: number,
  ): number => {
    if (!cycleDay || !cycleLength) return 0;
    return Math.min(100, Math.max(0, (cycleDay / cycleLength) * 100));
  };

  const todayDate = moment().format('dddd, MMMM D');

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16 }}>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#E4AF5D" />
                </View>
              ) : pregnancyStatus && pregnancyStatus.isPregnant ? (
                <>
                  {/* Pregnancy Progress Card */}
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>PREGNANCY PROGRESS</Text>
                    <View style={styles.rowFull}>
                      <View style={styles.rowBottom}>
                        <GradientText fontSize={46} fontFamily="Inter-Regular">
                          {pregnancyStatus.pregnancyWeek || '—'}
                        </GradientText>
                        <Text style={[styles.numberTextMedium, { top: 8 }]}>
                          {' '}
                          / 40
                        </Text>
                      </View>
                      <View style={styles.dayTextContainer}>
                        <Text style={styles.textBlackNormal}>
                          {pregnancyStatus.trimester === 1
                            ? 'First Trimester'
                            : pregnancyStatus.trimester === 2
                            ? 'Second Trimester'
                            : 'Third Trimester'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressIndicator}>
                      <LinearGradient
                        style={[
                          styles.progress,
                          {
                            width: `${
                              pregnancyStatus.progressPercentage || 0
                            }%`,
                          },
                        ]}
                        colors={['#E4AF5D', '#E799AD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    {pregnancyStatus.dueDate && (
                      <Text style={styles.textDarkGrey}>
                        Due date:{' '}
                        {moment(pregnancyStatus.dueDate).format('MMMM D, YYYY')}
                        {pregnancyStatus.daysUntilDueDate !== null &&
                          pregnancyStatus.daysUntilDueDate !== undefined && (
                            <Text>
                              {' '}
                              (
                              {pregnancyStatus.daysUntilDueDate > 0
                                ? `${pregnancyStatus.daysUntilDueDate} days to go`
                                : pregnancyStatus.daysUntilDueDate === 0
                                ? 'Due date is today!'
                                : `${Math.abs(
                                    pregnancyStatus.daysUntilDueDate,
                                  )} days past due date`}
                              )
                            </Text>
                          )}
                      </Text>
                    )}
                  </View>

                  {/* Baby Development Card */}
                  {pregnancyStatus.babyDevelopment && (
                    <TouchableOpacity
                      style={styles.cyclePhaseCard}
                      onPress={() => {
                        // Navigate to Cycle tab (which is now Insights)
                        // @ts-ignore - Cycle is a tab route
                        tabNavigation.jumpTo?.('Cycle') ||
                          tabNavigation.navigate?.('Cycle');
                      }}
                    >
                      <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                      <Text style={styles.babyDevelopmentText}>
                        Size of a {pregnancyStatus.babyDevelopment.size}
                      </Text>
                      <Text style={styles.textDarkGrey}>
                        {pregnancyStatus.babyDevelopment.development}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Today's Insights Card */}
                  {pregnancyStatus.trimesterInsights &&
                    pregnancyStatus.trimesterInsights.whatToExpect &&
                    pregnancyStatus.trimesterInsights.whatToExpect.length >
                      0 && (
                      <TouchableOpacity
                        style={styles.cyclePhaseCard}
                        onPress={() => {
                          // Navigate to Cycle tab (which is now Insights)
                          // @ts-ignore - Cycle is a tab route
                          tabNavigation.jumpTo?.('Cycle') ||
                            tabNavigation.navigate?.('Cycle');
                        }}
                      >
                        <Text style={styles.spacedText}>TODAY'S INSIGHT</Text>
                        <Text style={styles.textDarkGrey}>
                          {pregnancyStatus.trimesterInsights.whatToExpect[0]}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Link to Cycle History */}
                  <TouchableOpacity
                    style={styles.cyclePhaseCard}
                    onPress={() => {
                      // Navigate to Cycle tab (which is now Insights)
                      // @ts-ignore - Cycle is a tab route
                      tabNavigation.jumpTo?.('Cycle') ||
                        tabNavigation.navigate?.('Cycle');
                    }}
                  >
                    <Text style={styles.spacedText}>CYCLE HISTORY</Text>
                    <Text style={styles.textDarkGrey}>
                      View your past cycles and insights from before pregnancy.
                      Your cycle data is preserved.
                    </Text>
                    <Text
                      style={[
                        styles.textDarkGrey,
                        {
                          marginTop: 8,
                          color: '#E799AD',
                          fontFamily: 'Inter-SemiBold',
                        },
                      ]}
                    >
                      View Cycle Insights →
                    </Text>
                  </TouchableOpacity>
                </>
              ) : !cycleStatus || !cycleStatus.isTracking ? (
                <View>
                  <Text style={styles.textDarkGrey}>
                    Cycle tracking is not enabled. Please enable it in your
                    profile settings to see phase insights.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.row}>
                    <Image
                      style={styles.currentPhaseIconMain}
                      source={images.currentPhaseIconMain}
                    />
                    <Text style={styles.heading}>Current Phase</Text>
                  </View>
                  <View style={styles.phaseTextContainer}>
                    <Text style={styles.textPrimary}>
                      {getPhaseDisplayName(cycleStatus.phase)} - Day{' '}
                      {cycleStatus.cycleDay || '—'}
                    </Text>
                  </View>
                  <View style={styles.colCenter}>
                    <Text style={styles.spacedText}>TODAY</Text>
                    <Text style={styles.textBlackMedium}>{todayDate}</Text>
                  </View>
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>CYCLE PROGRESS</Text>

                    <View style={styles.rowFull}>
                      <View style={styles.rowBottom}>
                        <GradientText fontSize={46} fontFamily="Inter-Regular">
                          {cycleStatus.cycleDay || '—'}
                        </GradientText>
                        <Text style={[styles.numberTextMedium, { top: 8 }]}>
                          {' '}
                          / {cycleStatus.averageCycleLength || 28}
                        </Text>
                      </View>
                      <View style={styles.dayTextContainer}>
                        <Text style={styles.textBlackNormal}>
                          Day {cycleStatus.cycleDay || '—'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressIndicator}>
                      <LinearGradient
                        style={[
                          styles.progress,
                          {
                            width: `${calculateProgressPercentage(
                              cycleStatus.cycleDay,
                              cycleStatus.averageCycleLength || 28,
                            )}%`,
                          },
                        ]}
                        colors={['#E4AF5D', '#E799AD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      ></LinearGradient>
                    </View>
                    <View style={styles.rowFull}>
                      <View>
                        <Text style={styles.spacedText}>CURRENT PHASE</Text>
                        <GradientText
                          fontSize={24}
                          fontFamily="PlayfairDisplay-SemiBold"
                        >
                          {getPhaseDisplayName(cycleStatus.phase)}
                        </GradientText>
                      </View>
                      <Image
                        source={getPhaseIcon(cycleStatus.phase)}
                        style={styles.lutealIcon}
                      />
                    </View>

                    <Text style={styles.textDarkGrey}>
                      {cycleStatus.tagline || '—'}
                    </Text>
                  </View>

                  <View style={styles.softCopyContainer}>
                    <Text style={styles.textDarkGrey}>
                      {cycleStatus.description ||
                        'No description available for this phase.'}
                    </Text>
                  </View>
                </>
              )}

              {cycleStatus && cycleStatus.isTracking && (
                <TouchableOpacity
                  style={
                    showInsightDetails
                      ? [styles.sliderRow, { marginBottom: 15 }]
                      : styles.sliderRow
                  }
                  onPress={() => setShowInsightDetails(prev => !prev)}
                >
                  <Image
                    source={images.slideDown}
                    style={
                      showInsightDetails
                        ? styles.slideActiveIcon
                        : styles.slideIcon
                    }
                  />
                  <Text style={styles.greenText}>
                    Tap to {showInsightDetails ? 'hide' : 'see'} detailed
                    insights
                  </Text>
                </TouchableOpacity>
              )}
              {showInsightDetails && cycleStatus && cycleStatus.isTracking && (
                <>
                  <View style={styles.rowFlexBox}>
                    <View style={styles.flexBox}>
                      <Image source={images.energyHigh} style={styles.icon} />
                      <Text style={styles.greenText}>Energy Level</Text>
                      <Text style={styles.textBlackSmall}>
                        {getEnergyLevelText(cycleStatus.energyLevel)}
                      </Text>
                    </View>
                    <View style={styles.flexBox}>
                      <Image source={images.sparkle} style={styles.icon} />
                      <Text style={styles.greenText}>Best For</Text>
                      <Text style={styles.textBlackSmall}>
                        {cycleStatus.bestFor && cycleStatus.bestFor.length > 0
                          ? cycleStatus.bestFor.join(', ')
                          : '—'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.thisPhaseDataContainer}>
                    {cycleStatus.nutrition &&
                      cycleStatus.nutrition.length > 0 && (
                        <View style={styles.section}>
                          <View style={styles.row}>
                            <Image
                              source={images.nutritionIcon}
                              style={styles.icon}
                            />
                            <Text style={styles.textBlackBold}>
                              Nutrition This Phase
                            </Text>
                          </View>
                          <View>
                            {cycleStatus.nutrition.map((item, index) => (
                              <View key={index} style={styles.row}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.textBlackNormal}>
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    {cycleStatus.movement &&
                      cycleStatus.movement.length > 0 && (
                        <View style={styles.section}>
                          <View style={styles.row}>
                            <Image
                              source={images.movementIcon}
                              style={styles.icon}
                            />
                            <Text style={styles.textBlackBold}>
                              Movement This Phase
                            </Text>
                          </View>
                          <View>
                            {cycleStatus.movement.map((item, index) => (
                              <View key={index} style={styles.row}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.textBlackNormal}>
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    {cycleStatus.mindset && cycleStatus.mindset.length > 0 && (
                      <View style={styles.section}>
                        <View style={styles.row}>
                          <Image
                            source={images.mindsetIcon}
                            style={styles.icon}
                          />
                          <Text style={styles.textBlackBold}>
                            Mindset & Focus
                          </Text>
                        </View>
                        <View>
                          {cycleStatus.mindset.map((item, index) => (
                            <View key={index} style={styles.row}>
                              <View style={styles.bulletPoint}></View>
                              <Text style={styles.textBlackNormal}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>

                  {cycleStatus.understanding && (
                    <LinearGradient
                      colors={gradients.pinkish}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.pinkishGradient}
                    >
                      <View style={styles.row}>
                        <Image source={images.sparkle} style={styles.icon} />
                        <Text style={styles.textBlackBold}>
                          Understanding This Phase
                        </Text>
                      </View>
                      <Text style={styles.textBlackSmall}>
                        {cycleStatus.understanding}
                      </Text>
                    </LinearGradient>
                  )}
                </>
              )}
            </View>
          </GradientWrapper>

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Today’s Rituals</Text>
              <Text style={styles.headerProgress}>0/9 Complete</Text>
            </View>

            {/* MORNING */}
            <Text style={styles.sectionHeading}>MORNING</Text>
            <View style={styles.ritualsSection}>
              <RitualItem
                title="Log last night’s sleep"
                tag="Rest"
                description="💡 Tracking sleep patterns helps identify what supports your best rest"
                actionLabel="Log Sleep"
              />

              <RitualItem
                title="Hydrate with minerals + morning light"
                tag="Nourish"
                description="💡 Morning light sets your circadian rhythm and hormone balance"
                actionLabel="View Guide"
              />

              <RitualItem
                title="5-min breathwork practice"
                tag="Mindful"
                description="💡 Breathwork activates your parasympathetic nervous system"
                actionLabel="Practice"
              />

              <RitualItem
                title="Protein-rich breakfast (20–30g)"
                tag="Nourish"
                description="💡 Protein stabilizes blood sugar and supports hormone production"
                actionLabel="View Guide"
              />
            </View>

            <View style={styles.divider} />

            {/* MIDDAY */}
            <Text style={styles.sectionHeading}>MIDDAY</Text>
            <View style={styles.ritualsSection}>
              <RitualItem
                title="Movement session (any time)"
                tag="Move"
                description="💡 Exercise when it fits your schedule and energy levels"
              />

              <RitualItem
                title="Protein at lunch (20–30g)"
                tag="Nourish"
                description="💡 Consistent protein supports metabolic health and satiety"
                actionLabel="View Guide"
              />
            </View>

            <View style={styles.divider} />

            {/* EVENING */}
            <Text style={styles.sectionHeading}>EVENING</Text>
            <View style={styles.ritualsSection}>
              <RitualItem
                title="Gentle stretching or walk"
                tag="Move"
                description="💡 Light movement aids digestion and circulation"
              />

              <RitualItem
                title="Wind-down ritual"
                tag="Mindful"
                description="💡 Creating separation from day helps cortisol naturally decline"
                actionLabel="Practice"
              />

              <RitualItem
                title="Magnesium supplement (evening)"
                tag="Rest"
                description="💡 Evening magnesium supports deep sleep and muscle recovery"
              />
            </View>

            {/* Bottom Gradient Button */}
            <TouchableOpacity style={styles.updateButton}>
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.updateButtonGradient}
              >
                <Text style={styles.updateButtonText}>Update Rituals</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <Text style={styles.sectionTitle}>Today's Tracking</Text>
            {/* 1. FEELING */}
            <View>
              <View style={styles.row}>
                <Image source={images.movementIcon} style={styles.icon} />
                <Text style={styles.label}>How are you feeling?</Text>
              </View>

              <View style={styles.row2}>
                {['Great', 'Good', 'Okay', 'Poor'].map((mood, index) => {
                  const isSelected = selectedFeeling === index;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedFeeling(index)}
                      style={[
                        styles.optionBox,
                        isSelected && styles.selectedOptionBox,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionEmojiText,
                          isSelected && styles.selectedOptionEmojiText,
                        ]}
                      >
                        {emojis[index]}
                      </Text>

                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {mood}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 2. ENERGY LEVEL */}
            <View>
              <View style={styles.row}>
                <Image source={images.energyIcon} style={styles.icon} />
                <Text style={styles.label}>Energy Level</Text>
              </View>

              <View style={styles.row2}>
                {['High', 'Medium', 'Low'].map((level, index) => {
                  const isSelected = selectedEnergy === index;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedEnergy(index)}
                      style={[
                        styles.optionBox,
                        isSelected && styles.selectedOptionBox,
                      ]}
                    >
                      <Image
                        source={energyEmojis[index]}
                        style={styles.optionEmoji}
                      />

                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. SLEEP QUALITY */}
            <View>
              <View style={styles.row}>
                <Image source={images.sleepQualityIcon} style={styles.icon} />
                <Text style={styles.label}>How was your sleep quality?</Text>
              </View>

              <View style={styles.row2}>
                {['Great', 'Good', 'Okay', 'Poor'].map((mood, index) => {
                  const isSelected = selectedSleep === index;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedSleep(index)}
                      style={[
                        styles.optionBox,
                        isSelected && styles.selectedOptionBox,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionEmojiText,
                          isSelected && styles.selectedOptionEmojiText,
                        ]}
                      >
                        {emojis[index]}
                      </Text>

                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.selectedOptionText,
                        ]}
                      >
                        {mood}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={handleSleepTracker}
            >
              <Text style={styles.link}>View Sleep Details </Text>
              <Image source={images.arrow} style={styles.arrow} />
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <Text style={styles.sectionTitle}>Cycle Insights</Text>

            <View style={styles.insightRow}>
              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.energyHigh} style={styles.icon} />
                  <Text style={styles.insightLabel}>Cycle Length</Text>
                </View>
                <Text style={styles.insightValue}>28 days avg</Text>
                <Text style={styles.insightStatus}>Consistent</Text>
              </View>

              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.sleepQualityIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Sleep Quality</Text>
                </View>
                <Text style={styles.insightValue}>7.8 hrs</Text>
                <Text style={styles.insightStatus}>Improving</Text>
              </View>
            </View>

            <View style={styles.insightRow}>
              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.hydrationIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Hydration</Text>
                </View>
                <Text style={styles.insightValue}>85%</Text>
                <Text style={styles.insightStatus}>Great</Text>
              </View>

              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.energyIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Energy Level</Text>
                </View>
                <Text style={styles.insightValue}>High</Text>
                <Text style={styles.insightStatus}>Peak phase</Text>
              </View>
            </View>

            <View style={styles.softCopyContainer}>
              <Text style={styles.textDarkGrey}>
                💡 You've had reduced bloating for two cycles since adding daily
                sauna use
              </Text>
            </View>
          </View>
          <GradientWrapper variant="basic">
            <View style={styles.container}>
              <Text style={styles.sectionTitleGreen}>Active Challenge</Text>

              <Text style={styles.challengeTitle}>21-Day Detox Reset</Text>
              <Text style={styles.challengeDisclaimer}>
                Day 8 — You're glowing from the inside out.
              </Text>

              <TouchableOpacity style={styles.updateButton}>
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateButtonGradient}
                >
                  <Text style={styles.updateButtonText}>View Challenge</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const RitualItem = ({
  title,
  tag,
  description,
  actionLabel,
}: {
  title: string;
  tag: string;
  description: string;
  actionLabel?: string;
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <TouchableOpacity>
          <Image source={images.circleUnchecked} style={styles.checkIcon} />
        </TouchableOpacity>
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>● {tag}</Text>
          </View>
        </View>
        {/* {actionLabel && (
          <TouchableOpacity>
            <Text style={styles.actionLabel}>{actionLabel} →</Text>
          </TouchableOpacity>
        )} */}
      </View>

      <Text style={styles.itemDescription}>{description}</Text>
    </View>
  );
};

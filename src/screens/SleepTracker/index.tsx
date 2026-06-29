import React, { JSX, useState, useEffect, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import { sizes } from '../../constants/sizes';
import Modal from 'react-native-modal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors } from '../../constants/colors';
import {
  logSleep,
  getPregnancyStatus,
  Sleep,
  PregnancyStatusResponse,
} from '../../services/api';
import { useSleepData } from '../../context/SleepDataContext';
import moment from 'moment';
import BackButton from '../../components/BackButton';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SleepTracker() {
  const navigation = useNavigation<NavigationProp>();
  const { isPartnerMode } = usePartnerMode();
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [bedTime, setBedTime] = useState('');
  const [bedPeriod, setBedPeriod] = useState<'AM' | 'PM'>('PM');
  const [wakeTime, setWakeTime] = useState('');
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalSleepHours, setTotalSleepHours] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Data from shared store
  const {
    statistics: statisticsState,
    patterns: patternsState,
    logs: logsState,
    insights: insightsState,
    refreshSleepData,
  } = useSleepData();
  const statistics = statisticsState.data;
  const phasePatterns = patternsState.data || [];
  const recentLogs = logsState.data || [];
  const insights = insightsState.data || [];
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyWeek, setPregnancyWeek] = useState<number | null>(null);
  const [trimester, setTrimester] = useState<number | null>(null);

  const format12HourTime = (text: string) => {
    // Remove non-numbers except colon
    let cleaned = text.replace(/[^0-9:]/g, '');

    // If user is deleting, allow partial input
    if (cleaned.length === 0) {
      return '';
    }

    // Remove existing colons and rebuild
    const numbersOnly = cleaned.replace(/:/g, '');

    // Limit to 4 digits
    const limited = numbersOnly.slice(0, 4);

    // Auto insert colon after 2 digits
    if (limited.length > 2) {
      return limited.slice(0, 2) + ':' + limited.slice(2, 4);
    }

    // If user has typed 1-2 digits, return as is (don't pad yet)
    return limited;
  };

  // Calculate total sleep hours
  useEffect(() => {
    if (!bedTime || !wakeTime) {
      setTotalSleepHours(null);
      return;
    }

    try {
      // Handle both "HH:MM" and "HHMM" formats
      const bedParts = bedTime.includes(':')
        ? bedTime.split(':')
        : bedTime.length >= 2
        ? [bedTime.slice(0, 2), bedTime.slice(2, 4) || '0']
        : [bedTime, '0'];

      const wakeParts = wakeTime.includes(':')
        ? wakeTime.split(':')
        : wakeTime.length >= 2
        ? [wakeTime.slice(0, 2), wakeTime.slice(2, 4) || '0']
        : [wakeTime, '0'];

      const bedHour = parseInt(bedParts[0] || '0', 10);
      const bedMin = parseInt(bedParts[1] || '0', 10);
      const wakeHour = parseInt(wakeParts[0] || '0', 10);
      const wakeMin = parseInt(wakeParts[1] || '0', 10);

      // Validate hours (1-12) and minutes (0-59)
      if (
        bedHour < 1 ||
        bedHour > 12 ||
        bedMin < 0 ||
        bedMin > 59 ||
        wakeHour < 1 ||
        wakeHour > 12 ||
        wakeMin < 0 ||
        wakeMin > 59
      ) {
        setTotalSleepHours(null);
        return;
      }

      // Convert to 24-hour format
      let bed24 = bedHour;
      if (bedPeriod === 'PM' && bedHour !== 12) bed24 += 12;
      if (bedPeriod === 'AM' && bedHour === 12) bed24 = 0;

      let wake24 = wakeHour;
      if (wakePeriod === 'PM' && wakeHour !== 12) wake24 += 12;
      if (wakePeriod === 'AM' && wakeHour === 12) wake24 = 0;

      // Calculate total minutes
      const bedMinutes = bed24 * 60 + bedMin;
      let wakeMinutes = wake24 * 60 + wakeMin;

      // If wake time is before bed time, assume next day
      if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60;
      }

      const diffMinutes = wakeMinutes - bedMinutes;
      const hours = diffMinutes / 60;
      setTotalSleepHours(Math.round(hours * 10) / 10);
    } catch (error) {
      setTotalSleepHours(null);
    }
  }, [bedTime, bedPeriod, wakeTime, wakePeriod]);

  // Fetch pregnancy status on mount
  useEffect(() => {
    const fetchPregnancyStatus = async () => {
      try {
        const pregnancyRes = await getPregnancyStatus();
        if (pregnancyRes.success && pregnancyRes.data.isPregnant) {
          setIsPregnant(true);
          setPregnancyWeek(pregnancyRes.data.pregnancyWeek || null);
          setTrimester(pregnancyRes.data.trimester || null);
        } else {
          setIsPregnant(false);
          setPregnancyWeek(null);
          setTrimester(null);
        }
      } catch (error: any) {
        console.error('Error fetching pregnancy status:', error);
      }
    };

    fetchPregnancyStatus();
  }, []);

  // Background refresh on focus (only if stale) - silent, no loaders
  useFocusEffect(
    useCallback(() => {
      refreshSleepData();
    }, [refreshSleepData]),
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshSleepData({ force: true });
      // Also refresh pregnancy status
      const pregnancyRes = await getPregnancyStatus();
      if (pregnancyRes.success && pregnancyRes.data.isPregnant) {
        setIsPregnant(true);
        setPregnancyWeek(pregnancyRes.data.pregnancyWeek || null);
        setTrimester(pregnancyRes.data.trimester || null);
      } else {
        setIsPregnant(false);
        setPregnancyWeek(null);
        setTrimester(null);
      }
    } catch (error) {
      console.error('Error refreshing sleep data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshSleepData]);

  const handleOpenModal = () => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    // Reset form
    setBedTime('');
    setWakeTime('');
    setBedPeriod('PM');
    setWakePeriod('AM');
    setQuality(3);
    setNotes('');
    setSelectedDate(new Date());
    setTotalSleepHours(null);
    setIsVisible(true);
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    // Validation
    if (!bedTime || !wakeTime) {
      Alert.alert('Error', 'Please enter both bed time and wake time');
      return;
    }

    if (!totalSleepHours || totalSleepHours <= 0) {
      Alert.alert('Error', 'Wake time must be after bed time');
      return;
    }

    try {
      setSaving(true);

      // Parse bed and wake times (handle both "HH:MM" and "HHMM" formats)
      const bedParts = bedTime.includes(':')
        ? bedTime.split(':')
        : bedTime.length >= 2
        ? [bedTime.slice(0, 2), bedTime.slice(2, 4) || '0']
        : [bedTime, '0'];

      const wakeParts = wakeTime.includes(':')
        ? wakeTime.split(':')
        : wakeTime.length >= 2
        ? [wakeTime.slice(0, 2), wakeTime.slice(2, 4) || '0']
        : [wakeTime, '0'];

      const bedHour = parseInt(bedParts[0] || '0', 10);
      const bedMin = parseInt(bedParts[1] || '0', 10);
      const wakeHour = parseInt(wakeParts[0] || '0', 10);
      const wakeMin = parseInt(wakeParts[1] || '0', 10);

      // Validate
      if (
        bedHour < 1 ||
        bedHour > 12 ||
        bedMin < 0 ||
        bedMin > 59 ||
        wakeHour < 1 ||
        wakeHour > 12 ||
        wakeMin < 0 ||
        wakeMin > 59
      ) {
        Alert.alert(
          'Error',
          'Please enter valid times (hours 1-12, minutes 0-59)',
        );
        setSaving(false);
        return;
      }

      let bed24 = bedHour;
      if (bedPeriod === 'PM' && bedHour !== 12) bed24 += 12;
      if (bedPeriod === 'AM' && bedHour === 12) bed24 = 0;

      let wake24 = wakeHour;
      if (wakePeriod === 'PM' && wakeHour !== 12) wake24 += 12;
      if (wakePeriod === 'AM' && wakeHour === 12) wake24 = 0;

      // Create date objects
      const sleepDate = new Date(selectedDate);
      sleepDate.setHours(0, 0, 0, 0);

      const bedDateTime = new Date(sleepDate);
      bedDateTime.setHours(bed24, bedMin, 0, 0);

      let wakeDateTime = new Date(sleepDate);
      wakeDateTime.setHours(wake24, wakeMin, 0, 0);

      // If wake time is before bed time, it's next day
      if (wakeDateTime <= bedDateTime) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1);
      }

      const response = await logSleep({
        date: sleepDate.toISOString(),
        bedTime: bedDateTime.toISOString(),
        wakeTime: wakeDateTime.toISOString(),
        quality,
        notes: notes.trim() || undefined,
      });

      if (response.success) {
        Alert.alert('Success', 'Sleep log saved successfully');
        handleCloseModal();
        refreshSleepData({ force: true }); // Refresh data
      }
    } catch (error: any) {
      console.error('Error saving sleep log:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save sleep log. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 4) return 'Excellent';
    if (quality >= 3) return 'Good';
    if (quality >= 2) return 'Fair';
    return 'Poor';
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return '#5DBB63';
    if (quality >= 3) return '#E68C3A';
    return '#E85C5C';
  };

  const loading =
    statisticsState.loading ||
    patternsState.loading ||
    logsState.loading ||
    insightsState.loading;

  // Only show full-screen loader on true cold start (no data at all)
  const isColdStart = !statistics && !logsState.data;
  const [refreshing, setRefreshing] = useState(false);

  // Helper: do we actually have any sleep logs?
  const hasSleepStats = !!statistics && statistics.totalLogs > 0;

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      {/* <Header /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ gap: 16, marginBottom: 16 }}>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>Sleep Tracking</Text>
                <TouchableOpacity
                  style={styles.plusBtn}
                  onPress={handleOpenModal}
                >
                  <Text style={styles.textMaroon}>+</Text>
                </TouchableOpacity>
              </View>
              {isPregnant && pregnancyWeek !== null && trimester !== null ? (
                <Text style={styles.textBlackNormal}>
                  Week {pregnancyWeek} • Trimester {trimester} Sleep
                </Text>
              ) : (
                <Text style={styles.textBlackNormal}>
                  Your most important recovery tool
                </Text>
              )}
              {isColdStart && loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.green} />
                </View>
              ) : null}

              {/* Summary metrics / empty state */}
              {!isColdStart && hasSleepStats && statistics && (
                <View style={styles.rowFlexBox}>
                  <View style={styles.flexBox}>
                    <View style={styles.row}>
                      <Image source={images.clockIcon} style={styles.icon} />
                      <Text style={styles.greenText}>Avg Duration</Text>
                    </View>
                    <Text style={styles.heading}>
                      {statistics.averages.duration !== null
                        ? `${statistics.averages.duration.toFixed(1)}h`
                        : '--'}
                    </Text>
                  </View>
                  <View style={styles.flexBox}>
                    <View style={styles.row}>
                      <Image source={images.energyHigh} style={styles.icon} />
                      <Text style={styles.greenText}>Avg Quality</Text>
                    </View>
                    <Text style={styles.heading}>
                      {statistics.averages.quality !== null
                        ? `${statistics.averages.quality.toFixed(1)}/5`
                        : '--'}
                    </Text>
                  </View>
                </View>
              )}

              {!isColdStart && !hasSleepStats && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.textDarkGrey}>No sleep data yet.</Text>
                  <Text
                    style={[
                      styles.textDarkGrey,
                      { fontSize: 12, marginTop: 4 },
                    ]}
                  >
                    Log tonight&apos;s sleep to see your average duration and
                    quality.
                  </Text>
                </View>
              )}
            </View>
          </GradientWrapper>

          {/* 8+ Hour Goal */}
          <View style={styles.container2}>
            <Text style={styles.cardHeading}>8+ Hour Goal (Last 7 Days)</Text>
            {isColdStart && loading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.green} />
              </View>
            ) : null}
            {!isColdStart && hasSleepStats && statistics ? (
              <>
                <View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.textDarkGrey}>
                      {statistics.sevenDayGoal.daysWith8Plus} of 7 days
                    </Text>
                    <Text style={styles.textDarkGrey}>
                      {statistics.sevenDayGoal.percentage}%
                    </Text>
                  </View>
                  <View style={styles.phaseProgressBarBackground}>
                    <LinearGradient
                      style={[
                        styles.phaseProgress,
                        {
                          width: `${Math.max(
                            0,
                            statistics.sevenDayGoal.percentage - 2 * 10,
                          )}%`,
                        },
                      ]}
                      colors={['#E4AF5D', '#E799AD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                </View>

                <View style={styles.progressRow}>
                  {statistics.sevenDayGoal.days.map((day, i) => {
                    const hours = day.hours;
                    const isGood = hours !== null && hours >= 8;

                    return (
                      <View
                        key={i}
                        style={[
                          styles.dayBox,
                          isGood ? styles.dayBoxGood : styles.dayBoxLow,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isGood ? styles.dayTextGood : styles.dayTextLow,
                          ]}
                        >
                          {hours !== null ? `${hours}h` : ''}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              !isColdStart && (
                <Text style={styles.textDarkGrey}>
                  No sleep logs yet. Once you start logging, we&apos;ll show how
                  often you hit 8+ hours.
                </Text>
              )
            )}
          </View>

          {/* Sleep Patterns by Cycle Phase (hidden for pregnant users) */}
          {!isPregnant && (
            <View style={styles.container2}>
              <View style={styles.row}>
                <Image source={images.btCycleActive} style={styles.smallIcon} />
                <Text style={styles.cardHeading}>
                  Sleep Patterns by Cycle Phase
                </Text>
              </View>

              {isColdStart && loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.green} />
                </View>
              ) : null}
              {!isColdStart && phasePatterns.length > 0 ? (
                phasePatterns
                  .filter(p => p.avgDuration !== null)
                  .map((item, i) => {
                    const phaseNames: Record<string, string> = {
                      menstrual: 'Menstrual',
                      follicular: 'Follicular',
                      ovulatory: 'Ovulatory',
                      luteal: 'Luteal',
                    };
                    const progressWidth = item.avgDuration
                      ? Math.min(100, (item.avgDuration / 10) * 100)
                      : 0;

                    return (
                      <View key={i} style={styles.softCopyContainer}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.textDarkGrey}>
                            {phaseNames[item.phase] || item.phase}
                          </Text>
                          <Text style={styles.textDarkGrey}>
                            {item.avgDuration
                              ? `${item.avgDuration.toFixed(1)}h avg`
                              : 'Not enough data yet'}
                            {item.avgQuality
                              ? ` • Quality: ${item.avgQuality.toFixed(1)}/5`
                              : ''}
                          </Text>
                        </View>

                        <View style={styles.phaseProgressBarBackground2}>
                          <LinearGradient
                            style={[
                              styles.phaseProgress,
                              { width: `${progressWidth}%` },
                            ]}
                            colors={['#E4AF5D', '#E799AD']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          />
                        </View>
                      </View>
                    );
                  })
              ) : (
                <Text style={styles.textDarkGrey}>No phase data available</Text>
              )}
            </View>
          )}

          {/* Recent Sleep Log */}
          <View style={styles.container2}>
            <View style={styles.row}>
              <Image source={images.calenderIcon} style={styles.smallIcon} />
              <Text style={styles.cardHeading}>Recent Sleep Log</Text>
            </View>

            {isColdStart && loading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.green} />
              </View>
            ) : null}
            {!isColdStart && recentLogs.length > 0 ? (
              recentLogs.map((item, i) => {
                const bed = new Date(item.bedTime);
                const wake = new Date(item.wakeTime);
                const bedStr = moment(bed).format('HH:mm');
                const wakeStr = moment(wake).format('HH:mm');
                const dateStr = moment(item.date).format('MMM D');

                return (
                  <View key={i} style={styles.logRow}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.logDate}>{dateStr}</Text>
                        {isPregnant &&
                          item.pregnancyWeek !== null &&
                          item.trimester !== null && (
                            <Text
                              style={[
                                styles.logTime,
                                { marginTop: 2, fontSize: 11 },
                              ]}
                            >
                              Week {item.pregnancyWeek} • Trimester{' '}
                              {item.trimester}
                            </Text>
                          )}
                      </View>
                      <Text style={styles.logHours}>
                        {item.duration.toFixed(1)}h
                      </Text>
                    </View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.logTime}>
                        {bedStr} - {wakeStr}
                      </Text>
                      <View
                        style={[
                          styles.badge,
                          {
                            backgroundColor:
                              getQualityColor(item.quality) + '20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            { color: getQualityColor(item.quality) },
                          ]}
                        >
                          {getQualityLabel(item.quality)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.textDarkGrey}>No sleep logs yet</Text>
            )}
          </View>

          {/* Sleep Insights */}
          <GradientWrapper variant="primary">
            <View style={{ width: sizes.screenWidth * 0.82 }}>
              <Text style={styles.insightHeading}>Sleep Insights</Text>
              {isColdStart && loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.white} />
                </View>
              ) : null}
              {!isColdStart && insights.length > 0 ? (
                <View style={{ gap: 6 }}>
                  {insights.map((insight, i) => (
                    <View key={i} style={styles.row}>
                      <View style={styles.dot} />
                      <Text style={styles.insightText}>{insight}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.insightText}>
                  Start logging your sleep to get personalized insights!
                </Text>
              )}
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>

      <Modal
        isVisible={isVisible}
        backdropOpacity={0.45}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modalWrapper}
      >
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.row}>
              <Image source={images.btCycleActive} style={styles.smallIcon} />
              <Text style={styles.headerText}>Log Sleep</Text>
            </View>
            <TouchableOpacity onPress={handleCloseModal}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.timeLabel}>Date</Text>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.timeValue}>
                {moment(selectedDate).format('MMM D, YYYY')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <>
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={(event, date) => {
                    if (Platform.OS === 'android') {
                      setShowDatePicker(false);
                    }
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.datePickerDone}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.datePickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Bed + Wake Time */}
          <View style={styles.timeRow}>
            {/* Bed Time */}
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Bed Time</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeValue}
                  placeholder="10:30"
                  placeholderTextColor="#9C9C9C"
                  keyboardType="numeric"
                  maxLength={5}
                  value={bedTime}
                  onChangeText={t => setBedTime(format12HourTime(t))}
                />
                <TouchableOpacity
                  onPress={() => setBedPeriod(bedPeriod === 'AM' ? 'PM' : 'AM')}
                  style={styles.periodBtn}
                >
                  <Text style={styles.periodText}>{bedPeriod}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Wake Time */}
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Wake Time</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.timeValue}
                  placeholder="07:00"
                  placeholderTextColor="#9C9C9C"
                  keyboardType="numeric"
                  maxLength={5}
                  value={wakeTime}
                  onChangeText={t => setWakeTime(format12HourTime(t))}
                />
                <TouchableOpacity
                  onPress={() =>
                    setWakePeriod(wakePeriod === 'PM' ? 'AM' : 'PM')
                  }
                  style={styles.periodBtn}
                >
                  <Text style={styles.periodText}>{wakePeriod}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Total Sleep */}
          <View style={styles.totalSleepBox}>
            <Text style={styles.totalSleepLabel}>Total Sleep</Text>
            <Text style={styles.totalSleepHours}>
              {totalSleepHours !== null
                ? `${totalSleepHours.toFixed(1)} hours`
                : '-- hours'}
            </Text>
          </View>

          {/* Sleep Quality */}
          <Text style={styles.sectionLabel}>Sleep Quality</Text>
          <View style={styles.qualityRow}>
            {[1, 2, 3, 4, 5].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.qualityButton,
                  quality === num && styles.qualityButtonActive,
                ]}
                onPress={() => setQuality(num)}
              >
                <Text
                  style={[
                    styles.qualityText,
                    quality === num && styles.qualityTextActive,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.qualityLabelsRow}>
            <Text style={styles.qualitySideLabel}>Poor</Text>
            <Text style={styles.qualitySideLabel}>Excellent</Text>
          </View>

          {/* Notes */}
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did you feel?"
            placeholderTextColor={colors.green}
            multiline
            maxLength={500}
            value={notes}
            onChangeText={setNotes}
          />
          <Text style={styles.charCount}>{notes.length}/500 characters</Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCloseModal}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>Save Sleep Log</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

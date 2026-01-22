import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
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
import GradientText from '../../components/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  getPregnancyStatus,
  PregnancyStatusResponse,
} from '../../services/api';
import moment from 'moment';
import PregnancySymptomModal from '../../components/PregnancySymptomModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PregnancyDashboard() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showSymptomModal, setShowSymptomModal] = useState(false);

  const fetchPregnancyData = async () => {
    try {
      setLoading(true);
      const response = await getPregnancyStatus();
      if (response.success && response.data.isPregnant) {
        setPregnancyStatus(response.data);
      } else {
        setPregnancyStatus(null);
      }
    } catch (error: any) {
      console.error('Error fetching pregnancy data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load pregnancy data. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPregnancyData();
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!pregnancyStatus || !pregnancyStatus.isPregnant) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No pregnancy information found. Please update your profile.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    pregnancyWeek = 0,
    trimester = 1,
    dueDate,
    daysUntilDueDate,
    babyDevelopment,
    trimesterInsights,
    progressPercentage = 0,
  } = pregnancyStatus;

  const getTrimesterText = (tri: number) => {
    switch (tri) {
      case 1:
        return 'First Trimester';
      case 2:
        return 'Second Trimester';
      case 3:
        return 'Third Trimester';
      default:
        return 'Trimester';
    }
  };

  const getDaysText = (days: number | null | undefined) => {
    if (days === null || days === undefined) return '—';
    if (days > 0) return `${days} days to go`;
    if (days === 0) return 'Due date is today!';
    return `${Math.abs(days)} days past due date`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <GradientWrapper variant="basic">
          <View style={styles.phaseBody}>
            <View style={styles.row}>
              <Text style={styles.heading}>Pregnancy Progress</Text>
            </View>

            {/* Week and Trimester */}
            <View style={styles.cyclePhaseCard}>
              <Text style={styles.spacedText}>PREGNANCY WEEK</Text>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <GradientText fontSize={46} fontFamily="Inter-Regular">
                    {pregnancyWeek || '—'}
                  </GradientText>
                  <Text style={[styles.numberTextMedium, { top: 8 }]}>
                    {' '}
                    / 40
                  </Text>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>
                    {getTrimesterText(trimester)}
                  </Text>
                </View>
              </View>
              <View style={styles.progressIndicator}>
                <LinearGradient
                  style={[
                    styles.progress,
                    {
                      width: `${progressPercentage}%`,
                    },
                  ]}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              {dueDate && (
                <Text style={styles.textDarkGrey}>
                  Due date: {moment(dueDate).format('MMMM D, YYYY')} ({getDaysText(daysUntilDueDate)})
                </Text>
              )}
            </View>

            {/* Baby Development */}
            {babyDevelopment && (
              <View style={styles.cyclePhaseCard}>
                <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                <Text style={styles.babySizeText}>
                  Size of a {babyDevelopment.size}
                </Text>
                <Text style={styles.textDarkGrey}>
                  {babyDevelopment.development}
                </Text>
              </View>
            )}

            {/* Trimester Insights */}
            {trimesterInsights && (
              <>
                {/* Nutrition */}
                {trimesterInsights.nutrition && trimesterInsights.nutrition.length > 0 && (
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>NUTRITION</Text>
                    {trimesterInsights.nutrition.map((item, index) => (
                      <Text key={index} style={styles.insightItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Exercise */}
                {trimesterInsights.exercise && trimesterInsights.exercise.length > 0 && (
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>EXERCISE</Text>
                    {trimesterInsights.exercise.map((item, index) => (
                      <Text key={index} style={styles.insightItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Common Symptoms */}
                {trimesterInsights.symptoms && trimesterInsights.symptoms.length > 0 && (
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>COMMON SYMPTOMS</Text>
                    {trimesterInsights.symptoms.map((item, index) => (
                      <Text key={index} style={styles.insightItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

                {/* What to Expect */}
                {trimesterInsights.whatToExpect && trimesterInsights.whatToExpect.length > 0 && (
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>WHAT TO EXPECT</Text>
                    {trimesterInsights.whatToExpect.map((item, index) => (
                      <Text key={index} style={styles.insightItem}>
                        {item}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Warnings */}
                {trimesterInsights.warnings && trimesterInsights.warnings.length > 0 && (
                  <View style={[styles.cyclePhaseCard, styles.warningCard]}>
                    <Text style={[styles.spacedText, styles.warningTitle]}>
                      WARNINGS
                    </Text>
                    {trimesterInsights.warnings.map((item, index) => (
                      <Text key={index} style={styles.warningItem}>
                        ⚠️ {item}
                      </Text>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowSymptomModal(true)}
              >
                <Text style={styles.actionButtonText}>Log Symptom</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => navigation.navigate('PregnancyInfo')}
              >
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  Update Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => navigation.navigate('PregnancyHistory')}
              >
                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
                  View History
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </GradientWrapper>
      </ScrollView>

      <PregnancySymptomModal
        visible={showSymptomModal}
        onClose={() => setShowSymptomModal(false)}
        onSuccess={() => {
          setShowSymptomModal(false);
          fetchPregnancyData();
        }}
      />
    </SafeAreaView>
  );
}



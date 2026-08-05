import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import GradientWrapper from '../../../components/GradientWrapper';
import CycleIndicatorCard from '../../../components/CycleIndicatorCard';
import { CycleStatusResponse } from '../../../services/api';
import styles from '../style';

type Props = {
  loading: boolean;
  isPregnant: boolean;
  cycle: CycleStatusResponse['data'] | null | undefined;
  onNavigatePregnancyInfo: () => void;
};

export default function CycleInsightNotTrackingView({
  loading,
  isPregnant,
  cycle,
  onNavigatePregnancyInfo,
}: Props) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <View style={styles.topContainer}>
            <Text style={styles.heading}>Cycle Insights</Text>
            <Text style={styles.subHeading}>
              Your complete hormonal intelligence dashboard
            </Text>
          </View>
          {!isPregnant && cycle && cycle.isTracking && (
            <TouchableOpacity
              style={styles.pregnantCtaButton}
              onPress={onNavigatePregnancyInfo}
            >
              <Text style={styles.pregnantCtaText}>
                Pregnant? Switch to pregnancy support
              </Text>
            </TouchableOpacity>
          )}
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <CycleIndicatorCard
                loading={loading}
                isTracking={false}
                isPregnant={false}
                widthMultiplier={0.9}
                backgroundGradientColors={['#FBFAF8', '#DFE7F7']}
              />
              <View style={{ height: 10 }} />
              <Text style={styles.textDarkGrey}>
                Cycle tracking is not enabled. Please enable it in your profile
                settings.
              </Text>
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar, Text, View, ScrollView } from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import Header from '../../../components/Header';
import { CategoryButton } from '../../../components/CategoryButton';
import images from '../../../constants/images';
import Nutrition from '../../../components/Nutrition';
import Mindful from '../../../components/Mindful';
import CycleIndicatorCard from '../../../components/CycleIndicatorCard';
import { useCycleData } from '../../../context/CycleDataContext';
import { useWorkoutPlan } from '../../../hooks/useWorkoutPlan';
import TrackMovementSection from '../../Track/components/TrackMovementSection';

type Category = 'Nutrition' | 'Movement' | 'Mindful';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

type TrackRouteParams = {
  initialCategory?: Category;
};

export default function PartnerTrack() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { cycleStatus } = useCycleData();
  const cycle = cycleStatus.data;
  const isPregnant =
    Boolean(cycle?.isPaused) && cycle?.pauseReason === 'pregnancy';
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('Nutrition');

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);
  const { plan: workoutPlan } = useWorkoutPlan(today);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <Text style={styles.forgotText}>Track Your Day</Text>
          <Text style={styles.paraText}>
            View nutrition, movement, and mindfulness insights
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
            <TrackMovementSection
              date={today}
              dailyMovementLogs={dailyMovementLogs}
              readOnly
            />
          ) : selectedCategory === 'Mindful' ? (
            <Mindful />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

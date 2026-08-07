import { View, Text, StatusBar, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { CategoryButton } from '../../components/CategoryButton';
import TodayChallenge from '../../components/TodayChallenge';
import StackChallenge from '../../components/StackChallenge';
import PathwaysChallenge from '../../components/PathwaysChallenge';
import HabitsChallenge from '../../components/HabitsChallenge';
import { useChallengeInstance } from '../../hooks/useChallengeInstance';
import { colors } from '../../constants/colors';
import { RootStackParamList } from '../../navigation/stackNavigation';

type Category = 'Today' | 'Stack' | 'Pathways' | 'Habits';
type DetoxChallengeRoute = RouteProp<RootStackParamList, 'DetoxChallenge'>;

export default function DetoxChallenge() {
  const route = useRoute<DetoxChallengeRoute>();
  const challengeId: string | null = route.params?.challengeId ?? null;
  const initialInstanceId: string | null = route.params?.instanceId ?? null;

  const [selectedCategory, setSelectedCategory] = useState<Category>('Today');
  const { state, loading, error, startOrResume } = useChallengeInstance(
    challengeId,
    initialInstanceId,
  );

  const hasInstance = !!state.instanceId;
  const progress = state.progress;
  const features = state.challenge?.features;

  // Determine available tabs based on challenge features
  const availableTabs = useMemo(() => {
    const tabs: { label: Category; key: Category }[] = [
      { label: 'Today', key: 'Today' },
    ];

    // Stack tab - only if challenge has stackContent
    if (features?.hasStackContent) {
      tabs.push({ label: 'Stack', key: 'Stack' });
    }

    // Pathways tab - only if challenge has pathways
    if (features?.hasPathways) {
      tabs.push({ label: 'Pathways', key: 'Pathways' });
    }

    // Habits tab - always available (or make conditional if needed)
    tabs.push({ label: 'Habits', key: 'Habits' });

    return tabs;
  }, [features]);

  // Ensure selected category is valid, reset to 'Today' if current selection becomes unavailable
  useEffect(() => {
    const isSelectedTabAvailable = availableTabs.some(
      (tab) => tab.key === selectedCategory,
    );
    if (!isSelectedTabAvailable && availableTabs.length > 0) {
      setSelectedCategory('Today');
    }
  }, [availableTabs, selectedCategory]);

  const handleStart = async () => {
    if (!challengeId || hasInstance) {
      return;
    }
    await startOrResume(challengeId);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <View style={styles.mainContainer}>
        <Text style={styles.forgotText}>
          {state.challenge?.title || 'Challenge'}
        </Text>
        {state.challenge?.subtitle ? (
          <Text style={styles.paraText}>{state.challenge.subtitle}</Text>
        ) : null}
        <GradientWrapper variant="basic">
          <View style={styles.flexRowContainer}>
            <View>
              <Text style={styles.challengeText}>Challenge Progress</Text>
              <Text style={styles.daysText}>
                {progress ? `Day ${progress.currentDay}` : hasInstance ? 'Loading...' : 'Not started'}
              </Text>
            </View>
            <View>
              <Text style={styles.challengeText}>
                {progress ? `${progress.streak} day streak 🔥` : hasInstance ? 'Tracking streak...' : 'No streak yet'}
              </Text>
              <Text style={styles.completionText}>
                {progress
                  ? `${Math.round(progress.completionPercentage)}% complete`
                  : hasInstance
                  ? 'Calculating...'
                  : '0% complete'}
              </Text>
            </View>
          </View>
          <View style={styles.phaseProgressBarBackground}>
            <LinearGradient
              style={[
                styles.phaseProgress,
                {
                  width: `${
                    progress ? progress.completionPercentage : 0
                  }%`,
                },
              ]}
              colors={['#E4AF5D', '#E799AD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </GradientWrapper>

        {!hasInstance && challengeId && (
          <TouchableOpacity
            style={[styles.categoryContainer, { marginTop: 16 }]}
            onPress={handleStart}
            disabled={loading}
          >
              {loading ? (
                <ActivityIndicator color={colors.green} size={28}/>
              ) : (
                <Text style={styles.startChallengeText}>Start Challenge</Text>
              )}
          </TouchableOpacity>
        )}

        {error && (
          <Text
            style={{
              marginTop: 8,
              color: '#C62828',
              fontFamily: 'Inter-Regular',
            }}
          >
            {error}
          </Text>
        )}

        <View style={styles.categoryContainer}>
          {availableTabs.map((tab) => (
            <CategoryButton
              key={tab.key}
              label={tab.label}
              isActive={selectedCategory === tab.key}
              onPress={setSelectedCategory}
            />
          ))}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {state.instanceId && (
            <>
              {selectedCategory === 'Today' ? (
                <TodayChallenge instanceId={state.instanceId} />
              ) : selectedCategory === 'Stack' ? (
                <StackChallenge instanceId={state.instanceId} />
              ) : selectedCategory === 'Pathways' ? (
                <PathwaysChallenge instanceId={state.instanceId} />
              ) : selectedCategory === 'Habits' ? (
                <HabitsChallenge instanceId={state.instanceId} />
              ) : null}
            </>
          )}
          {!state.instanceId && !loading && (
            <Text
              style={{
                marginTop: 24,
                textAlign: 'center',
                color: colors.disabledText,
                fontFamily: 'Inter-Regular',
              }}
            >
              Start the challenge to see today&apos;s tasks, stack, pathways, and
              habits.
            </Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

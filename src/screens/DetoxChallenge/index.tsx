import { View, Text, StatusBar, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { CategoryButton } from '../../components/CategoryButton';
import TodayChallenge from '../../components/TodayChallenge';
import StackChallenge from '../../components/StackChallenge';
import PathwaysChallenge from '../../components/PathwaysChallenge';
import HabitsChallenge from '../../components/HabitsChallenge';

type Category = 'Today' | 'Stack' | 'Pathways' | 'Habits';

export default function DetoxChallenge() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Today');
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <View style={styles.mainContainer}>
        <Text style={styles.forgotText}>21-Day Detox Challenge</Text>
        <Text style={styles.paraText}>Hormone Reset & Balance</Text>
        <GradientWrapper variant="basic">
          <View style={styles.flexRowContainer}>
            <View>
              <Text style={styles.challengeText}>Challenge Progress</Text>
              <Text style={styles.daysText}>Day 8</Text>
            </View>
            <View>
              <Text style={styles.challengeText}>8 day streak 🔥</Text>
              <Text style={styles.completionText}>38% complete</Text>
            </View>
          </View>
          <View style={styles.phaseProgressBarBackground}>
            <LinearGradient
              style={[styles.phaseProgress, { width: `${70 - 2 * 10}%` }]}
              colors={['#E4AF5D', '#E799AD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </GradientWrapper>

        <View style={styles.categoryContainer}>
          <CategoryButton
            label="Today"
            isActive={selectedCategory === 'Today'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            label="Stack"
            isActive={selectedCategory === 'Stack'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            label="Pathways"
            isActive={selectedCategory === 'Pathways'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            label="Habits"
            isActive={selectedCategory === 'Habits'}
            onPress={setSelectedCategory}
          />
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {selectedCategory === 'Today' ? (
            <TodayChallenge />
          ) : selectedCategory === 'Stack' ? (
            <StackChallenge />
          ) : selectedCategory === 'Pathways' ? (
            <PathwaysChallenge />
          ) : selectedCategory === 'Habits' ? (
            <HabitsChallenge />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

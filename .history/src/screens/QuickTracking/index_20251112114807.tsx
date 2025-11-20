import React, { useState } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import styles from './style';
import { quickTrackingData } from '../../constants/content/quickTrackingData';
import OptionGroup from '../../components/OptionGroup';
import { colors } from '../../constants/colors';

export default function QuickTracking() {
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);

  const handleContinue = () => {
    console.log({ mood, energy, sleep });
    // navigate or save
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Today's Tracking</Text>
          <Text style={styles.paraText}>
            Stay on track with your habits, one check-in at a time.
          </Text>
        </View>

        {/* Mood */}
        <OptionGroup
          title={quickTrackingData.mood.heading}
          icon={quickTrackingData.mood.icon}
          options={quickTrackingData.mood.data}
          selected={mood}
          onSelect={setMood}
        />

        {/* Energy */}
        <OptionGroup
          title={quickTrackingData.energy.heading}
          icon={quickTrackingData.energy.icon}
          options={quickTrackingData.energy.data}
          selected={energy}
          onSelect={setEnergy}
        />

        {/* Sleep */}
        <OptionGroup
          title={quickTrackingData.sleep.heading}
          icon={quickTrackingData.sleep.icon}
          options={quickTrackingData.sleep.data}
          selected={sleep}
          onSelect={setSleep}
        />

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}

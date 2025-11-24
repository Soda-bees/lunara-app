import React, { useState } from 'react';
import { View, Text, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import OptionGroup from '../../components/OptionGroup';
import { colors } from '../../constants/colors';
import styles from './style';

export default function QuickTracking() {
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<string | null>(null);
  const [sleep, setSleep] = useState<string | null>(null);

  const handleContinue = () => {
    console.log({ mood, energy, sleep });
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

        <View style={styles.numberSLiderContainer}>
          <OptionGroup
            title="How are you feeling?"
            options={[
              { label: 'Great', icon: '😊' },
              { label: 'Good', icon: '🙂' },
              { label: 'Okay', icon: '😐' },
              { label: 'Low', icon: '😔' },
            ]}
            selected={mood}
            onSelect={setMood}
          />

          <OptionGroup
            title="Energy Level"
            options={[
              { label: 'Energized', icon: '⚡' },
              { label: 'High', icon: '🔋' },
              { label: 'Medium', icon: '🔋' },
              { label: 'Low', icon: '🔋' },
            ]}
            selected={energy}
            onSelect={setEnergy}
          />

          <OptionGroup
            title="Sleep Quality"
            options={[
              { label: 'Poor', icon: '😴' },
              { label: 'Fair', icon: '😐' },
              { label: 'Good', icon: '🙂' },
              { label: 'Excellent', icon: '😁' },
            ]}
            selected={sleep}
            onSelect={setSleep}
          />
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}

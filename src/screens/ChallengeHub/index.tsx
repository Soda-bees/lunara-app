import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import images from '../../constants/images';
import { useNavigation } from '@react-navigation/native';

export default function ChallengeHub() {
  const navigation = useNavigation();

  const challenges = [
    {
      id: 1,
      title: '21-Day Detox Challenge',
      subtitle: 'Hormone Reset & Balance',
      days: '21 Days',
      phases: '3 Phases',
      gradient: gradients.lightOrage,
      screen: 'DetoxChallenge',
    },
    {
      id: 2,
      title: 'Cycle Sync Reset',
      subtitle: 'Align with Your Rhythm',
      days: '28 Days',
      phases: '4 Phases',
      gradient: gradients.lightPink,
      screen: 'CycleSyncScreen',
    },
    {
      id: 3,
      title: 'Fasting & Metabolic Reset',
      subtitle: 'Optimize insulin & mitochondria',
      days: '21 Days',
      phases: '1 Phases',
      gradient: gradients.whiteBrown,
      screen: 'MetabolicResetScreen',
    },
    {
      id: 4,
      title: 'Nervous System Regulation',
      subtitle: 'Balance cortisol & emotions',
      days: '14 Days',
      phases: '1 Phases',
      gradient: gradients.lightOrage,
      screen: 'MetabolicResetScreen',
    },
    {
      id: 5,
      title: 'Sleep + Circadian Reset',
      subtitle: 'Restore your natural rhythm',
      days: '14 Days',
      phases: '1 Phases',
      gradient: gradients.lightPink,
      screen: 'CycleSyncScreen',
    },
    {
      id: 6,
      title: 'Mindful Abundance Challenge',
      subtitle: 'Reprogram for joy',
      days: '21 Days',
      phases: '1 Phases',
      gradient: gradients.whiteBrown,
      screen: 'MetabolicResetScreen',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <View style={styles.mainContainer}>
        <Text style={styles.forgotText}>Challenge Hub</Text>
        <Text style={styles.paraText}>
          Choose your path to transformation. Each challenge is{'\n'}designed to
          support your unique rhythm and goals.
        </Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {challenges.map(item => (
            <View key={item.id} style={styles.challengeMainView}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.updateButtonGradient}
              >
                <Text style={styles.challengeName}>{item.title}</Text>
                <Text style={styles.challengesubTitle}>{item.subtitle}</Text>
              </LinearGradient>

              <View style={[styles.flexRowStyle, { marginTop: 15 }]}>
                <View style={styles.flexRowStyle}>
                  <Image
                    source={images.periodCalender}
                    style={styles.calenderImageStyle}
                  />
                  <Text style={styles.daysText}>{item.days}</Text>
                </View>

                <View style={styles.flexRowStyle}>
                  <Image
                    source={images.challengesIcon}
                    style={styles.calenderImageStyle}
                  />
                  <Text style={styles.daysText}>{item.phases}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startChallenge}
                // onPress={() => navigation.navigate(item.screen as never)}
                onPress={() => {
                  if (item.screen === 'DetoxChallenge') {
                    navigation.navigate(item.screen as never);
                  } else {
                    Alert.alert(
                      'Coming Soon',
                      'This challenge is not available yet.',
                    );
                  }
                }}
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startChallengeGradient}
                >
                  <Text style={styles.startChallengeText}>Start Challenge</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

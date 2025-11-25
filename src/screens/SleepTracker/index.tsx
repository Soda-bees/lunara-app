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
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../components/GradientText';
import { gradients } from '../../constants/gradientColors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SleepTracker() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16, marginBottom: 16 }}>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>Sleep Tracking</Text>
                <TouchableOpacity style={styles.plusBtn}>
                  <Text style={styles.textMaroon}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.textBlackNormal}>
                Your most important recovery tool
              </Text>
              <View style={styles.rowFlexBox}>
                <View style={styles.flexBox}>
                  <View style={styles.row}>
                    <Image source={images.energyHigh} style={styles.icon} />
                    <Text style={styles.greenText}>Energy Level</Text>
                  </View>
                  <Text style={styles.heading}>8.2</Text>
                </View>
                <View style={styles.flexBox}>
                  <View style={styles.row}>
                    <Image source={images.energyHigh} style={styles.icon} />
                    <Text style={styles.greenText}>Best For</Text>
                  </View>
                  <Text style={styles.heading}>3.9/5</Text>
                </View>
              </View>
            </View>
          </GradientWrapper>

          <View style={styles.container2}>
            <Text style={styles.cardHeading}>8+ Hour Goal (Last 7 Days)</Text>
            <Text style={styles.cardSubText}>4 of 7 days</Text>

            <View style={styles.progressRow}>
              {[8.5, 7.5, 9.5, 8, 7.5, 9, 7.5].map((hr, i) => (
                <View key={i} style={styles.dayBox}>
                  <Text style={styles.dayText}>{hr}h</Text>
                </View>
              ))}
            </View>

            <Text style={styles.percentText}>57%</Text>
          </View>

          {/* --- SLEEP PATTERNS BY CYCLE PHASE --- */}
          <View style={styles.container2}>
            <View style={styles.row}>
              <Image source={images.moonIcon} style={styles.smallIcon} />
              <Text style={styles.cardHeading}>
                Sleep Patterns by Cycle Phase
              </Text>
            </View>

            {[
              { phase: 'Menstrual', avg: '8.5h avg', q: '4.3/5' },
              { phase: 'Follicular', avg: '8.0h avg', q: '3.5/5' },
              { phase: 'Luteal', avg: '7.5h avg', q: '3.0/5' },
            ].map((item, i) => (
              <View key={i} style={{ marginTop: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.textBlackBold}>{item.phase}</Text>
                  <Text style={styles.textBlackNormal}>
                    {item.avg} Quality: {item.q}
                  </Text>
                </View>

                <View style={styles.phaseProgressBarBackground}>
                  <LinearGradient
                    colors={['#E4AF5D', '#E799AD']}
                    style={[styles.phaseProgress, { width: `${70 - i * 10}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* --- RECENT SLEEP LOG --- */}
          <View style={styles.container2}>
            <View style={styles.row}>
              <Image source={images.calendarIcon} style={styles.smallIcon} />
              <Text style={styles.cardHeading}>Recent Sleep Log</Text>
            </View>

            {[
              { date: 'Jan 20', time: '22:30 - 07:00', hours: '8.5h' },
              { date: 'Jan 19', time: '23:00 - 06:30', hours: '7.5h' },
              { date: 'Jan 18', time: '22:00 - 07:30', hours: '9.5h' },
              { date: 'Jan 17', time: '22:45 - 06:45', hours: '8h' },
              { date: 'Jan 16', time: '23:30 - 07:00', hours: '7.5h' },
            ].map((item, i) => (
              <View key={i} style={styles.logRow}>
                <View>
                  <Text style={styles.logDate}>{item.date}</Text>
                  <Text style={styles.logTime}>{item.time}</Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logHours}>{item.hours}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Great</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* --- SLEEP INSIGHTS --- */}

          <GradientWrapper variant="primary">
            <Text style={styles.insightHeading}>Sleep Insights</Text>

            <Text style={styles.insightText}>
              • You sleep best during your Menstrual phase (avg 8.5h)
            </Text>
            <Text style={styles.insightText}>• Your sleep quality is good</Text>
            <Text style={styles.insightText}>
              • Aim for bed by 22:30 for optimal hormone production
            </Text>
          </GradientWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

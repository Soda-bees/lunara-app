import React, { JSX, useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
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
import { sizes } from '../../constants/sizes';
import Modal from 'react-native-modal';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors } from '../../constants/colors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SleepTracker() {
  const navigation = useNavigation<NavigationProp>();
  const [quality, setQuality] = useState(3);
  const [notes, setNotes] = useState('');
  const [isVisible, setIsVisible] = useState(true);
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
                    <Image source={images.clockIcon} style={styles.icon} />
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
            <View>
              <View style={styles.rowBetween}>
                <Text style={styles.textDarkGrey}>4 of 7 days</Text>
                <Text style={styles.textDarkGrey}>57%</Text>
              </View>
              <View style={styles.phaseProgressBarBackground}>
                <LinearGradient
                  style={[styles.phaseProgress, { width: `${70 - 2 * 10}%` }]}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                ></LinearGradient>
              </View>
            </View>

            <View style={styles.progressRow}>
              {[8.5, 7.5, 9.5, 8, 7.5, 9, 7.5].map((hr, i) => {
                const isGood = hr > 8; // 👈 condition

                return (
                  <View
                    key={i}
                    style={[
                      styles.dayBox,
                      isGood ? styles.dayBoxGood : styles.dayBoxLow, // 👈 conditional class
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isGood ? styles.dayTextGood : styles.dayTextLow,
                      ]}
                    >
                      {hr}h
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* --- SLEEP PATTERNS BY CYCLE PHASE --- */}
          <View style={styles.container2}>
            <View style={styles.row}>
              <Image source={images.btCycleActive} style={styles.smallIcon} />
              <Text style={styles.cardHeading}>
                Sleep Patterns by Cycle Phase
              </Text>
            </View>

            {[
              { phase: 'Menstrual', avg: '8.5h avg', q: '4.3/5' },
              { phase: 'Follicular', avg: '8.0h avg', q: '3.5/5' },
              { phase: 'Luteal', avg: '7.5h avg', q: '3.0/5' },
            ].map((item, i) => (
              <View key={i} style={styles.softCopyContainer}>
                <View style={styles.rowBetween}>
                  <Text style={styles.textDarkGrey}>{item.phase}</Text>
                  <Text style={styles.textDarkGrey}>
                    {item.avg} Quality: {item.q}
                  </Text>
                </View>

                <View style={styles.phaseProgressBarBackground2}>
                  <LinearGradient
                    style={[styles.phaseProgress, { width: `${70 - i * 10}%` }]}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  ></LinearGradient>
                </View>
              </View>
            ))}
          </View>

          {/* --- RECENT SLEEP LOG --- */}
          <View style={styles.container2}>
            <View style={styles.row}>
              <Image source={images.calenderIcon} style={styles.smallIcon} />
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
                <View style={styles.rowBetween}>
                  <Text style={styles.logDate}>{item.date}</Text>
                  <Text style={styles.logHours}>{item.hours}</Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.logTime}>{item.time}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Great</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* --- SLEEP INSIGHTS --- */}

          <GradientWrapper variant="primary">
            <View style={{ width: sizes.screenWidth * 0.82 }}>
              <Text style={styles.insightHeading}>Sleep Insights</Text>
              <View style={{ gap: 6 }}>
                <View style={styles.row}>
                  <View style={styles.dot}></View>
                  <Text style={styles.insightText}>
                    You sleep best during your Menstrual phase (avg 8.5h)
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.dot}></View>
                  <Text style={styles.insightText}>
                    Your sleep quality is good
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.dot}></View>
                  <Text style={styles.insightText}>
                    Aim for bed by 22:30 for optimal hormone production
                  </Text>
                </View>{' '}
              </View>
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

              <Text style={styles.headerText}>
                Sleep Patterns by Cycle Phase
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Bed + Wake Time */}
          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Bed Time</Text>
              <TouchableOpacity style={styles.timeInput}>
                <Text style={styles.timeValue}>10:30 PM</Text>
                <Ionicons name="time-outline" size={18} color="#CE9F57" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>Wake Time</Text>
              <TouchableOpacity style={styles.timeInput}>
                <Text style={styles.timeValue}>7:00 AM</Text>
                <Ionicons name="time-outline" size={18} color="#CE9F57" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Sleep */}
          <View style={styles.totalSleepBox}>
            <Text style={styles.totalSleepLabel}>Total Sleep</Text>
            <Text style={styles.totalSleepHours}>8.5 hours</Text>
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
            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveText}>Save Sleep Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

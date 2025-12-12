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
import { fontSize } from '../../constants/fonts';
import CycleCalendar from '../../components/CycleCalender';
import SymptomTrends from '../../components/SymptomTrends';
import { colors } from '../../constants/colors';
import PhaseGuide from '../../components/PhaseGuide';
import PeriodStartModal from '../../components/PeriodStartModal';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function CycleInsight() {
  const navigation = useNavigation<NavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [periodStart, setPeriodStart] = useState<Date | null>(null);

  const WeeklyUpdateData = [
    {
      title: 'Energy Rising',
      message:
        'Your energy levels will continue increasing through day 14. Perfect for challenging workouts and social activities.',
      image: images.phasesImage,
      color: '#FFF1DB',
      iconColor: colors.heading,
    },
    {
      title: 'Mental Clarity Peak',
      message:
        'Days 10-14 bring peak cognitive function. Schedule important meetings and creative projects.',
      image: images.mentalImage,
      color: '#E4EFFF',
      // iconColor: colors.heading,
    },
    {
      title: 'Metabolism Boost',
      message:
        'Your metabolic rate is increasing. Great time for extended fasting windows (13-15h).',
      image: images.logWaterDrop,
      color: '#FFDEE0',
      iconColor: '#D6757B',
    },
  ];

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
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <LinearGradient
                    style={[styles.phaseImageView]}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Image
                      source={images.phasesImage}
                      style={styles.pregnanyHeartImage}
                    />
                  </LinearGradient>
                  <View style={styles.phasesView}>
                    <Text style={styles.numberTextMedium}>Currently in</Text>
                    <GradientText
                      fontSize={fontSize.large}
                      fontFamily="PlayfairDisplay-SemiBold"
                    >
                      Follicular Phase
                    </GradientText>
                    <Text style={styles.numberTextMedium}>
                      Day 8 . Rising Energy
                    </Text>
                  </View>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>Day 8</Text>
                </View>
              </View>
              <Text style={styles.textDarkGrey}>
                This is your time to shine! Estrogen is rising, bringing mental
                clarity and physical energy. Perfect for starting new projects,
                intense workouts, and social engagements.
              </Text>
            </View>
          </GradientWrapper>
          <TouchableOpacity
            style={styles.logButton}
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
          >
            <Image source={images.logWaterDrop} style={styles.dropImg} />
            <Text style={styles.text}>Log Period Start</Text>
          </TouchableOpacity>

          <PeriodStartModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onSelectDate={date => {
              setPeriodStart(date);
              console.log('SELECTED:', date.toString());
            }}
          />
          <View style={styles.pregnancyView}>
            <View style={styles.heartImageView}>
              <Image
                source={images.pregnancyHeart}
                style={styles.pregnanyHeartImage}
              />
            </View>
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <View style={styles.pregnancyIcon}>
                <Text style={styles.pregnancyText}>Pregnancy Chance</Text>
                <Image
                  source={images.informationIcon}
                  style={styles.pregnanyHeartImage}
                />
              </View>
              <View style={styles.lowTextView}>
                <Text style={styles.lowText}>Low</Text>
              </View>
              <Text style={styles.textDarkGrey}>Outside fertile window</Text>
            </View>
          </View>
          <CycleCalendar periodStart={periodStart} />
          {/* <View style={styles.trackSymptomsView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={images.btTrackActive}
                style={styles.trackActiveStyle}
              />
              <View style={styles.marginLeft}>
                <Text style={styles.trackText}>Track Symtoms</Text>
                <Text style={styles.trackSubText}>
                  Day 8 • Follicular Phase
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logNowView} activeOpacity={0.5}>
              <Text style={styles.textBlackNormal}>Log Now</Text>
            </TouchableOpacity>
          </View> */}
          <SymptomTrends />
          <View style={styles.weeklyUpdateMaincontainer}>
            <View style={styles.headerRow}>
              <Image
                source={images.periodCalender}
                style={styles.calenderImage}
              />
              <Text style={styles.cycleText}>What to Expect This Week</Text>
            </View>
            <View style={styles.listWrapper}>
              {WeeklyUpdateData.map((item, index) => (
                <View key={index} style={styles.weeklyItem}>
                  <View
                    style={[styles.iconBubble, { backgroundColor: item.color }]}
                  >
                    <Image
                      source={item.image}
                      style={[
                        styles.icon,
                        item.iconColor && { tintColor: item.iconColor },
                      ]}
                    />
                  </View>
                  <View style={styles.textWrapper}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <PhaseGuide />
          <View
            style={[
              styles.weeklyUpdateMaincontainer,
              { flexDirection: 'row', padding: 15, marginVertical: 15 },
            ]}
          >
            <Image source={images.ideaBulb} style={styles.ideaImage} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.infoText}>Did You Know?</Text>
              <Text style={styles.infoSubText}>
                Your basal body temperature naturally rises by 0.5-1°F after
                ovulation due to increased progesterone. Tracking this can help
                you understand your cycle patterns and optimize fertility
                awareness.
              </Text>
              <Text style={styles.creditText}>
                "Your cycle is your fifth vital sign."{'\n'} — Dr. Jolene
                Brighten
              </Text>
            </View>
          </View>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={images.journal} style={styles.journalStyle} />
                <Text style={[styles.infoText, { marginLeft: 10 }]}>
                  Wellness Journal
                </Text>
              </View>
              <Text style={[styles.infoSubText, { marginTop: 10 }]}>
                Your story unfolds one note at a time. Reflect on your journey,
                express gratitude, and celebrate your progress.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    style={styles.bottomEntryButton}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>New Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.bottomEntryButton,
                    { marginLeft: 8, backgroundColor: colors.borderPink },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.buttonText, { color: colors.maroonText }]}
                  >
                    See History
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

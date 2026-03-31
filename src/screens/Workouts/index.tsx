import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import Header from '../../components/Header';
import MovementLogged from '../../components/MovementLogged';
import MovementMap from '../../components/MovementMap';
import { sizes } from '../../constants/sizes';
import {
  getPhaseInfo,
  getMovementScience,
  PhaseInfo,
  MovementScienceItem,
} from '../../services/api';
import BackButton from '../../components/BackButton';

export default function Workouts() {
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [movementScienceData, setMovementScienceData] = useState<
    MovementScienceItem[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];

        // Load phase info and movement science in parallel
        const [phaseRes, scienceRes] = await Promise.all([
          getPhaseInfo(today),
          getMovementScience(),
        ]);

        if (phaseRes.success && phaseRes.data) {
          setPhaseInfo(phaseRes.data);
        }

        if (scienceRes.success && scienceRes.data) {
          setMovementScienceData(scienceRes.data);
        } else {
          // Fallback science data
          setMovementScienceData([
            {
              title: 'Muscle & Insulin',
              description:
                'Muscle contraction increases insulin sensitivity—helping regulate blood sugar and hormone balance.',
              image: '💪',
            },
            {
              title: 'Walking After Meals',
              description:
                'A 10-minute walk after eating can reduce estrogen dominance and improve digestion.',
              image: '🚶‍♀️',
            },
          ]);
        }
      } catch (e: any) {
        console.error('[Workouts] Error loading data:', e);
        setError(e?.message || 'Unable to load workout information.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Fallback phase info
  const fallbackPhaseInfo: PhaseInfo = {
    phaseName: 'Your Current Phase',
    phaseTitle: 'Movement Focus',
    description:
      'Listen to your body and choose movement that feels right for you today.',
    benefit: 'Supports overall health and well-being',
    avoid: "Overexertion or ignoring your body's signals",
    phase: 'unknown',
    isPregnant: false,
    isBreastfeeding: false,
    isPostpartum: false,
  };

  const displayPhaseInfo = phaseInfo || fallbackPhaseInfo;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* <Header /> */}
      <BackButton />
      <ScrollView>
        <View style={{ marginVertical: 16 }}>
          <Text style={styles.forgotText}>Hormone-Intelligent Movement</Text>
          <Text style={styles.paraText}>
            Align your workouts with your cycle for optimal results
          </Text>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <View>
                    <Text style={styles.numberTextMedium}>
                      Your Current Phase
                    </Text>
                    <Text style={[styles.forgotText, { fontSize: 24 }]}>
                      {displayPhaseInfo.phaseName}
                    </Text>
                    <View style={styles.risingMainView}>
                      <Text
                        style={[
                          styles.numberTextMedium,
                          { color: colors.heading },
                        ]}
                      >
                        {displayPhaseInfo.phaseTitle}
                      </Text>
                    </View>
                  </View>
                </View>
                <Image
                  source={images.dumbellIcon}
                  style={styles.dumbellsIcon}
                />
              </View>
              <Text style={styles.textDarkGrey}>
                {displayPhaseInfo.description}
              </Text>
              <View style={styles.cautionView}>
                <Image source={images.energyHigh} style={styles.icon} />
                <View>
                  <Text style={styles.heading}>Hormone Benefit</Text>
                  <Text style={styles.durationText}>
                    {displayPhaseInfo.benefit}
                  </Text>
                </View>
              </View>
              <View style={styles.cautionView}>
                <Image
                  source={images.informationIcon}
                  style={[styles.icon, { tintColor: 'red' }]}
                />
                <View>
                  <Text style={styles.heading}>What to Avoid</Text>
                  <Text style={styles.durationText}>
                    {displayPhaseInfo.avoid}
                  </Text>
                </View>
              </View>
            </View>
          </GradientWrapper>
          <MovementLogged />
          <MovementMap />

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                Loading movement science...
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.movementScienceView}>
            <Text style={styles.mainHeading}>Movement Science</Text>
            {movementScienceData.map((item, index) => {
              return (
                <View style={styles.cautionView} key={index}>
                  {/* <Image source={item.image} style={styles.movementIcon} /> */}
                  <Text style={styles.movementIcon}>{item.image}</Text>
                  <View>
                    <Text
                      style={[
                        styles.heading,
                        {
                          fontFamily: 'PlayfairDisplay-Medium',
                          width: sizes.screenWidth * 0.45,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.durationText}>{item.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

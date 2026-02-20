import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientWrapper from '../GradientWrapper';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { getPersonalizedMovementContent, PersonalizedMovementContent } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workouts'>;

export default function Movement() {
  const navigation = useNavigation<NavigationProp>();
  const [content, setContent] = useState<PersonalizedMovementContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPersonalizedContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const res = await getPersonalizedMovementContent(today);
        if (res.success && res.data) {
          setContent(res.data);
        } else {
          setError('Unable to load personalized movement content.');
        }
      } catch (e: any) {
        console.error('[Movement] Error loading personalized content:', e);
        setError(e?.message || 'Unable to load movement content.');
      } finally {
        setLoading(false);
      }
    };
    loadPersonalizedContent();
  }, []);

  // Fallback content if API fails
  const fallbackContent: PersonalizedMovementContent = {
    title: 'Movement Focus',
    description: 'Listen to your body and choose movement that feels right for you today.',
    duration: '20-30 minutes',
    benefit: 'Supports overall health and well-being',
    activities: '• Walking\n• Yoga\n• Stretching\n• Any movement you enjoy',
    energyLevel: 'Moderate',
    phase: 'unknown',
    isPregnant: false,
    isBreastfeeding: false,
    isPostpartum: false,
  };

  const displayContent = content || fallbackContent;
  return (
    <View>
      <View style={{ marginVertical: 16 }}>
        <GradientWrapper variant="basic">
          <View style={styles.phaseBody}>
            <View style={styles.rowFull}>
              <View style={styles.rowBottom}>
                <View style={styles.iconCircle}>
                  <Image
                    source={images.trackMovementIcon}
                    style={styles.icon}
                  />
                </View>
                <View style={styles.phasesView}>
                  <Text style={styles.numberTextMedium}>Movement Focus</Text>
                  <Text style={styles.forgotText}>{displayContent.title}</Text>
                </View>
              </View>
              <Image source={images.dumbellIcon} style={styles.dumbellsIcon} />
            </View>
            <Text style={styles.textDarkGrey}>
              {displayContent.description}
            </Text>
            <Text style={styles.durationText}>Duration: {displayContent.duration}</Text>
            <Text style={styles.durationText}>
              Benefit: {displayContent.benefit}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.buttomMainView}
            onPress={() => navigation.navigate('Workouts')}
          >
            <Text style={styles.buttonText}>View Workouts</Text>
          </TouchableOpacity>
        </GradientWrapper>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading personalized movement content...</Text>
        </View>
      )}

      {error && !content && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.movementBottomView}>
        <Text style={styles.todayHeading}>Movement Tips for Your Phase</Text>
        <Text style={styles.durationText}>
          {displayContent.description}
        </Text>
        <View style={styles.todayInnerBox}>
          <Text style={styles.heading}>Recommended Activities:</Text>
          <Text
            style={[styles.subHeading, { color: colors.green, marginTop: 4 }]}
          >
            {displayContent.activities}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phaseBody: {
    width: sizes.screenWidth * 0.9,
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  phasesView: {
    marginLeft: 8,
  },

  numberTextMedium: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },

  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    width: '100%',
  },

  iconCircle: {
    backgroundColor: colors.borderColor,
    width: 30,
    height: 30,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 14,
    height: 14,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },

  forgotText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    textAlign: 'center',
  },

  dumbellsIcon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.1,
    height: sizes.screenHeight * 0.05,
  },

  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 10,
  },

  buttomMainView: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.04,
    backgroundColor: colors.white,
    width: sizes.screenWidth * 0.85,
    height: sizes.screenHeight * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  movementBottomView: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 15,
    borderRadius: 12,
    marginVertical: 18,
  },

  todayHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  todayInnerBox: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  subHeading: {
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginVertical: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontFamily: 'Inter-Regular',
  },
});

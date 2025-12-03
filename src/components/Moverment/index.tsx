import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import GradientWrapper from '../GradientWrapper';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Workouts'>;

export default function Movement() {
  const navigation = useNavigation<NavigationProp>();
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
                  <Text style={styles.forgotText}>Rising - Power Building</Text>
                </View>
              </View>
              <Image source={images.dumbellIcon} style={styles.dumbellsIcon} />
            </View>
            <Text style={styles.textDarkGrey}>
              Estrogen is rising, metabolism is increasing. Your body is primed
              to build strength and endurance.
            </Text>
            <Text style={styles.durationText}>Duration: 30-45 minutes</Text>
            <Text style={styles.durationText}>
              Benefit: Supports estrogen metabolism, builds lean muscle,
              enhances insulin sensitivity
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
      <View style={styles.movementBottomView}>
        <Text style={styles.todayHeading}>Movement Tips for Your Phase</Text>
        <Text style={styles.durationText}>
          During your follicular phase, you have rising energy and are building
          strength. This is the perfect time for challenging workouts.
        </Text>
        <View style={styles.todayInnerBox}>
          <Text style={styles.heading}>Recommended Activities:</Text>
          <Text
            style={[styles.subHeading, { color: colors.green, marginTop: 4 }]}
          >
            • HIIT workouts{'\n'}• Strength training{'\n'}• Dance or cardio
            classes
            {'\n'}• Try new activities
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
});

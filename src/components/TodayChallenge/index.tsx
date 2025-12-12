import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import GradientWrapper from '../GradientWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';

export default function TodayChallenge() {
  const actionData = [
    {
      image: images.nutritionApple,
      action: 'Morning: Electrolyte Restore + Detox Support 💧',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action:
        'Breakfast: B-Complex + Omega Balance + Vitamin D3+K2 + Amino Rebuild ⚡',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: 'Mid-Morning: Adaptogen-R3 🌺',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: 'Lunch: Metabolic Support + CoQ10 Energy 🔥',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action:
        'Evening: Magnesium Calm + Collagen Restore + Probiotic Balance 🌙',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: 'Liver-supportive foods (beets, greens)',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: 'Castor oil pack',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: '30-min walk',
      checked: false,
    },
    {
      image: images.nutritionApple,
      action: 'Evening journal',
      checked: false,
    },
  ];

  const [actions, setActions] = useState(
    actionData.map(item => ({ ...item, checked: false })),
  );

  const checkedCount = actions.filter(item => item.checked).length;

  const toggleCheckbox = (index: number) => {
    const updated = actions.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item,
    );
    setActions(updated);
  };
  const checkAll = () => {
    const updated = actions.map(item => ({ ...item, checked: true }));
    setActions(updated);
  };
  return (
    <View>
      <TouchableOpacity style={styles.topContainer} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={images.nutritionsIcon} style={styles.icon} />

          <View style={{ marginLeft: 13 }}>
            <Text style={styles.heading}>Your Meals are ready</Text>
            <Text style={styles.subHeading}>
              Week 2 detox-optimized nutrition plan
            </Text>
          </View>
        </View>
        <Image source={images.arrow} style={styles.aarrowIcon} />
      </TouchableOpacity>
      <GradientWrapper variant="basic">
        <View style={styles.gradientMainView}>
          <View style={styles.iconCircle}>
            <Image
              source={images.sparkle}
              style={[styles.aarrowIcon, { marginRight: 0 }]}
            />
          </View>
          <View style={{ width: '90%', marginLeft: 10 }}>
            <Text style={styles.supportText}>Support Your Liver</Text>
            <Text style={[styles.subHeading, { color: colors.disabledText }]}>
              Your liver is your detox powerhouse. Today, focus on cruciferous
              vegetables like broccoli, kale, and Brussels sprouts. These help
              metabolize excess estrogen and support hormonal balance.
            </Text>
            <View style={styles.servingTextView}>
              <Text style={styles.servingText}>
                🎯 Add 2 servings of greens to your meals today
              </Text>
            </View>
          </View>
        </View>
      </GradientWrapper>
      <View style={styles.visionBehindView}>
        <View style={styles.flexRowContainer}>
          <View>
            <Text style={styles.challengeText}>Today's Actions</Text>
            <Text style={styles.daysText}>Support Your Liver</Text>
          </View>
          <View>
            <Text style={styles.completionText}>{checkedCount}/9</Text>
            <Text style={styles.daysText}>Complete</Text>
          </View>
        </View>
        {actions.map((item, index) => {
          return (
            <View style={styles.flexRowAnotherContainer} key={index}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item.image} style={styles.appleImageStyle} />
                <Text style={styles.actionText}>{item.action}</Text>
              </View>

              <TouchableOpacity
                onPress={() => toggleCheckbox(index)}
                style={styles.checkBoxMainView}
              >
                <Image
                  source={
                    item.checked ? images.circleChecked : images.circleUnchecked
                  }
                  style={[styles.appleImageStyle, { alignSelf: 'flex-start' }]}
                />
              </TouchableOpacity>
            </View>
          );
        })}
        <TouchableOpacity style={styles.startChallenge} onPress={checkAll}>
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startChallengeGradient}
          >
            <Text style={styles.startChallengeText}>Complete All tasks</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: sizes.screenHeight * 0.09,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    paddingHorizontal: 9,
    marginTop: 20,
    marginBottom: 16,
  },

  iconCircle: {
    backgroundColor: '#F9EBD6',
    width: 30,
    height: 30,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: sizes.screenWidth * 0.06,
    height: sizes.screenWidth * 0.06,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },

  aarrowIcon: {
    width: 15,
    height: 15,
    tintColor: colors.heading,
    resizeMode: 'contain',
    marginRight: 7,
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  subHeading: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 17,
  },

  gradientMainView: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  supportText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    marginBottom: 5,
  },

  servingTextView: {
    backgroundColor: '#F0F5FD',
    borderRadius: sizes.screenWidth * 0.02,
    padding: 6,
    marginTop: 15,
  },

  servingText: {
    fontSize: 11.5,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
  },

  visionBehindView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
  },

  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  flexRowAnotherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    // backgroundColor: 'red',
    width: sizes.screenWidth * 0.78,
  },

  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginLeft: 10,
    flexShrink: 1,
    flexWrap: 'wrap',
    width: sizes.screenWidth * 0.74,
  },

  appleImageStyle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  challengeText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Regular',
  },

  daysText: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  completionText: {
    color: '#E799AD',
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Regular',
    alignSelf: 'flex-end',
  },

  startChallenge: {
    marginTop: 20,
    alignSelf: 'center',
    width: sizes.screenWidth * 0.82,
    marginBottom: 15,
  },

  startChallengeGradient: {
    paddingVertical: 10,
    borderRadius: 12,
  },

  startChallengeText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  checkBoxMainView: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    // backgroundColor: 'red',
  },
});

import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import { colors } from '../../constants/colors';
import SupplementProtocol from '../SupplementProtocol';

export default function StackChallenge() {
  const timingData = [
    {
      heading: 'Morning (Fasted):',
      description: 'Opens detox pathways when your body is naturally cleansing',
    },
    {
      heading: 'With First Meal:',
      description:
        'Fat-soluble vitamins (D3+K2, Omega-3) absorb best with food',
    },
    {
      heading: ' Mid-Morning:',
      description: 'Adaptogens support cortisol when it naturally peaks',
    },
    {
      heading: 'Midday:',
      description: 'Metabolic support aligns with your most active digestion',
    },
    {
      heading: 'Evening:',
      description:
        'Magnesium and collagen support overnight repair and relaxation',
    },
  ];
  return (
    <View>
      <View style={styles.topContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconCircle}>
            <Image source={images.flowerIcon} style={styles.icon} />
          </View>
          <View style={{ marginLeft: 3 }}>
            <Text style={styles.heading}>Lunara Core Reset Stack™</Text>
            <Text style={[styles.subHeading, { fontSize: 11 }]}>
              21-Day Detox, Metabolic, and Hormonal Harmony
            </Text>
          </View>
        </View>
        <Text style={[styles.subHeading, { marginTop: 14 }]}>
          Your liver is your detox powerhouse. Today, focus on cruciferous
          vegetables like broccoli, kale, and Brussels sprouts. These help
          metabolize excess estrogen and support hormonal balance.
        </Text>
      </View>
      <View>
        <View style={styles.movementMainView}>
          <Text style={styles.mainHeading}>⏰ Why Timing Matters</Text>
          {timingData.map((item, index) => {
            return (
              <Text style={styles.timingText} key={index}>
                {item.heading}{' '}
                <Text style={{ color: colors.green }}>{item.description}</Text>
              </Text>
            );
          })}
        </View>
        <SupplementProtocol />
        <View style={styles.visionBehindView}>
          <Text style={styles.bottomText}>
            💫 This supplement protocol is designed to support your body's
            natural detoxification and hormonal balance throughout all 21 days
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    paddingHorizontal: 9,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
  },

  icon: {
    width: sizes.screenWidth * 0.055,
    height: sizes.screenWidth * 0.055,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },

  heading: {
    color: colors.heading,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
  },

  subHeading: {
    color: colors.disabledText,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 17,
  },

  iconCircle: {
    backgroundColor: '#F9EBD6',
    width: 40,
    height: 40,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  movementMainView: {
    backgroundColor: '#ECF0F6',
    borderRadius: sizes.screenWidth * 0.05,
    padding: 15,
  },

  mainHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 8,
  },

  timingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginVertical: 5,
  },

  visionBehindView: {
    backgroundColor: '#ECF0F6',
    // padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
    height:sizes.screenHeight * 0.09,
    justifyContent:'center'
  },

  bottomText:{
    color:colors.disabledText,
    fontSize:12,
    fontFamily:'Inter-Regular',
    textAlign:'center',
  },
});

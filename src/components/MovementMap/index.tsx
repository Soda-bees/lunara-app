import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

export default function MovementMap() {
  const getPhasesData = [
    {
      phaseName: 'Menstrual',
      phaseLevel: 'Low',
      phaseTitle: 'Low - Honor Your Rest',
      phaseLogs: [
        'Gentle yoga (yin or restorative)',
        'Slow walking in nature',
        'Light stretching',
      ],
    },
    {
      phaseName: 'Follicular',
      phaseLevel: 'High',
      phaseTitle: 'Rising - Power Building',
      phaseLogs: ['Weight training', 'Running or cycling', 'Pilates reformer'],
    },
    {
      phaseName: 'Ovulatory',
      phaseLevel: 'High',
      phaseTitle: 'Peak - Maximum Performance',
      phaseLogs: [
        'High-intensity interval training (HIIT)',
        'Strength circuits',
        'Boxing or kickboxing',
      ],
    },
    {
      phaseName: 'Luteal',
      phaseLevel: 'Medium',
      phaseTitle: 'Declining - Mindful Movement',
      phaseLogs: [
        'Lower impact strength training',
        'Resistance bands',
        'Slow flow yoga',
      ],
    },
  ];

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'Low':
        return {
          color: colors.green,
          borderColor: colors.green,
          backgroundColor: '#EDF8F1',
        };

      case 'Medium':
        return {
          color: colors.maroonText,
          borderColor: colors.maroonText,
          backgroundColor: '#FFEAEF',
        };

      case 'High':
        return {
          color: colors.heading,
          borderColor: colors.heading,
          backgroundColor: colors.lightOranger,
        };

      default:
        return {
          color: colors.heading,
          borderColor: colors.heading,
          backgroundColor: '#eee',
        };
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeading}>Your Cycle Movement Map</Text>
      {getPhasesData.map((item, index) => {
        return (
          <View style={styles.phasesMainView} key={index}>
            <View style={styles.onlyFlexDirectionRow}>
              <Text style={styles.phaseTitle}>{item.phaseName}</Text>
              <Text style={[styles.low, getLevelStyle(item.phaseLevel)]}>
                {item.phaseLevel}
              </Text>
            </View>
            <Text style={styles.subTitle}>{item.phaseTitle}</Text>
            <View style={styles.tagsMainView}>
              {item.phaseLogs.map((item, index) => {
                return (
                  <Text style={styles.tags} key={index}>
                    {item}
                  </Text>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },

  mainHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  phasesMainView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 12,
  },

  onlyFlexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  phaseTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  low: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.05,
  },

  subTitle: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  tags: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.05,
    color: colors.green,
    backgroundColor: '#EDF8F1',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    marginRight: 7,
    marginBottom: 5,
  },

  tagsMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop:9
  },
});

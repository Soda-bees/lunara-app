import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';

export default function SupplementProtocol() {
  const supplementPhases = [
    {
      id: 1,
      title: 'PHASE I — CLEAN & CLEAR',
      days: 'Days 1 – 7',
      goal: 'Goal: Open detox pathways & restore hydration',

      sections: [
        {
          title: 'Morning (Fasted / Upon Waking)',
          bullets: [
            {
              title: 'Electrolyte Restore 💧',
              text: 'Rehydrate after fasting and support cellular detox',
            },
            {
              title:
                'Detox Support (NAC + Milk Thistle + Dandelion + Turmeric)',
              text: 'Opens liver pathways and supports Phase 1 & 2 detoxification',
            },
          ],
        },

        {
          title: 'First Meal',
          bullets: [
            {
              title: 'B-Complex ⚡',
              text: 'Energy production and methylation for hormone metabolism',
            },
            {
              title: 'Omega Balance 🐟',
              text: 'Anti-inflammatory support and hormone building blocks',
            },
            {
              title: 'Vitamin D3 + K2 ✴',
              text: 'Immune and hormonal health, bone support',
            },
            {
              title: 'Amino Rebuild 💪',
              text: 'Essential amino acids for tissue repair and detox pathways',
            },
          ],
        },

        {
          title: 'Evening',
          bullets: [
            {
              title: 'Magnesium Calm 🌙',
              text: 'Supports 300+ reactions, promotes deep sleep and detox',
            },
            {
              title: 'Probiotic Balance 🌿',
              text: 'Gut health for estrogen metabolism and immune function',
            },
          ],
        },

        {
          title: 'Anytime',
          bullets: [
            {
              title: 'Trace Mineral Drops 💧',
              text: 'Add to water throughout day for cellular hydration',
            },
          ],
        },
      ],
    },

    {
      id: 2,
      title: 'PHASE II — METABOLIC MOMENTUM',
      days: 'Days 8 - 14',
      goal: 'Goal: Open detox pathways & restore hydration',
      sections: [
        {
          title: 'Morning (Fasted / Upon Waking)',
          bullets: [
            {
              title: 'Electrolyte Restore 💧',
              text: 'Rehydrate after fasting and support cellular detox',
            },
            {
              title:
                'Detox Support (NAC + Milk Thistle + Dandelion + Turmeric)',
              text: 'Opens liver pathways and supports Phase 1 & 2 detoxification',
            },
          ],
        },

        {
          title: 'First Meal',
          bullets: [
            {
              title: 'B-Complex ⚡',
              text: 'Energy production and methylation for hormone metabolism',
            },
            {
              title: 'Omega Balance 🐟',
              text: 'Anti-inflammatory support and hormone building blocks',
            },
            {
              title: 'Vitamin D3 + K2 ✴',
              text: 'Immune and hormonal health, bone support',
            },
            {
              title: 'Amino Rebuild 💪',
              text: 'Essential amino acids for tissue repair and detox pathways',
            },
          ],
        },

        {
          title: 'Evening',
          bullets: [
            {
              title: 'Magnesium Calm 🌙',
              text: 'Supports 300+ reactions, promotes deep sleep and detox',
            },
            {
              title: 'Probiotic Balance 🌿',
              text: 'Gut health for estrogen metabolism and immune function',
            },
          ],
        },

        {
          title: 'Anytime',
          bullets: [
            {
              title: 'Trace Mineral Drops 💧',
              text: 'Add to water throughout day for cellular hydration',
            },
          ],
        },
      ],
    },

    {
      id: 3,
      title: 'PHASE III — REBUILD & REBALANCE',
      days: 'Days 15 – 21',
      goal: 'Goal: Open detox pathways & restore hydration',
      sections: [
        {
          title: 'Morning (Fasted / Upon Waking)',
          bullets: [
            {
              title: 'Electrolyte Restore 💧',
              text: 'Rehydrate after fasting and support cellular detox',
            },
            {
              title:
                'Detox Support (NAC + Milk Thistle + Dandelion + Turmeric)',
              text: 'Opens liver pathways and supports Phase 1 & 2 detoxification',
            },
          ],
        },

        {
          title: 'First Meal',
          bullets: [
            {
              title: 'B-Complex ⚡',
              text: 'Energy production and methylation for hormone metabolism',
            },
            {
              title: 'Omega Balance 🐟',
              text: 'Anti-inflammatory support and hormone building blocks',
            },
            {
              title: 'Vitamin D3 + K2 ✴',
              text: 'Immune and hormonal health, bone support',
            },
            {
              title: 'Amino Rebuild 💪',
              text: 'Essential amino acids for tissue repair and detox pathways',
            },
          ],
        },

        {
          title: 'Evening',
          bullets: [
            {
              title: 'Magnesium Calm 🌙',
              text: 'Supports 300+ reactions, promotes deep sleep and detox',
            },
            {
              title: 'Probiotic Balance 🌿',
              text: 'Gut health for estrogen metabolism and immune function',
            },
          ],
        },

        {
          title: 'Anytime',
          bullets: [
            {
              title: 'Trace Mineral Drops 💧',
              text: 'Add to water throughout day for cellular hydration',
            },
          ],
        },
      ],
    },
  ];

  return (
    <View>
      {supplementPhases.map((item, index) => {
        return (
          <View style={styles.visionBehindView} key={index}>
            <View style={styles.row}>
              <Image source={images.logWaterDrop} style={styles.icon} />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.days}>{item.days}</Text>
              </View>
            </View>
            <Text style={styles.goalText}>{item.goal}</Text>
            {item.sections.map((item, index) => {
              return (
                <View key={index}>
                  <Text style={styles.timeOfDay}>{item.title}</Text>
                  {item.bullets.map((item, index) => {
                    return (
                      <View
                        style={[styles.row, { marginBottom: 10 }]}
                        key={index}
                      >
                        <View style={styles.dot} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.bulletTitle}>{item.title}</Text>
                          <Text style={styles.bulletText}>{item.text}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  visionBehindView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: sizes.screenWidth * 0.08,
    height: sizes.screenWidth * 0.08,
    tintColor: '#757DD6',
    marginRight: 6,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  days: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  goalText: {
    marginTop: 10,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 18,
  },

  timeOfDay: {
    fontSize: 12,
    color: colors.heading,
    fontFamily: 'Inter-Regular',
    marginVertical: 10,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.green,
    borderRadius: 10,
    marginTop: 6,
    marginRight: 10,
  },

  bulletTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },

  bulletText: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});

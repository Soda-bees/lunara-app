import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

const PhaseGuide = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const PhaseGuideData = [
    {
      phase: 'Menstrual',
      days: 'Days 1 – 5',
      icon: images.btCycleActive,
      items: [
        {
          title: 'Energy',
          value: 'Rest & renewal',
        },
        {
          title: 'Mood',
          value: 'Introspective',
        },
      ],
      sections: [
        {
          title: 'Focus',
          text: 'Self-care and gentle movement',
        },
        {
          title: 'Nutrition Tips',
          text: 'Iron-rich foods, warming meals, anti-inflammatory omega-3s. Avoid intense fasting.',
        },
        {
          title: 'Movement',
          text: "Gentle yoga, walking, stretching. Honor your body's need for rest.",
        },
      ],
    },

    {
      phase: 'Follicular',
      days: 'Days 6 – 13',
      icon: images.energyIcon,
      items: [
        {
          title: 'Energy',
          value: 'Rest & renewal',
        },
        {
          title: 'Mood',
          value: 'Introspective',
        },
      ],
      sections: [
        {
          title: 'Focus',
          text: 'Self-care and gentle movement',
        },
        {
          title: 'Nutrition Tips',
          text: 'Iron-rich foods, warming meals, anti-inflammatory omega-3s. Avoid intense fasting.',
        },
        {
          title: 'Movement',
          text: "Gentle yoga, walking, stretching. Honor your body's need for rest.",
        },
      ],
    },

    {
      phase: 'Ovulatory',
      days: 'Days 14 – 17',
      icon: images.feelingsIcon,
      items: [
        {
          title: 'Energy',
          value: 'Rest & renewal',
        },
        {
          title: 'Mood',
          value: 'Introspective',
        },
      ],
      sections: [
        {
          title: 'Focus',
          text: 'Self-care and gentle movement',
        },
        {
          title: 'Nutrition Tips',
          text: 'Iron-rich foods, warming meals, anti-inflammatory omega-3s. Avoid intense fasting.',
        },
        {
          title: 'Movement',
          text: "Gentle yoga, walking, stretching. Honor your body's need for rest.",
        },
      ],
    },

    {
      phase: 'Luteal',
      days: 'Days 18 – 28',
      icon: images.energyHigh,
      items: [
        {
          title: 'Energy',
          value: 'Rest & renewal',
        },
        {
          title: 'Mood',
          value: 'Introspective',
        },
      ],
      sections: [
        {
          title: 'Focus',
          text: 'Self-care and gentle movement',
        },
        {
          title: 'Nutrition Tips',
          text: 'Iron-rich foods, warming meals, anti-inflammatory omega-3s. Avoid intense fasting.',
        },
        {
          title: 'Movement',
          text: "Gentle yoga, walking, stretching. Honor your body's need for rest.",
        },
      ],
    },
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Phase Guide</Text>

      {PhaseGuideData.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <View key={index}>
            <TouchableOpacity
              onPress={() => toggle(index)}
              style={styles.phaseRow}
            >
              <View style={styles.leftRow}>
                <Image source={item.icon} style={styles.icon} />
                <View>
                  <Text style={styles.phaseName}>{item.phase}</Text>
                  <Text style={styles.phaseDays}>{item.days}</Text>
                </View>
              </View>

              <Image
                source={images.rightArrow}
                style={[
                  styles.arrow,
                  { transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] },
                ]}
              />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.contentBox}>
                <View style={styles.topGrid}>
                  {item.items.map((box, i) => (
                    <View key={i} style={styles.infoCard}>
                      <Text style={styles.infoTitle}>{box.title}</Text>
                      <Text style={styles.infoValue}>{box.value}</Text>
                    </View>
                  ))}
                </View>

                {item.sections.map((sec, s) => (
                  <View key={s} style={{ marginTop: 14 }}>
                    <Text style={styles.sectionTitle}>{sec.title}</Text>
                    <Text style={styles.sectionText}>{sec.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {index < PhaseGuideData.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 18,
    marginTop: 20,
  },

  title: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    fontSize: 14,
    marginBottom: 18,
  },

  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: sizes.screenWidth * 0.045,
    height: sizes.screenWidth * 0.045,
    resizeMode: 'contain',
    marginRight: 10,
  },

  phaseName: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    fontSize: 14,
  },

  phaseDays: {
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.green,
    fontSize: 14,
  },

  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },

  contentBox: {
    paddingTop: 8,
    paddingBottom: 14,
  },

  topGrid: {
    flexDirection: 'row',
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 12,
    marginRight: 10,
    borderRadius: sizes.screenWidth * 0.03,
  },

  infoTitle: {
    fontFamily: 'Inter-Regular',
    color: colors.green,
    fontSize: 12,
  },

  infoValue: {
    fontFamily: 'Inter-Regular',
    color: colors.black,
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    fontFamily: 'Inter-Regular',
    color: colors.green,
    fontSize: 12,
  },

  sectionText: {
    fontFamily: 'Inter-Regular',
    color: colors.black,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 20,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderColor,
    marginTop: 12,
  },
});

export default PhaseGuide;

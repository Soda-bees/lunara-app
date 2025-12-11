import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import GradientWrapper from '../GradientWrapper';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

const pathwaysData = [
  {
    title: 'Liver Detox Pathways',
    image: images.pregnancyHeart,
    percentage: '58%',
    accent: '#FF3864',
    description:
      'Your liver has 2 phases of detoxification that neutralize and eliminate toxins, excess hormones, and metabolic waste.',
    whatItDoes: [
      'Phase 1: Breaks down toxins into intermediate compounds',
      'Phase 2: Converts intermediates into water-soluble forms',
      'Metabolizes excess estrogen for hormonal balance',
    ],
    howWeAddress: [
      'Castor oil packs over liver',
      'Beets for liver detox support',
      'Reduce toxic load (clean eating)',
    ],
  },
  {
    title: 'Gut Health & Elimination',
    image: images.trackMovementIcon,
    percentage: '48%',
    accent: '#5BCE8B',
    description:
      'Your gut eliminates toxins through stool. A healthy microbiome and regular bowel movements are essential for hormone balance.',
    whatItDoes: [
      'Houses 70% of your immune system',
      'Produces neurotransmitters (serotonin, GABA)',
      'Eliminates estrogen via healthy bowel movements',
    ],
    howWeAddress: [
      'Heal gut lining with bone broth',
      'Support microbiome diversity',
      'Optimize digestion',
    ],
  },
  {
    title: 'Lymphatic Drainage',
    image: images.leaf,
    percentage: '68%',
    accent: '#3B82F6',
    description:
      'Your lymphatic system moves waste and toxins out of tissues. Unlike blood, it has no pump—it relies on movement and breathing.',
    whatItDoes: [
      'Collects cellular waste and toxins',
      'Transports immune cells throughout body',
      'Removes excess fluid from tissues',
    ],
    howWeAddress: [
      'Rebounding or jumping',
      'Deep breathing exercises',
      'Lymphatic massage',
    ],
  },
];

export default function PathwaysChallenge() {
  return (
    <View>
      <View style={{ marginVertical: 16 }}>
        <GradientWrapper variant="primary">
          <View style={styles.gradientMainView}>
            <Text style={styles.gradientHeading}>Week 2: Restore</Text>
            <Text style={styles.gradientText}>
              Repair function, reduce toxic burden
            </Text>
          </View>
        </GradientWrapper>
      </View>

      <GradientWrapper variant="basic">
        <View style={styles.gradientMainView}>
          <Text style={styles.detoxHeading}>
            Understanding Your Detox Pathways
          </Text>
          <Text style={styles.detoxText}>
            True detoxification happens through three interconnected systems.
            This challenge addresses all three pathways systematically over 21
            days, building sustainable habits that support your body's natural
            cleansing processes.
          </Text>
        </View>
      </GradientWrapper>

      {pathwaysData.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <View
              style={[
                styles.mainImageView,
                { backgroundColor: `${item.accent}20` },
              ]}
            >
              <Image
                source={item.image}
                style={[
                  styles.mainImageStyle,
                  {
                    tintColor: item.accent,
                  },
                ]}
              />
            </View>
            <View
              style={{
                marginLeft: 8,
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View
                  style={[
                    styles.percentageBadge,
                    { backgroundColor: `${item.accent}20` },
                  ]}
                >
                  <Text style={styles.percentageText}>{item.percentage}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>

              <View style={styles.progressBackground}>
                <View style={styles.progressBar} />
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>
            What This Pathway Does:
          </Text>
          {item.whatItDoes.map((text, i) => (
            <View style={styles.row} key={i}>
              <Image
                source={images.circleChecked}
                style={[styles.checkBoxMainView, { tintColor: item.accent }]}
              />
              <Text key={i} style={styles.bulletText}>
                {text}
              </Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            How We’re Addressing It (Week 2):
          </Text>
          {item.howWeAddress.map((text, i) => (
            <Text key={i} style={styles.subBulletText}>
              {text}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gradientMainView: {
    alignItems: 'flex-start',
    width: sizes.screenWidth * 0.82,
  },

  gradientHeading: {
    color: colors.white,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
  },

  gradientText: {
    color: colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  detoxHeading: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
  },

  detoxText: {
    color: colors.disabledText,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    paddingHorizontal: 9,
    marginTop: 16,
    paddingVertical: 20,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: sizes.screenWidth * 0.74,
  },

  cardTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },

  percentageText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.maroonText,
  },

  cardDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 6,
    width: sizes.screenWidth * 0.75,
  },

  progressBackground: {
    height: 4,
    backgroundColor: '#EFEFEF',
    borderRadius: 4,
    marginVertical: 10,
    width: sizes.screenWidth * 0.74,
  },

  progressBar: {
    height: 4,
    width: '65%',
    borderRadius: 4,
    backgroundColor: colors.heading,
  },

  sectionTitle: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  bulletText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    color: colors.disabledText,
  },

  subBulletText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkBoxMainView: {
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
    resizeMode: 'contain',
    marginTop: 2,
    marginRight: 6,
  },

  mainImageView: {
    width: sizes.screenWidth * 0.09,
    height: sizes.screenWidth * 0.09,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainImageStyle: {
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
    resizeMode: 'contain',
  },
});

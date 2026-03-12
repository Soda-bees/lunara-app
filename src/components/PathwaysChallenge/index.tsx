import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientWrapper from '../GradientWrapper';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import { getChallengePathways } from '../../services/api';

interface PathwaysChallengeProps {
  instanceId: string;
}

export default function PathwaysChallenge({ instanceId }: PathwaysChallengeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [headerWeek, setHeaderWeek] = useState<number | null>(null);
  const [headerSubtitle, setHeaderSubtitle] = useState<string | null>(null);
  const [challengeDuration, setChallengeDuration] = useState<number | null>(null);
  const [challengeTitle, setChallengeTitle] = useState<string | null>(null);
  const [challengeDescription, setChallengeDescription] = useState<string | null>(null);
  const [pathways, setPathways] = useState<
    {
      title: string;
      image: any;
      percentage: number;
      accent: string;
      description: string;
      whatItDoes: string[];
      howWeAddress: string[];
    }[]
  >([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getChallengePathways(instanceId);
        if (!isMounted) return;
        if (res.success && res.data) {
          setHeaderWeek(res.data.currentWeek);
          setChallengeDuration(res.data.duration ?? null);
          setChallengeTitle(res.data.challengeTitle ?? null);
          setChallengeDescription(res.data.challengeDescription ?? null);
          setHeaderSubtitle(
            res.data.currentPhase?.goal ||
              res.data.currentPhase?.description ||
              null,
          );
          const mapped =
            res.data.pathways?.map(p => ({
              title: p.title,
              image:
                p.title.includes('Gut') || p.title.includes('Elimination')
                  ? images.trackMovementIcon
                  : p.title.includes('Lymph')
                  ? images.leaf
                  : images.pregnancyHeart,
              percentage: p.percentage,
              accent: p.color || '#FF3864',
              description: p.description,
              whatItDoes: p.whatItDoes,
              howWeAddress: p.howWeAddress,
            })) || [];
          setPathways(mapped);
        }
        setLoading(false);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Unable to load pathways.');
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [instanceId]);
  return (
    <View>
      <View style={{ marginVertical: 16 }}>
        <GradientWrapper variant="primary">
          <View style={styles.gradientMainView}>
            <Text style={styles.gradientHeading}>
              {headerWeek ? `Week ${headerWeek}` : 'Week 1: Restore'}
            </Text>
            <Text style={styles.gradientText}>
              {headerSubtitle || 'Detox support for your liver, gut, and lymphatic systems'}
            </Text>
          </View>
        </GradientWrapper>
      </View>

      <GradientWrapper variant="basic">
        <View style={styles.gradientMainView}>
          <Text style={styles.detoxHeading}>
            {challengeTitle
              ? `Understanding the Pathways in ${challengeTitle}`
              : 'Understanding Your Pathways'}
          </Text>
          <Text style={styles.detoxText}>
            {challengeDescription ||
              'This challenge addresses key pathways systematically, building sustainable habits that support your body\'s natural processes.'}
          </Text>
        </View>
      </GradientWrapper>

      {loading && (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.heading} />
        </View>
      )}
      {error && !loading && (
        <Text
          style={{
            marginTop: 8,
            color: '#C62828',
            fontSize: 12,
            fontFamily: 'Inter-Regular',
          }}
        >
          {error}
        </Text>
      )}

      {pathways.map((item, index) => (
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
                {/* <View
                  style={[
                    styles.percentageBadge,
                    { backgroundColor: `${item.accent}20` },
                  ]}
                >
                  <Text style={styles.percentageText}>{item.percentage}</Text>
                </View> */}
              </View>
              <Text style={styles.cardDesc}>{item.description}</Text>

              {/* <View style={styles.progressBackground}>
                <View style={styles.progressBar} />
              </View> */}
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
            {`How We’re Addressing It (Week ${headerWeek ?? 1}):`}
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

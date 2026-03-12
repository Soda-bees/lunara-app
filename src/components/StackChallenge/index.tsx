import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import { colors } from '../../constants/colors';
import SupplementProtocol from '../SupplementProtocol';
import { getChallengeStackContent, ChallengeStackPhase } from '../../services/api';

interface StackChallengeProps {
  instanceId: string;
}

export default function StackChallenge({ instanceId }: StackChallengeProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<{
    stackTitle: string | null;
    currentPhaseName: string | null;
    description: string | null;
    timingInfo: { heading: string; description: string }[];
    duration: number | null;
    phases: ChallengeStackPhase[];
  }>({
    stackTitle: null,
    currentPhaseName: null,
    description: null,
    timingInfo: [],
    duration: null,
    phases: [],
  });

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getChallengeStackContent(instanceId);
        if (!isMounted) return;
        if (res.success && res.data?.stackContent) {
          setContent({
            stackTitle: res.data.stackContent.title || null,
            currentPhaseName: res.data.currentPhase?.name || null,
            description: res.data.stackContent.description || null,
            timingInfo: res.data.stackContent.timingInfo || [],
            duration: res.data.duration ?? null,
            phases: res.data.stackContent.phases || [],
          });
        }
        setLoading(false);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Unable to load stack content.');
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
      <View style={styles.topContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconCircle}>
            <Image source={images.flowerIcon} style={styles.icon} />
          </View>
          <View style={{ marginLeft: 3 }}>
            <Text style={styles.heading}>
              {content.stackTitle || 'Challenge Supplement Stack'}
            </Text>
            <Text style={[styles.subHeading, { fontSize: 11 }]}>
              {content.currentPhaseName
                ? `${content.currentPhaseName} phase protocol`
                : 'Supplement protocol for this challenge'}
            </Text>
          </View>
        </View>
        <Text style={[styles.subHeading, { marginTop: 14 }]}>
          {content.description ||
            'This stack is designed to support your body in a phased, sustainable way throughout this challenge.'}
        </Text>
      </View>
      <View>
        <View style={styles.movementMainView}>
          <Text style={styles.mainHeading}>⏰ Why Timing Matters</Text>
          {loading && (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
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
          {!loading &&
            content.timingInfo.map((item, index) => (
              <Text style={styles.timingText} key={index}>
                {item.heading}{' '}
                <Text style={{ color: colors.green }}>{item.description}</Text>
              </Text>
            ))}
        </View>
        <SupplementProtocol phases={content.phases} />
        <View style={styles.visionBehindView}>
          <Text style={styles.bottomText}>
            💫{' '}
            {content.stackTitle
              ? `${content.stackTitle} is designed to support your body`
              : 'This supplement protocol is designed to support your body'}
            {content.duration
              ? ` throughout all ${content.duration} days`
              : ' throughout your challenge journey'}
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

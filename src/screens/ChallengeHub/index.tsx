import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import images from '../../constants/images/challenges';
import { useNavigation } from '@react-navigation/native';
import { getChallengesWithStatus } from '../../hooks/useChallengeInstance';
import { colors } from '../../constants/colors';

export default function ChallengeHub() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChallengesWithStatus();
        if (isMounted) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            days: `${item.duration} Days`,
            phases: `${item.phases?.length || 0} Phases`,
            gradient: item.gradientColors?.length
              ? item.gradientColors
              : gradients.lightOrage,
            userInstance: item.userInstance,
          }));
          setChallenges(mapped);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || 'Unable to load challenges.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartOrContinue = (item: any) => {
    if (item.userInstance?.id) {
      // Continue existing instance
      // @ts-ignore
      navigation.navigate('DetoxChallenge' as never, {
        challengeId: item.id,
        instanceId: item.userInstance.id,
      } as never);
    } else {
      // Start new challenge; detail screen will trigger start
      // @ts-ignore
      navigation.navigate('DetoxChallenge' as never, {
        challengeId: item.id,
      } as never);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <View style={styles.mainContainer}>
        <Text style={styles.forgotText}>Challenge Hub</Text>
        <Text style={styles.paraText}>
          Choose your path to transformation. Each challenge is{'\n'}designed to
          support your unique rhythm and goals.
        </Text>
        {loading && (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.heading} />
            <Text
              style={{
                marginTop: 8,
                color: colors.darkGrey,
                fontFamily: 'Inter-Regular',
              }}
            >
              Loading challenges...
            </Text>
          </View>
        )}
        {error && !loading && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <Text
              style={{
                color: '#C62828',
                textAlign: 'center',
                fontFamily: 'Inter-Regular',
              }}
            >
              {error}
            </Text>
          </View>
        )}
        {!loading && !error && challenges.length === 0 && (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.disabledText,
                fontFamily: 'Inter-Regular',
                fontSize: 14,
              }}
            >
              Challenges are coming soon.{'\n'}
              Check back while we prepare your protocols.
            </Text>
          </View>
        )}
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {challenges.map(item => (
            <View key={item.id} style={styles.challengeMainView}>
              <LinearGradient
                colors={item.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.updateButtonGradient}
              >
                <Text style={styles.challengeName}>{item.title}</Text>
                <Text style={styles.challengesubTitle}>{item.subtitle}</Text>
              </LinearGradient>

              <View style={[styles.flexRowStyle, { marginTop: 15 }]}>
                <View style={styles.flexRowStyle}>
                  <Image
                    source={images.periodCalender}
                    style={styles.calenderImageStyle}
                  />
                  <Text style={styles.daysText}>{item.days}</Text>
                </View>

                <View style={styles.flexRowStyle}>
                  <Image
                    source={images.challengesIcon}
                    style={styles.calenderImageStyle}
                  />
                  <Text style={styles.daysText}>{item.phases}</Text>
                </View>
              </View>

              {item.userInstance && (
                <View
                  style={[
                    styles.flexRowStyle,
                    { marginTop: 8, justifyContent: 'space-between' , paddingHorizontal: 10},
                  ]}
                >
                  <Text style={styles.daysText}>Day {item.userInstance.currentDay}
                  </Text>
                  <Text style={styles.daysText}>
                    {Math.round(item.userInstance.progress)}% complete ·{' '}
                    {item.userInstance.streak} day streak
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.startChallenge}
                onPress={() => handleStartOrContinue(item)}
              >
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startChallengeGradient}
                >
                  <Text style={styles.startChallengeText}>
                    {item.userInstance ? 'Continue Challenge' : 'Start Challenge'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

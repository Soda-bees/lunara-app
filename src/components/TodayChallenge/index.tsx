import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images/challenges';
import GradientWrapper from '../GradientWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import { useChallengeToday } from '../../hooks/useChallengeToday';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface TodayChallengeProps {
  instanceId: string;
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Nutrition' | 'Movements'>;

export default function TodayChallenge({ instanceId }: TodayChallengeProps) {
  const navigation = useNavigation<Nav>();
  const { day, loading, error, toggleTask } = useChallengeToday(instanceId);

  const checkedCount = day?.progress.completed ?? 0;
  const totalCount = day?.progress.total ?? 0;

  const handleCompleteAll = async () => {
    if (!day || loading) return;
    const incomplete = day.tasks.filter(t => !t.completed);
    for (const task of incomplete) {
      // eslint-disable-next-line no-await-in-loop
      await toggleTask(task._id);
    }
  };

  const goToNutrition = () => {
    navigation.navigate('Nutrition');
  };

  const goToMovements = () => {
    navigation.navigate('Movements');
  };

  return (
    <View style={{ paddingTop: 20 }}>
      {/* <TouchableOpacity style={styles.topContainer} activeOpacity={0.7}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={images.nutritionsIcon} style={styles.icon} />

          <View style={{ marginLeft: 13 }}>
            <Text style={styles.heading}>
              {day?.mealPlanLink ? 'Your meals are ready' : 'Today’s focus'}
            </Text>
            {day?.mealPlanLink && (
              <Text style={styles.subHeading}>
                Tap to view your nutrition plan for today
              </Text>
            )}
          </View>
        </View>
        {day?.mealPlanLink && (
          <TouchableOpacity onPress={goToNutrition}>
            <Image source={images.arrow} style={styles.aarrowIcon} />
          </TouchableOpacity>
        )}
      </TouchableOpacity> */}
      <GradientWrapper variant="basic">
        <View style={styles.gradientMainView}>
          <View style={styles.iconCircle}>
            <Image
              source={images.sparkle}
              style={[styles.aarrowIcon, { marginRight: 0 }]}
            />
          </View>
          <View style={{ width: '90%', marginLeft: 10 }}>
            <Text style={styles.supportText}>
              {day?.focusTitle || 'Today’s Focus'}
            </Text>
            <Text style={[styles.subHeading, { color: colors.disabledText }]}>
              {day?.focusDescription ||
                'Daily education and action steps will appear here once the challenge is started.'}
            </Text>
            <View style={styles.servingTextView}>
              <Text style={styles.servingText}>
                {day?.focusAction ||
                  '🎯 Complete the actions below to stay on track today'}
              </Text>
            </View>
          </View>
        </View>
      </GradientWrapper>
      <View style={styles.visionBehindView}>
        <View style={styles.flexRowContainer}>
          <View>
            <Text style={styles.challengeText}>Today's Actions</Text>
            {day?.focusTitle ? (
              <Text style={styles.daysText}>{day.focusTitle}</Text>
            ) : null}
          </View>
          <View>
            <Text style={styles.completionText}>
              {checkedCount}/{totalCount}
            </Text>
            <Text style={styles.daysText}>Complete</Text>
          </View>
        </View>
        {loading && (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.heading} />
            <Text
              style={{
                marginTop: 8,
                fontSize: 12,
                fontFamily: 'Inter-Regular',
                color: colors.disabledText,
              }}
            >
              Loading today&apos;s actions...
            </Text>
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
          day?.tasks.map(task => {
            return (
              <View style={styles.flexRowAnotherContainer} key={task._id}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={images.nutritionApple}
                    style={styles.appleImageStyle}
                  />
                  <Text style={styles.actionText}>{task.title}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => toggleTask(task._id)}
                  style={styles.checkBoxMainView}
                >
                  <Image
                    source={
                      task.completed
                        ? images.circleChecked
                        : images.circleUnchecked
                    }
                    style={[styles.appleImageStyle, { alignSelf: 'flex-start' }]}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        {day && totalCount > 0 && (
          <TouchableOpacity
            style={styles.startChallenge}
            onPress={handleCompleteAll}
            disabled={loading}
          >
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startChallengeGradient}
            >
              <Text style={styles.startChallengeText}>Complete All tasks</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
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
    maxWidth: sizes.screenWidth * 0.6,
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

import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import { getChallengeHabits, ChallengePhaseHabits } from '../../services/api';

type PathwayType = 'Lymphatic' | 'Liver' | 'Gut';

interface HabitsChallengeProps {
  instanceId: string;
}

export default function HabitsChallenge({ instanceId }: HabitsChallengeProps) {
  const pathwayColors: Record<PathwayType, string> = {
    Lymphatic: '#6CA8F8',
    Liver: '#E98A9E',
    Gut: '#69C78A',
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [phases, setPhases] = useState<ChallengePhaseHabits[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getChallengeHabits(instanceId);
        if (!isMounted) return;
        if (res.success && res.data) {
          setPhases(res.data.phases || []);
          setCurrentDay(res.data.currentDay || 1);
        }
        setLoading(false);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Unable to load habits.');
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
      <View style={styles.mainContainer}>
        <Text style={styles.cardTitle}>Phased Habit Integration</Text>
        <Text style={styles.cardDesc}>
          Master each habit before unlocking the next. Consistency creates
          lasting change.
        </Text>

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

        {phases.map((phase, pIndex) => {
          const isUnlocked = phase.unlocked;
          const lockedTasks = phase.tasks.filter(t => !isUnlocked);
          const unlockedTasks = phase.tasks.filter(t => isUnlocked);

          return (
            <View key={pIndex}>
              <View style={styles.phaseHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{phase.name}</Text>
                  {phase.goal && (
                    <Text style={styles.phaseGoal}>{phase.goal}</Text>
                  )}
                </View>

                {phase.mastered && (
                  <View style={styles.starTextMainView}>
                    <Image
                      source={images.starIcon}
                      style={styles.starIconStyle}
                    />
                    <Text style={styles.starIconText}>Mastered</Text>
                  </View>
                )}
                {!isUnlocked && (
                  <View style={styles.lockedBadge}>
                    <Text style={styles.lockedBadgeText}>
                      Unlocks Day {phase.startDay}
                    </Text>
                  </View>
                )}
              </View>

              {isUnlocked ? (
                unlockedTasks.map((task, tIndex) => {
                  const isCompleted = task.completedDays >= task.totalDays && task.totalDays > 0;
                  const pathway = task.pathway as PathwayType | null;

                  return (
                    <View key={tIndex} style={styles.habitMainView}>
                      <Image
                        source={isCompleted ? images.starIcon : images.checkBox}
                        style={styles.habitIcon}
                      />

                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.titleText,
                              {
                                color: isCompleted ? colors.heading : colors.black,
                              },
                            ]}
                          >
                            {task.title}
                          </Text>

                          {pathway && (
                            <View
                              style={[
                                styles.pathwayTag,
                                {
                                  backgroundColor: `${pathwayColors[pathway]}20`,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.pathwayTagText,
                                  {
                                    color: pathwayColors[pathway],
                                  },
                                ]}
                              >
                                {pathway}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.progressRow}>
                          <View style={styles.progressBackground}>
                            <View
                              style={[
                                styles.progressBar,
                                {
                                  width: `${
                                    task.totalDays > 0
                                      ? (task.completedDays / task.totalDays) * 100
                                      : 0
                                  }%`,
                                },
                              ]}
                            />
                          </View>

                          <Text style={styles.progressText}>
                            {task.completedDays}/{task.totalDays} days
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.lockedPhaseCard}>
                  <Image source={images.lockedIcon} style={styles.lockIcon} />
                  <Text style={styles.lockedPhaseText}>
                    This phase unlocks on Day {phase.startDay}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    paddingHorizontal: 12,
    marginTop: 16,
    paddingVertical: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 6,
    width: sizes.screenWidth * 0.75,
  },

  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    justifyContent: 'space-between',
  },
  phaseGoal: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
    marginTop: 4,
  },
  lockedBadge: {
    backgroundColor: '#EDF3F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  lockedBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#9FB7A7',
  },
  lockedPhaseCard: {
    backgroundColor: '#EDF3F2',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0EAE3',
  },
  lockedPhaseText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#A9C2BE',
    marginLeft: 10,
  },
  starTextMainView: {
    backgroundColor: colors.lightOranger,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  starIconStyle: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
  },
  starIconText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.heading,
    marginLeft: 5,
  },

  habitMainView: {
    width: '100%',
    backgroundColor: '#EEEEEE40',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    padding: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  habitIcon: {
    width: sizes.screenWidth * 0.06,
    height: sizes.screenWidth * 0.06,
    resizeMode: 'contain',
    marginTop: 4,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  titleText: {
    fontSize: 13,
    flex: 1,
    fontFamily: 'Inter-Medium',
    paddingRight: 10,
  },

  pathwayTag: {
    paddingHorizontal: 10,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pathwayTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBackground: {
    height: 5,
    flex: 1,
    backgroundColor: '#E6E6E6',
    borderRadius: 10,
  },
  progressBar: {
    height: 5,
    backgroundColor: colors.heading,
    borderRadius: 10,
  },
  progressText: {
    marginLeft: 10,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
  },

  lockIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#9FB7A7',
  },
});

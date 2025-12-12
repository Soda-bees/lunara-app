import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

type PathwayType = 'Lymphatic' | 'Liver' | 'Gut';

export default function HabitsChallenge() {
  const pathwayColors: Record<PathwayType, string> = {
    Lymphatic: '#6CA8F8',
    Liver: '#E98A9E',
    Gut: '#69C78A',
  };

  const habitsData = [
    {
      week: 1,
      mastered: true,
      habits: [
        {
          title: '80oz water daily',
          pathway: 'Lymphatic',
          completed: 5,
          target: 5,
        },
        {
          title: 'Morning dry brushing',
          pathway: 'Lymphatic',
          completed: 5,
          target: 5,
        },
        {
          title: 'Daily greens (cruciferous vegetables)',
          pathway: 'Liver',
          completed: 4,
          target: 5,
        },
      ],
    },
    {
      week: 2,
      mastered: false,
      habits: [
        {
          title: 'NAC + Glutathione supplementation',
          pathway: 'Liver',
          completed: 4,
          target: 5,
        },
        {
          title: 'Daily probiotic-rich foods',
          pathway: 'Gut',
          completed: 3,
          target: 5,
        },
        {
          title: 'Daily movement (walk, yoga, rebounding)',
          pathway: 'Lymphatic',
          completed: 5,
          target: 5,
        },
      ],
    },
  ];

  const lockedData = [
    {
      title: 'Weekly castor oil pack',
      unlockText:
        'Unlocks after completing "NAC + Glutathione supplementation" (4/5 days)',
      week: 3,
    },
    {
      title: 'Weekly castor oil pack',
      unlockText:
        'Unlocks after completing "NAC + Glutathione supplementation" (4/5 days)',
      week: 3,
    },
    {
      title: 'Weekly castor oil pack',
      unlockText:
        'Unlocks after completing "NAC + Glutathione supplementation" (4/5 days)',
      week: 3,
    },
    {
      title: 'Weekly castor oil pack',
      unlockText:
        'Unlocks after completing "NAC + Glutathione supplementation" (4/5 days)',
      week: 3,
    },
  ];

  return (
    <View>
      <View style={styles.mainContainer}>
        <Text style={styles.cardTitle}>Phased Habit Integration</Text>
        <Text style={styles.cardDesc}>
          Master each habit before unlocking the next. Consistency creates
          lasting change.
        </Text>

        {habitsData.map((weekItem, wIndex) => (
          <View key={wIndex}>
            <View style={styles.weekHeader}>
              <Text style={styles.cardTitle}>Week {weekItem.week}</Text>

              {weekItem.mastered && (
                <View style={styles.starTextMainView}>
                  <Image
                    source={images.starIcon}
                    style={styles.starIconStyle}
                  />
                  <Text style={styles.starIconText}>Mastered</Text>
                </View>
              )}
            </View>

            {weekItem.habits.map((habit, hIndex) => {
              const isCompleted = habit.completed >= habit.target;

              return (
                <View key={hIndex} style={styles.habitMainView}>
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
                        {habit.title}
                      </Text>

                      <View
                        style={[
                          styles.pathwayTag,
                          {
                            backgroundColor: `${
                              pathwayColors[habit.pathway as PathwayType]
                            }20`,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pathwayTagText,
                            {
                              color:
                                pathwayColors[habit.pathway as PathwayType],
                            },
                          ]}
                        >
                          {habit.pathway}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.progressRow}>
                      <View style={styles.progressBackground}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              width: `${
                                (habit.completed / habit.target) * 100
                              }%`,
                            },
                          ]}
                        />
                      </View>

                      <Text style={styles.progressText}>
                        {habit.completed}/{habit.target} days
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Locked Habits</Text>

          <View style={styles.countBubble}>
            <Text style={styles.countText}>5</Text>
          </View>
        </View>
        {lockedData.map((item, index) => (
          <View key={index} style={styles.lockedCard}>
            <Image source={images.lockedIcon} style={styles.lockIcon} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.lockedTitleText}>{item.title}</Text>

              <Text style={styles.unlockText}>{item.unlockText}</Text>
            </View>

            <View style={styles.weekTag}>
              <Text style={styles.weekTagText}>Week {item.week}</Text>
            </View>
          </View>
        ))}
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

  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
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

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Medium',
    color: '#0E0E0E',
  },
  countBubble: {
    backgroundColor: '#E8F1EB',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: 10,
  },
  countText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4E6F54',
  },

  lockedCard: {
    backgroundColor: '#EDF3F2',
    borderRadius: 14,
    padding: 8,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0EAE3',
  },

  lockIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: '#9FB7A7',
    marginTop: 4,
  },

  lockedTitleText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#A9C2BE',
  },

  unlockText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#B5D3CE',
    marginTop: 3,
    // lineHeight: 18,
  },

  weekTag: {
    backgroundColor: '#DFE9E3',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'center',
  },
  weekTagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#C6CAC8',
  },
});

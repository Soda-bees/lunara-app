// import { Image, StyleSheet, Text, View } from 'react-native';
// import React from 'react';
// import { colors } from '../../constants/colors';
// import { sizes } from '../../constants/sizes';
// import images from '../../constants/images';

// export default function HabitsChallenge() {
//   return (
//     <View>
//       <View style={styles.mainContainer}>
//         <Text style={styles.cardTitle}>Phased Habit Integration</Text>
//         <Text style={styles.cardDesc}>
//           Master each habit before unlocking the next. Consistency creates
//           lasting change.
//         </Text>
//         <View style={styles.weekStarTextTopView}>
//           <Text style={styles.cardTitle}>Week 1</Text>
//           <View style={styles.starTextMainView}>
//             <Image source={images.starIcon} style={styles.starIconStyle} />
//             <Text style={styles.starIconText}>Mastered</Text>
//           </View>
//         </View>
//         <View style={styles.habitMainView}></View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     backgroundColor: colors.white,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#f2f2f2',
//     paddingHorizontal: 9,
//     marginTop: 16,
//     paddingVertical: 20,
//   },

//   cardTitle: {
//     fontSize: 16,
//     fontFamily: 'PlayfairDisplay-Medium',
//     color: colors.black,
//   },

//   cardDesc: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: colors.green,
//     marginTop: 6,
//     width: sizes.screenWidth * 0.75,
//   },

//   starIconStyle: {
//     resizeMode: 'contain',
//     width: sizes.screenWidth * 0.04,
//     height: sizes.screenWidth * 0.04,
//   },

//   starIconText: {
//     color: colors.heading,
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     marginLeft: 5,
//   },

//   starTextMainView: {
//     backgroundColor: colors.lightOranger,
//     alignItems: 'center',
//     flexDirection: 'row',
//     padding: 4,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginLeft: 10,
//   },

//   weekStarTextTopView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },

//   habitMainView: {
//     backgroundColor: '#EEEEEE50',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#f2f2f2',
//     paddingHorizontal: 9,
//     marginTop: 16,
//     paddingVertical: 20,
//   },
// });

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
          completed: 7,
          target: 5,
        },
        {
          title: 'Morning dry brushing',
          pathway: 'Lymphatic',
          completed: 6,
          target: 5,
        },
        {
          title: 'Daily greens (cruciferous vegetables)',
          pathway: 'Liver',
          completed: 8,
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

  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.mainContainer}>
        <Text style={styles.cardTitle}>Phased Habit Integration</Text>
        <Text style={styles.cardDesc}>
          Master each habit before unlocking the next. Consistency creates
          lasting change.
        </Text>

        {habitsData.map((weekItem, weekIndex) => (
          <View key={weekIndex} style={{ marginTop: 20 }}>
            <View style={styles.weekStarTextTopView}>
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

            {weekItem.habits.map((habit, habitIndex) => {
              const progress = habit.completed / habit.target;
              const color =
                pathwayColors[habit.pathway as PathwayType] || colors.green;

              return (
                <View key={habitIndex} style={styles.habitBox}>
                  <View style={styles.habitHeader}>
                    <Image
                      source={images.starIcon}
                      style={styles.starIconSecondStyle}
                    />

                    <View>
                      <View style={styles.habitHeader}>
                        <Text style={styles.habitTitle}>{habit.title}</Text>
                        <View
                          style={[
                            styles.pathwayTag,
                            { backgroundColor: `${color}20` },
                          ]}
                        >
                          <Text style={[styles.pathwayText, { color }]}>
                            {habit.pathway}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.progressBackground}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${progress * 100}%` },
                          ]}
                        />
                        <View>
                          <Text style={styles.progressText}>
                            {habit.completed}/{habit.target} days
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
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
    paddingVertical: 20,
  },

  cardTitle: {
    fontSize: 16,
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

  weekStarTextTopView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starTextMainView: {
    backgroundColor: colors.lightOranger,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },

  starIconStyle: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  starIconSecondStyle: {
    width: sizes.screenWidth * 0.06,
    height: sizes.screenWidth * 0.06,
    resizeMode: 'contain',
  },

  starIconText: {
    color: colors.heading,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 5,
  },

  habitBox: {
    backgroundColor: '#EEEEEE40',
    borderRadius: 14,
    // padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  habitTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.heading,
  },

  pathwayTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  pathwayText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
  },

  progressBackground: {
    height: 4,
    backgroundColor: '#DADADA',
    borderRadius: 6,
    marginTop: 10,
    width: sizes.screenWidth * 0.5,
  },

  progressFill: {
    height: 4,
    borderRadius: 6,
    backgroundColor: colors.heading,
  },

  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
    marginTop: 6,
  },
});

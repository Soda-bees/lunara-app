import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

export default function Nutrition() {
  const [expandedDay, setExpandedDay] = useState<string>('Wednesday');
  const [completedMeals, setCompletedMeals] = useState<
    Record<string, Record<number, boolean>>
  >({});

  const weeklyData = [
    {
      day: 'Wednesday',
      date: '2025-10-29',
      isToday: true,
      meals: [
        {
          time: '9:00 Am',
          title: 'Protein smoothie with MCT oil and collagen',
          desc: 'Break your fast mindfully',
          protein: 25,
          carbs: 35,
          fat: 20,
        },
        {
          time: '11:30 Am',
          title: 'Hard-boiled eggs with sea salt',
          desc: 'Optional balanced snack',
          protein: 8,
          carbs: 5,
          fat: 12,
        },
        {
          time: '1:00 Pm',
          title: 'Grass-fed beef with rainbow salad',
          desc: 'Sustain your energy',
          protein: 30,
          carbs: 40,
          fat: 15,
        },
        {
          time: '6:00 Pm',
          title: 'Turkey burgers with sweet potato fries',
          desc: 'Nourish and restore (last meal before fast)',
          protein: 28,
          carbs: 30,
          fat: 18,
        },
      ],
    },
    {
      day: 'Thursday',
      date: '2025-10-30',
      meals: [
        {
          time: '9:00 Am',
          title: 'Protein smoothie with MCT oil and collagen',
          desc: 'Break your fast mindfully',
          protein: 25,
          carbs: 35,
          fat: 20,
        },
        {
          time: '11:30 Am',
          title: 'Hard-boiled eggs with sea salt',
          desc: 'Optional balanced snack',
          protein: 8,
          carbs: 5,
          fat: 12,
        },
        {
          time: '1:00 Pm',
          title: 'Grass-fed beef with rainbow salad',
          desc: 'Sustain your energy',
          protein: 30,
          carbs: 40,
          fat: 15,
        },
        {
          time: '6:00 Pm',
          title: 'Turkey burgers with sweet potato fries',
          desc: 'Nourish and restore (last meal before fast)',
          protein: 28,
          carbs: 30,
          fat: 18,
        },
      ],
    },
    {
      day: 'Friday',
      date: '2025-10-31',
      meals: [
        {
          time: '9:00 Am',
          title: 'Protein smoothie with MCT oil and collagen',
          desc: 'Break your fast mindfully',
          protein: 25,
          carbs: 35,
          fat: 20,
        },
        {
          time: '11:30 Am',
          title: 'Hard-boiled eggs with sea salt',
          desc: 'Optional balanced snack',
          protein: 8,
          carbs: 5,
          fat: 12,
        },
        {
          time: '1:00 Pm',
          title: 'Grass-fed beef with rainbow salad',
          desc: 'Sustain your energy',
          protein: 30,
          carbs: 40,
          fat: 15,
        },
        {
          time: '6:00 Pm',
          title: 'Turkey burgers with sweet potato fries',
          desc: 'Nourish and restore (last meal before fast)',
          protein: 28,
          carbs: 30,
          fat: 18,
        },
        {
          time: '6:00 Pm',
          title: 'Turkey burgers with sweet potato fries',
          desc: 'Nourish and restore (last meal before fast)',
          protein: 28,
          carbs: 30,
          fat: 18,
        },
      ],
    },
    { day: 'Saturday', date: '2025-11-1', meals: [] },
    { day: 'Sunday', date: '2025-11-07', meals: [] },
  ];

  const toggleMealCheck = (dayName: any, mealIndex: any) => {
    setCompletedMeals(prev => {
      const dayMeals = prev[dayName] || {};

      const updatedDay = {
        ...dayMeals,
        [mealIndex]: !dayMeals[mealIndex],
      };

      return {
        ...prev,
        [dayName]: updatedDay,
      };
    });
  };

  return (
    <View>
      <View style={styles.topContainer}>
        <View style={styles.iconCircle}>
          <Image source={images.mindfulIcon} style={styles.icon} />
        </View>

        <View style={{ marginLeft: 7 }}>
          <Text style={styles.heading}>Synced to 21-Day Detox Challenge</Text>
          <Text style={styles.subHeading}>
            Your meals are optimized for Day 8 • Week 2
          </Text>
        </View>
      </View>

      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <Image source={images.nutritionApple} style={styles.appleIcon} />
          <Text style={styles.todayHeading}>Today’s Nutrition</Text>
        </View>

        <View style={styles.todayInnerBox}>
          <Text style={styles.heading}>Follicular Phase Focus</Text>
          <Text
            style={[styles.subHeading, { color: colors.green, marginTop: 4 }]}
          >
            Higher protein, leafy greens, fermented foods. Supporting estrogen
            rise naturally.
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle]}>Weekly Meal Plan</Text>

      {weeklyData.map(day => (
        <View
          key={day.day}
          style={
            expandedDay === day.day
              ? [styles.dayContainer, { borderColor: colors.heading }]
              : styles.dayContainer
          }
        >
          <TouchableOpacity
            onPress={() =>
              setExpandedDay(day.day === expandedDay ? '' : day.day)
            }
            style={styles.dayHeader}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View>
                <Text style={styles.dayTitle}>{day.day}</Text>
                <Text style={styles.dateTitle}>{day.date}</Text>
              </View>
              {day.isToday && (
                <View style={styles.todayTag}>
                  <Text style={styles.todayTagText}>Today</Text>
                </View>
              )}
            </View>

            <Text style={styles.dayCount}>
              {
                Object.values(completedMeals[day.day] || {}).filter(Boolean)
                  .length
              }
              / {day.meals.length}
            </Text>
          </TouchableOpacity>

          {expandedDay === day.day && day.meals.length > 0 && (
            <View>
              {day.meals.map((meal, i) => (
                <View key={i} style={styles.mealCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.row}>
                      <TouchableOpacity
                        style={styles.dotTextMainView}
                        onPress={() => toggleMealCheck(day.day, i)}
                      >
                        <Image
                          source={
                            completedMeals[day.day]?.[i]
                              ? images.orangeCheckBoxOn
                              : images.orangeCheckBoxOff
                          }
                          style={styles.dot}
                        />
                        <Text style={styles.mealTime}>{meal.time}</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.swapMainView}>
                      <Image source={images.swapIcon} style={styles.swapIcon}/>
                      <Text style={styles.swapText}>Swap</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.mealTitle}>{meal.title}</Text>
                  <Text style={styles.mealDesc}>{meal.desc}</Text>

                  <Text style={styles.macroText}>
                    P: {meal.protein}g&nbsp;&nbsp;C:{meal.carbs}g&nbsp;&nbsp;F:{' '}
                    {meal.fat}g
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    flexDirection: 'row',
    height: sizes.screenHeight * 0.09,
    alignItems: 'center',
    paddingLeft: 7,
    marginTop: 20,
  },

  iconCircle: {
    backgroundColor: '#F9EBD6',
    width: 30,
    height: 30,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 14,
    height: 14,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },
  appleIcon: {
    width: 22,
    height: 22,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  subHeading: {
    color: colors.disabledText,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  todayContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 15,
    borderRadius: 12,
    marginVertical: 18,
  },

  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  todayHeading: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  todayInnerBox: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 10,
  },

  dayContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginTop: 12,
    overflow: 'hidden',
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },

  dayTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    flex: 1,
  },

  dateTitle: {
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.green,
    flex: 1,
  },

  todayTag: {
    backgroundColor: colors.heading,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },

  todayTagText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
  },

  dayCount: {
    color: colors.black,
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 3,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: colors.borderColor,
  },

  mealCard: {
    padding: 15,
    borderWidth: 1,
    marginVertical: 7,
    width: sizes.screenWidth * 0.85,
    alignSelf: 'center',
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.04,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 12,
    height: 12,
    marginRight: 6,
    resizeMode: 'contain',
  },

  dotTextMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mealTime: {
    color: colors.heading,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  swapMainView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between', 
    width:sizes.screenWidth * 0.14,
  },

  swapIcon:{
    resizeMode:'contain',
    width:sizes.screenWidth * 0.035,
    height:sizes.screenWidth * 0.035
  },

  swapText: {
    fontSize: 13,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  mealTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginTop: 5,
    width: sizes.screenWidth * 0.6,
  },

  mealDesc: {
    fontSize: 12,
    color: colors.green,
    marginTop: 3,
    fontFamily: 'Inter-Regular',
  },

  macroText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 6,
  },
});

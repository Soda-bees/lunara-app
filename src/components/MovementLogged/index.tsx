import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

type WorkoutItem = {
  id: number;
  title: string;
  icon?: any;
};

export default function MovementLogged() {
  const [selected, setSelected] = useState<number[]>([]);

  const WORKOUTS: WorkoutItem[] = [
    { id: 1, title: 'Weight training' },
    { id: 2, title: 'Running or cycling' },
    { id: 3, title: 'Pilates reformer' },
    { id: 4, title: 'Barre or dance cardio' },
    { id: 5, title: 'Rock climbing' },
  ];

  const toggleWorkout = (id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.movementMainView}>
          <Image
            source={images.feelingsIcon}
            style={styles.feelingsIconStyle}
          />
          <Text style={styles.mainHeading}>Today's Movement</Text>
        </View>

        <View style={styles.loggedBadge}>
          <Text style={styles.loggedBadgeText}>{selected.length} Logged</Text>
        </View>
      </View>

      {WORKOUTS.map(item => {
        const isChecked = selected.includes(item.id);

        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.workoutItem,
              isChecked && styles.workoutItemSelected,
            ]}
            onPress={() => toggleWorkout(item.id)}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={styles.onlyFlexDirectionRow}>
                <View style={styles.checkbox}>
                  {isChecked && (
                    <Image
                      source={images.orangeCheckBoxOn}
                      style={styles.checkIcon}
                    />
                  )}
                </View>

                <Text style={styles.workoutText}>{item.title}</Text>
              </View>
              {isChecked && (
                <Image
                  source={images.circleChecked}
                  style={[styles.checkIcon, { tintColor: colors.heading }]}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {selected.length > 0 && (
        <View style={styles.loggedMessageBox}>
          <View style={styles.onlyFlexDirectionRow}>
            <Image
              source={images.circleChecked}
              style={[styles.checkIcon, { tintColor: colors.heading }]}
            />
            <View style={{ marginLeft: 7 }}>
              <Text style={styles.loggedMessage}>Movement logged ✓</Text>
              <Text style={styles.loggedSubMessage}>
                Every movement counts. You're honoring your body's rhythm
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.suggestedDurationBox}>
        <Text style={styles.durationLabel}>Suggested Duration:</Text>
        <Text style={styles.durationTime}>30–45 minutes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mainHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  loggedBadge: {
    backgroundColor: colors.borderPink,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },

  loggedBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.maroonText,
  },

  workoutItem: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 12,
  },

  workoutItemSelected: {
    backgroundColor: '#EEEEEE',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.heading,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  workoutText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  loggedMessageBox: {
    padding: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    marginTop: 16,
  },

  loggedMessage: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  loggedSubMessage: {
    fontSize: 12,
    color: colors.green,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },

  suggestedDurationBox: {
    marginTop: 16,
    backgroundColor: '#F4F4F4',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  durationLabel: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  durationTime: {
    fontSize: 12,
    color: colors.green,
    marginLeft: 5,
    fontFamily: 'Inter-Regular',
  },

  movementMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  feelingsIconStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
    marginRight: 5,
  },

  onlyFlexDirectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

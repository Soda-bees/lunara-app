import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import images from '../../constants/images/track';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { getDailyWorkoutPlan, logWorkoutApi, WorkoutOption } from '../../services/api';

export default function MovementLogged() {
  const [workouts, setWorkouts] = useState<WorkoutOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadWorkouts = useCallback(async (skipLoadingState: boolean = false) => {
      try {
        if (!skipLoadingState) {
          setLoading(true);
        }
        setError(null);
        const today = new Date().toISOString().split('T')[0];
        const res = await getDailyWorkoutPlan(today);
        if (res.success && res.data.workouts) {
          setWorkouts(res.data.workouts);
          
          // Load logged workouts from plan
          if (res.data.loggedWorkouts && res.data.loggedWorkouts.length > 0) {
            const loggedIds = res.data.loggedWorkouts.map(lw => {
              // Handle both populated (object) and non-populated (string) workout IDs
              if (typeof lw.workoutId === 'object' && lw.workoutId && '_id' in lw.workoutId) {
                return String(lw.workoutId._id);
              }
              return String(lw.workoutId || '');
            }).filter(id => id && id !== '');
            setSelected(loggedIds);
          } else {
            // Fallback: Check legacy selectedOptionIndex for migration
            if (res.data.selectedOptionIndex !== undefined && res.data.selectedOptionIndex >= 0 && res.data.workouts[res.data.selectedOptionIndex]) {
              const workout = res.data.workouts[res.data.selectedOptionIndex];
              const workoutId = typeof workout.workout === 'object' && workout.workout && '_id' in workout.workout
                ? String(workout.workout._id)
                : String(workout.workout || '');
              if (workoutId && workoutId !== '') {
                setSelected([workoutId]);
              }
            } else {
              setSelected([]);
            }
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Unable to load workouts.');
        console.error('[MovementLogged] Error loading workouts:', e);
      } finally {
        if (!skipLoadingState) {
          setLoading(false);
        }
        setRefreshing(false);
      }
    }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWorkouts(true);
  }, [loadWorkouts]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const toggleWorkout = async (workoutId: string) => {
    const isSelected = selected.includes(workoutId);
    const action = isSelected ? 'remove' : 'add';
    
    // Optimistic update
    if (isSelected) {
      setSelected(prev => prev.filter(x => x !== workoutId));
    } else {
      setSelected(prev => [...prev, workoutId]);
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const res = await logWorkoutApi(today, workoutId, action);
      
      if (res.success && res.data.loggedWorkouts) {
        // Update state based on API response
        const loggedIds = res.data.loggedWorkouts.map(lw => {
          if (typeof lw.workoutId === 'object' && lw.workoutId && '_id' in lw.workoutId) {
            return String(lw.workoutId._id);
          }
          return String(lw.workoutId || '');
        }).filter(id => id && id !== '');
        setSelected(loggedIds);
      }
    } catch (e: any) {
      console.error('[MovementLogged] Error logging workout:', e);
      setError(e?.message || 'Unable to log workout.');
      // Revert optimistic update on error
      if (isSelected) {
        setSelected(prev => [...prev, workoutId]);
      } else {
        setSelected(prev => prev.filter(x => x !== workoutId));
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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

      {loading && workouts.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.heading} />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {workouts.map((item, index) => {
        // Handle both populated (object) and non-populated (string) workout IDs
        const workoutId = typeof item.workout === 'object' && item.workout && '_id' in item.workout
          ? String(item.workout._id)
          : String(item.workout || `workout-${index}`);
        const isChecked = selected.includes(workoutId);

        return (
          <TouchableOpacity
            key={workoutId}
            style={[
              styles.workoutItem,
              isChecked && styles.workoutItemSelected,
            ]}
            onPress={() => toggleWorkout(workoutId)}
            activeOpacity={0.8}
            disabled={loading}
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

      {workouts.length > 0 && (
        <View style={styles.suggestedDurationBox}>
          <Text style={styles.durationLabel}>Suggested Duration:</Text>
          <Text style={styles.durationTime}>
            {workouts[0]?.duration || 30} minutes
          </Text>
        </View>
      )}
      </View>
    </ScrollView>
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontFamily: 'Inter-Regular',
  },
});

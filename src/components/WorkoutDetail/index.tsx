import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { getWorkoutDetail, Workout } from '../../services/api';
import { getUserFriendlyError } from '../../utils/errorMessages';

interface WorkoutDetailProps {
  workoutId: string;
  visible: boolean;
  onClose: () => void;
}

export default function WorkoutDetail({ workoutId, visible, onClose }: WorkoutDetailProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && workoutId) {
      loadWorkoutDetail();
    }
  }, [visible, workoutId]);

  const loadWorkoutDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWorkoutDetail(workoutId);
      if (res.success && res.data) {
        setWorkout(res.data);
      } else {
        setError('Unable to load workout details.');
      }
    } catch (e: any) {
      setError(getUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity: string) => {
    const colors: { [key: string]: string } = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
    };
    return colors[intensity] || colors.low;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Workout Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.heading} />
                <Text style={styles.loadingText}>Loading workout details...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {workout && !loading && (
              <>
                <View style={styles.section}>
                  <Text style={styles.title}>{workout.title}</Text>
                  <Text style={styles.description}>{workout.description}</Text>
                </View>

                <View style={styles.section}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Duration</Text>
                      <Text style={styles.infoValue}>{workout.duration} min</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Intensity</Text>
                      <View
                        style={[
                          styles.intensityBadge,
                          { backgroundColor: getIntensityColor(workout.intensity) },
                        ]}
                      >
                        <Text style={styles.intensityText}>
                          {workout.intensity.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.infoItem}>
                      <Text style={styles.infoLabel}>Type</Text>
                      <Text style={styles.infoValue}>{workout.type}</Text>
                    </View>
                  </View>
                </View>

                {workout.benefits && workout.benefits.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Benefits</Text>
                    {workout.benefits.map((benefit, index) => (
                      <View key={index} style={styles.benefitItem}>
                        <Text style={styles.benefitBullet}>•</Text>
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {workout.instructions && workout.instructions.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {workout.instructions.map((instruction, index) => (
                      <View key={index} style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                          <Text style={styles.instructionNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.instructionText}>{instruction}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {workout.equipment && workout.equipment.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Equipment</Text>
                    <View style={styles.tagContainer}>
                      {workout.equipment.map((item, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {workout.tags && workout.tags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                    <View style={styles.tagContainer}>
                      {workout.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {workout.goals && workout.goals.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Goals</Text>
                    <View style={styles.tagContainer}>
                      {workout.goals.map((goal, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{goal}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {workout.cyclePhases && workout.cyclePhases.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cycle Phases</Text>
                    <View style={styles.tagContainer}>
                      {workout.cyclePhases.map((phase, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{phase}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Safety Information</Text>
                  <View style={styles.safetyRow}>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Pregnancy Safe</Text>
                      <Text style={styles.safetyValue}>
                        {workout.pregnancySafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Postpartum Safe</Text>
                      <Text style={styles.safetyValue}>
                        {workout.postpartumSafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Breastfeeding Safe</Text>
                      <Text style={styles.safetyValue}>
                        {workout.breastfeedingSafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: sizes.screenHeight * 0.9,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.black,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  intensityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  intensityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.white,
    fontWeight: 'bold',
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  benefitBullet: {
    fontSize: 16,
    color: colors.heading,
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.heading,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.white,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.lightOranger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
  safetyRow: {
    marginTop: 8,
  },
  safetyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  safetyLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },
  safetyValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
});

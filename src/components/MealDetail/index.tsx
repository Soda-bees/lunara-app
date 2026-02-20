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
import { getMealDetail, Meal } from '../../services/api';
import { getUserFriendlyError } from '../../utils/errorMessages';

interface MealDetailProps {
  mealId: string;
  visible: boolean;
  onClose: () => void;
}

export default function MealDetail({ mealId, visible, onClose }: MealDetailProps) {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && mealId) {
      loadMealDetail();
    }
  }, [visible, mealId]);

  const loadMealDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMealDetail(mealId);
      if (res.success && res.data) {
        setMeal(res.data);
      } else {
        setError('Unable to load meal details.');
      }
    } catch (e: any) {
      setError(getUserFriendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotLabel = (slot: string) => {
    const labels: { [key: string]: string } = {
      breakfast: 'Breakfast',
      mid_morning_snack: 'Mid-morning Snack',
      lunch: 'Lunch',
      afternoon_snack: 'Afternoon Snack',
      dinner: 'Dinner',
    };
    return labels[slot] || slot;
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
            <Text style={styles.headerTitle}>Meal Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.heading} />
                <Text style={styles.loadingText}>Loading meal details...</Text>
              </View>
            )}

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {meal && !loading && (
              <>
                <View style={styles.section}>
                  <Text style={styles.title}>{meal.title}</Text>
                  <Text style={styles.description}>{meal.description}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Time Slot</Text>
                  <Text style={styles.sectionValue}>
                    {getTimeSlotLabel(meal.timeSlot)}
                  </Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Nutritional Information</Text>
                  <View style={styles.macroRow}>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Protein</Text>
                      <Text style={styles.macroValue}>{meal.protein}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Carbs</Text>
                      <Text style={styles.macroValue}>{meal.carbs}g</Text>
                    </View>
                    <View style={styles.macroItem}>
                      <Text style={styles.macroLabel}>Fat</Text>
                      <Text style={styles.macroValue}>{meal.fat}g</Text>
                    </View>
                  </View>
                </View>

                {meal.tags && meal.tags.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tags</Text>
                  <View style={styles.tagContainer}>
                    {meal.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                )}

                {meal.goals && meal.goals.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Goals</Text>
                    <View style={styles.tagContainer}>
                      {meal.goals.map((goal, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{goal}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {meal.cuisines && meal.cuisines.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuisines</Text>
                    <View style={styles.tagContainer}>
                      {meal.cuisines.map((cuisine, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{cuisine}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Dietary Information</Text>
                  <View style={styles.dietaryRow}>
                    {meal.vegetarian && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Vegetarian</Text>
                      </View>
                    )}
                    {meal.vegan && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Vegan</Text>
                      </View>
                    )}
                    {meal.pescatarian && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Pescatarian</Text>
                      </View>
                    )}
                    {meal.glutenFree && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Gluten-Free</Text>
                      </View>
                    )}
                    {meal.dairyFree && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Dairy-Free</Text>
                      </View>
                    )}
                    {meal.nutFree && (
                      <View style={styles.dietaryTag}>
                        <Text style={styles.dietaryText}>Nut-Free</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Safety Information</Text>
                  <View style={styles.safetyRow}>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Pregnancy Safe</Text>
                      <Text style={styles.safetyValue}>
                        {meal.pregnancySafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Postpartum Safe</Text>
                      <Text style={styles.safetyValue}>
                        {meal.postpartumSafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                    <View style={styles.safetyItem}>
                      <Text style={styles.safetyLabel}>Breastfeeding Safe</Text>
                      <Text style={styles.safetyValue}>
                        {meal.breastfeedingSafe ? '✓ Yes' : '✗ No'}
                      </Text>
                    </View>
                  </View>
                </View>

                {meal.phases && meal.phases.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cycle Phases</Text>
                    <View style={styles.tagContainer}>
                      {meal.phases.map((phase, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{phase}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {meal.budgetLevel && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Budget Level</Text>
                    <Text style={styles.sectionValue}>
                      {meal.budgetLevel.charAt(0).toUpperCase() + meal.budgetLevel.slice(1)}
                    </Text>
                  </View>
                )}
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
  sectionValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.heading,
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
  dietaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  dietaryTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  dietaryText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2E7D32',
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

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/colors';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';

type Props = NativeStackScreenProps<RootStackParamList, 'DietaryPreferences'>;

export const DietaryPreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [dietaryRestrictions, setDietaryRestrictions] = useState(
    data.dietaryRestrictions || {
      vegetarian: false,
      vegan: false,
      pescatarian: false,
      glutenFree: false,
      dairyFree: false,
      nutAllergy: false,
    },
  );
  const [otherAllergies, setOtherAllergies] = useState(
    data.otherAllergies || '',
  );
  const [cuisinePreferences, setCuisinePreferences] = useState(
    data.cuisinePreferences || [],
  );
  const [dislikedFoods, setDislikedFoods] = useState(data.dislikedFoods || '');
  const [favoriteFoods, setFavoriteFoods] = useState(data.favoriteFoods || '');

  const cuisines = [
    'Indian',
    'Mediterranean',
    'Asian',
    'Mexican',
    'Italian',
    'American',
    'Middle Eastern',
  ];

  const toggleRestriction = (key: keyof typeof dietaryRestrictions) => {
    setDietaryRestrictions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisinePreferences(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const handleInputFocus = () => {
    // Scroll to bottom smoothly when any TextInput is focused
    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd(true);
      }, 150);
    });
  };

  return (
    <ScreenContainer>
      <OnboardingHeader
        title="Dietary Preferences"
        subtitle="Help us create meals you'll love"
        currentStep={5}
        totalSteps={8}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={46}
      >
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Dietary Restrictions</Text>
            <Text style={styles.helper}>Select any that apply to you</Text>
            <View style={styles.grid}>
              {Object.entries(dietaryRestrictions).map(([key, value]) => {
                const selected = value;
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() =>
                      toggleRestriction(key as keyof typeof dietaryRestrictions)
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Other Allergies</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., shellfish, soy, eggs"
              placeholderTextColor={colors.placeholder}
              value={otherAllergies}
              onChangeText={setOtherAllergies}
              onFocus={handleInputFocus}
            />
            <Text style={styles.helper}>
              Separate multiple allergies with commas
            </Text>
          </View>

          <View style={styles.section}>
            <View>
              <Text style={styles.label}>Favorite Cuisines</Text>
              <Text style={styles.helper}>Select all that you enjoy</Text>
            </View>
            <View style={styles.grid}>
              {cuisines.map(cuisine => {
                const selected = cuisinePreferences.includes(cuisine);
                return (
                  <TouchableOpacity
                    key={cuisine}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => toggleCuisine(cuisine)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Disliked Foods (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., broccoli, mushrooms"
              placeholderTextColor={colors.placeholder}
              value={dislikedFoods}
              onChangeText={setDislikedFoods}
              onFocus={handleInputFocus}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Favorite Foods (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., avocado, salmon, berries"
              placeholderTextColor={colors.placeholder}
              value={favoriteFoods}
              onChangeText={setFavoriteFoods}
              onFocus={handleInputFocus}
            />
            <Text style={styles.helper}>
              We'll try to include these in your meal plans! 😊
            </Text>
          </View>
        </View>

        <EmpatheticButton
          title="Continue"
          onPress={() => {
            updateData(
              {
                dietaryRestrictions,
                otherAllergies: otherAllergies || undefined,
                cuisinePreferences:
                  cuisinePreferences.length > 0
                    ? cuisinePreferences
                    : undefined,
                dislikedFoods: dislikedFoods || undefined,
                favoriteFoods: favoriteFoods || undefined,
              },
              'DailyLifeMatters',
            );
            navigation.navigate('DailyLifeMatters');
          }}
        />
        <Text style={styles.bottomText}>
          Great choices! Let's keep going! 🍽️
        </Text>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    // gap: spacing.md
  },
  card: {
    gap: spacing.md,
    marginBottom: sizes.screenHeight * 0.055,
  },
  section: {
    gap: spacing.xs,
  },

  label: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },

  helper: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F8FAFC',
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    borderColor: colors.heading + '80',
    backgroundColor: colors.headingLight,
  },

  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  chipTextSelected: {
    color: colors.heading,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import {
  DietaryRestrictions,
  getMe,
  updateProfile,
} from '../../../services/api';
import { colors } from '../../../constants/colors';
import styles from './editStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfileDietary'>;

const DEFAULT_RESTRICTIONS: DietaryRestrictions = {
  vegetarian: false,
  vegan: false,
  pescatarian: false,
  glutenFree: false,
  dairyFree: false,
  nutAllergy: false,
};

const CUISINES = [
  'Indian',
  'Mediterranean',
  'Asian',
  'Mexican',
  'Italian',
  'American',
  'Middle Eastern',
];

export default function EditDietaryScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] =
    useState<DietaryRestrictions>(DEFAULT_RESTRICTIONS);
  const [otherAllergies, setOtherAllergies] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [dislikedFoods, setDislikedFoods] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  useEffect(() => {
    getMe()
      .then(res => {
        if (!res.success || !res.user) {
          return;
        }
        const user = res.user;
        setDietaryRestrictions({
          ...DEFAULT_RESTRICTIONS,
          ...(user.dietaryRestrictions || {}),
        });
        setOtherAllergies(user.otherAllergies || '');
        setCuisinePreferences(user.cuisinePreferences || []);
        setDislikedFoods(user.dislikedFoods || '');
        setFavoriteFoods(user.favoriteFoods || '');
      })
      .catch(() => Alert.alert('Error', 'Could not load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleRestriction = (key: keyof DietaryRestrictions) => {
    setDietaryRestrictions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisinePreferences(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateProfile({
        dietaryRestrictions,
        otherAllergies: otherAllergies || undefined,
        cuisinePreferences,
        dislikedFoods: dislikedFoods || undefined,
        favoriteFoods: favoriteFoods || undefined,
      });
      if (res.success) {
        navigation.goBack();
        return;
      }
      Alert.alert('Error', 'Could not save your changes.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BackButton />
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <BackButton />
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <Text style={styles.title}>Dietary Preferences</Text>
        <Text style={styles.subtitle}>
          Help us personalize your meal recommendations.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dietary restrictions</Text>
          <View style={styles.chipRow}>
            {Object.entries(dietaryRestrictions).map(([key, value]) => {
              const label = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, value && styles.chipSelected]}
                  onPress={() =>
                    toggleRestriction(key as keyof DietaryRestrictions)
                  }
                >
                  <Text
                    style={[styles.chipText, value && styles.chipTextSelected]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Other allergies</Text>
          <TextInput
            style={styles.input}
            value={otherAllergies}
            onChangeText={setOtherAllergies}
            placeholder="e.g., shellfish, soy, eggs"
            placeholderTextColor={colors.placeHolderGray}
            onFocus={() => scrollRef.current?.scrollToEnd(true)}
          />

          <Text style={styles.sectionTitle}>Favorite cuisines</Text>
          <View style={styles.chipRow}>
            {CUISINES.map(cuisine => {
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

          <Text style={styles.label}>Disliked foods (optional)</Text>
          <TextInput
            style={styles.input}
            value={dislikedFoods}
            onChangeText={setDislikedFoods}
            placeholder="e.g., broccoli, mushrooms"
            placeholderTextColor={colors.placeHolderGray}
            onFocus={() => scrollRef.current?.scrollToEnd(true)}
          />

          <Text style={styles.label}>Favorite foods (optional)</Text>
          <TextInput
            style={styles.input}
            value={favoriteFoods}
            onChangeText={setFavoriteFoods}
            placeholder="e.g., avocado, salmon, berries"
            placeholderTextColor={colors.placeHolderGray}
            onFocus={() => scrollRef.current?.scrollToEnd(true)}
          />
        </View>

        <Button title="Save Changes" onPress={handleSave} loader={saving} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export function formatDietarySummary(
  restrictions?: DietaryRestrictions,
): string {
  if (!restrictions) {
    return 'Not set';
  }
  const active = Object.entries(restrictions)
    .filter(([, value]) => value)
    .map(([key]) =>
      key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    );
  return active.length ? active.join(', ') : 'None selected';
}

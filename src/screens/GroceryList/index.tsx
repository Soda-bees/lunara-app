import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addWeeklyGroceryItem,
  deleteWeeklyGroceryItem,
  getWeeklyGroceryList,
  getWeeklyPlanning,
  regenerateWeeklyGroceryList,
  updateWeeklyGroceryItem,
  type GroceryListItem,
} from '../../services/api';
import { colors } from '../../constants/colors';
import images from '../../constants/images';
import BackButton from '../../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import WeeklyMealPlanEmptyCard from '../../components/WeeklyMealPlanEmptyCard';
import type { WeeklyPlanningStatus } from '../../utils/weeklyNutritionDisplay';
import GroceryListItemRow from './GroceryListItemRow';
import styles from './style';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroceryList'>;

function formatWeekLabel(weekStart?: string, weekEnd?: string): string {
  if (!weekStart || !weekEnd) return '';
  return `${new Date(weekStart).toDateString()} – ${new Date(
    weekEnd,
  ).toDateString()}`;
}

export default function GroceryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState<GroceryListItem[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [weekStart, setWeekStart] = useState<string | undefined>();
  const [weekEnd, setWeekEnd] = useState<string | undefined>();
  const [planningStatus, setPlanningStatus] =
    useState<WeeklyPlanningStatus>('none');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [groceryRes, planningRes] = await Promise.all([
        getWeeklyGroceryList(),
        getWeeklyPlanning(),
      ]);
      setItems(groceryRes.data?.items || []);
      setWeekStart(groceryRes.data?.weekStart);
      setWeekEnd(groceryRes.data?.weekEnd);
      const plan = planningRes.data?.weeklyPlan;
      if (plan?.status === 'generated') {
        setPlanningStatus('generated');
      } else if (plan?.status === 'skipped') {
        setPlanningStatus('skipped');
      } else {
        setPlanningStatus('none');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to load grocery list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasWeeklyPlan = planningStatus === 'generated';
  const showPlanCta = !hasWeeklyPlan && items.length === 0;

  const checkedCount = useMemo(
    () => items.filter(i => i.checked).length,
    [items],
  );
  const totalCount = items.length;
  const progressRatio = totalCount > 0 ? checkedCount / totalCount : 0;
  const weekLabel = useMemo(
    () => formatWeekLabel(weekStart, weekEnd),
    [weekStart, weekEnd],
  );

  const toggleItem = async (item: GroceryListItem) => {
    try {
      const res = await updateWeeklyGroceryItem({
        itemId: item._id,
        checked: !item.checked,
      });
      setItems(res.data?.items || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to update item');
    }
  };

  const addItem = async () => {
    if (!input.trim()) return;
    try {
      const res = await addWeeklyGroceryItem({ name: input.trim() });
      setItems(res.data?.items || []);
      setInput('');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to add item');
    }
  };

  const removeItem = async (item: GroceryListItem) => {
    try {
      const res = await deleteWeeklyGroceryItem({ itemId: item._id });
      setItems(res.data?.items || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to delete item');
    }
  };

  const regenerate = async () => {
    if (!hasWeeklyPlan) {
      navigation.navigate('WeeklyMealPlanning');
      return;
    }
    try {
      const res = await regenerateWeeklyGroceryList();
      setItems(res.data?.items || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to regenerate grocery list');
    }
  };

  const renderProgressFill = () => (
    <View
      style={[
        styles.progressFill,
        styles.progressFillDynamic,
        { flex: progressRatio },
      ]}
    />
  );

  const renderProgressRemainder = () => (
    <View
      style={[styles.progressFillRemainder, { flex: 1 - progressRatio }]}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyCard}>
      <Image source={images.nutritionApple} style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>Your list is empty</Text>
      <Text style={styles.emptyBody}>
        {hasWeeklyPlan
          ? 'Add items above or regenerate from your weekly meal plan.'
          : 'Add items manually once you have a weekly meal plan.'}
      </Text>
      {hasWeeklyPlan ? (
        <TouchableOpacity style={styles.emptyRegenBtn} onPress={regenerate}>
          <Text style={styles.emptyRegenText}>
            Regenerate from weekly meals
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackButton />

      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Weekly Grocery List</Text>
          {weekLabel ? <Text style={styles.weekLabel}>{weekLabel}</Text> : null}
        </View>

        {showPlanCta ? (
          <View style={styles.planCtaWrap}>
            <WeeklyMealPlanEmptyCard
              planningStatus={planningStatus}
              compact
              onPlanPress={() => navigation.navigate('WeeklyMealPlanning')}
            />
          </View>
        ) : (
          <>
            {totalCount > 0 ? (
              <View style={[styles.progressCard, styles.progressCardWrap]}>
                <Text style={styles.progressLabel}>
                  {checkedCount} of {totalCount} picked up
                </Text>
                <View style={styles.progressTrack}>
                  {renderProgressFill()}
                  {renderProgressRemainder()}
                </View>
              </View>
            ) : null}

            <View style={styles.toolsCard}>
              <View style={styles.addRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  style={styles.input}
                  placeholder="Add item"
                  placeholderTextColor={colors.placeholderColor}
                  onSubmitEditing={() => {
                    addItem().catch(() => {});
                  }}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addBtn} onPress={addItem}>
                  <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.regenBtn} onPress={regenerate}>
                <Text style={styles.regenBtnText}>
                  {hasWeeklyPlan
                    ? 'Regenerate from weekly meals'
                    : 'Generate weekly meal plan first'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listCard}>
              <FlatList
                data={items}
                refreshing={loading}
                onRefresh={load}
                keyExtractor={item => item._id}
                ListEmptyComponent={renderEmptyList}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                renderItem={({ item }) => (
                  <GroceryListItemRow
                    item={item}
                    onToggle={toggleItem}
                    onDelete={removeItem}
                  />
                )}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

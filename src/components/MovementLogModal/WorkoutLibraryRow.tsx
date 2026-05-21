import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../constants/images';
import type { Workout } from '../../services/api';
import {
  buildWorkoutMetaPills,
  formatEquipment,
  hasLibraryExtras,
  isUserCustomWorkout,
  pickBenefitPreview,
} from './workoutDisplay';
import styles from './style';

type Props = {
  workout: Workout;
  selected: boolean;
  onPress: (workout: Workout) => void;
  onEdit?: (workout: Workout) => void;
  onDelete?: (workout: Workout) => void;
  actionsDisabled?: boolean;
};

export default function WorkoutLibraryRow({
  workout,
  selected,
  onPress,
  onEdit,
  onDelete,
  actionsDisabled = false,
}: Props) {
  const metaPills = buildWorkoutMetaPills(workout);
  const isCustom = isUserCustomWorkout(workout);
  const showExtras = hasLibraryExtras(workout);
  const benefits = showExtras ? pickBenefitPreview(workout.benefits, 2) : [];
  const equipmentLine = showExtras ? formatEquipment(workout.equipment) : '';

  return (
    <View style={[styles.item, selected && styles.itemActive]}>
      <View style={styles.itemTopRow}>
        <TouchableOpacity
          style={styles.itemMainPress}
          onPress={() => onPress(workout)}
          activeOpacity={0.8}
        >
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTitle}>{workout.title}</Text>
            {isCustom ? (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Custom</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            {metaPills.map(pill => (
              <View
                key={pill}
                style={[styles.metaPill, selected && styles.metaPillActive]}
              >
                <Text style={styles.metaPillText}>{pill}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {isCustom && onEdit && onDelete ? (
          <View style={styles.rowActions}>
            <TouchableOpacity
              style={styles.rowActionBtn}
              onPress={() => onEdit(workout)}
              disabled={actionsDisabled}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image source={images.edit} style={styles.rowActionIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rowActionBtn}
              onPress={() => onDelete(workout)}
              disabled={actionsDisabled}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Image
                source={images.deleteIcon}
                style={[styles.rowActionIcon, styles.rowActionIconDelete]}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {selected ? (
        <TouchableOpacity
          onPress={() => onPress(workout)}
          activeOpacity={0.8}
          style={styles.itemExpandedPress}
        >
          {workout.description ? (
            <Text style={styles.itemDescription} numberOfLines={2}>
              {workout.description}
            </Text>
          ) : null}
          {!isCustom && benefits.length > 0 ? (
            <View style={styles.chipRow}>
              {benefits.map(benefit => (
                <View key={benefit} style={styles.chip}>
                  <Text style={styles.chipText} numberOfLines={1}>
                    {benefit}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          {!isCustom && benefits.length === 0 && equipmentLine ? (
            <Text style={styles.equipmentLine}>{equipmentLine}</Text>
          ) : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

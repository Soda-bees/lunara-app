import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../constants/images/track';
import type { GroceryListItem } from '../../services/api';
import styles from './style';

type Props = {
  item: GroceryListItem;
  onToggle: (item: GroceryListItem) => void;
  onDelete: (item: GroceryListItem) => void;
};

function formatQuantity(item: GroceryListItem): string | null {
  if (item.quantity == null && !item.unit) return null;
  const q =
    item.quantity != null ? String(item.quantity) : '';
  const u = item.unit?.trim() || '';
  const combined = [q, u].filter(Boolean).join(' ');
  return combined || null;
}

export default function GroceryListItemRow({
  item,
  onToggle,
  onDelete,
}: Props) {
  const quantityLine = formatQuantity(item);

  return (
    <View style={styles.itemRow}>
      <TouchableOpacity
        style={styles.itemMain}
        onPress={() => onToggle(item)}
        activeOpacity={0.7}
      >
        <Image
          source={
            item.checked ? images.orangeCheckBoxOn : images.orangeCheckBoxOff
          }
          style={styles.checkbox}
        />
        <View style={styles.itemTextBlock}>
          <Text
            style={[styles.itemText, item.checked && styles.itemTextDone]}
          >
            {item.name}
          </Text>
          {quantityLine ? (
            <Text style={styles.itemMeta}>{quantityLine}</Text>
          ) : null}
          {item.source === 'generated' ? (
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>From meal plan</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Image source={images.deleteIcon} style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );
}

import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '../../../constants/images/cycle';
import { WeeklyUpdate } from '../../../services/api';
import { getIconForType } from '../../../utils/phaseGuideUtils';
import { FALLBACK_WEEKLY_UPDATES } from '../cycleInsightConstants';
import styles from '../style';

type Props = {
  weeklyUpdates: WeeklyUpdate[];
  loadingWeeklyUpdates: boolean;
};

export default function CycleInsightWeeklyUpdates({
  weeklyUpdates,
  loadingWeeklyUpdates,
}: Props) {
  const items =
    loadingWeeklyUpdates && weeklyUpdates.length === 0
      ? FALLBACK_WEEKLY_UPDATES
      : weeklyUpdates.length > 0
      ? weeklyUpdates
      : FALLBACK_WEEKLY_UPDATES;

  return (
    <View style={styles.weeklyUpdateMaincontainer}>
      <View style={styles.headerRow}>
        <Image source={images.periodCalender} style={styles.calenderImage} />
        <Text style={styles.cycleText}>What to Expect This Week</Text>
      </View>
      <View style={styles.listWrapper}>
        {items.map((item, index) => (
          <View key={index} style={styles.weeklyItem}>
            <View
              style={[styles.iconBubble, { backgroundColor: item.color }]}
            >
              <Image
                source={getIconForType(item.iconType)}
                style={[
                  styles.icon,
                  item.iconColor && { tintColor: item.iconColor },
                ]}
              />
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.message}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

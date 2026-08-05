import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '../../../constants/images';
import { CycleStatusResponse } from '../../../services/api';
import {
  getFertileWindowText,
  getFertilityDescription,
  getFertilityTagline,
} from '../cycleInsightUtils';
import styles from '../style';

type Props = {
  cycle: CycleStatusResponse['data'];
  lastPeriodStart: Date | null;
};

export default function CycleInsightFertilityCard({
  cycle,
  lastPeriodStart,
}: Props) {
  return (
    <View style={styles.pregnancyView}>
      <View style={styles.heartImageView}>
        <Image
          source={images.pregnancyHeart}
          style={styles.pregnanyHeartImage}
        />
      </View>
      <View style={{ marginLeft: 10 }}>
        <View style={styles.pregnancyIcon}>
          <Text style={styles.pregnancyText}>Fertility Today</Text>
        </View>
        <View style={styles.lowTextView}>
          <Text style={styles.lowText}>
            {getFertilityTagline(cycle, cycle?.phase)}
          </Text>
        </View>
        <Text style={styles.textDarkGrey}>
          Fertile window: {getFertileWindowText(cycle, lastPeriodStart)}
        </Text>
        <Text style={[styles.textDarkGreyWidht, { marginTop: 4 }]}>
          {getFertilityDescription(cycle)}
        </Text>
      </View>
    </View>
  );
}

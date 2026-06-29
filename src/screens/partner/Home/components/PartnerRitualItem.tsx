import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '../../../../constants/images';
import type { HomeRitual } from '../../../../hooks/useHomeRituals';
import { partnerHomeStyles as styles } from '../style';

type Props = {
  ritual: HomeRitual;
};

export default function PartnerRitualItem({ ritual }: Props) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <Image
          source={
            ritual.completed ? images.circleChecked : images.circleUnchecked
          }
          style={styles.checkIcon}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.itemTitle,
              ritual.completed && styles.itemTitleDone,
            ]}
          >
            {ritual.title}
          </Text>
          <Text style={styles.tagText}>● {ritual.tag}</Text>
        </View>
      </View>
      {ritual.description ? (
        <Text style={styles.itemDescription}>{ritual.description}</Text>
      ) : null}
    </View>
  );
}

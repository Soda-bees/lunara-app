import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import type { HomeRitual } from '../../../hooks/useHomeRituals';
import images from '../../../constants/images';
import styles from '../style';

type Props = {
  ritual: HomeRitual;
  onPress: () => void | Promise<void>;
};

export default function HomeRitualItem({ ritual, onPress }: Props) {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <Image
            source={
              ritual.completed ? images.circleChecked : images.circleUnchecked
            }
            style={styles.checkIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{ flex: 1 }}
        >
          <Text style={styles.itemTitle}>{ritual.title}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>● {ritual.tag}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemDescription}>{ritual.description}</Text>
    </View>
  );
}

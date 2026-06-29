import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../../../constants/images';
import { partnerHomeStyles as styles } from '../style';

export type ExploreItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: number;
  onPress: () => void;
};

type Props = {
  items: ExploreItem[];
};

export default function PartnerExploreSection({ items }: Props) {
  return (
    <View>
      <Text style={styles.exploreHeading}>Explore</Text>
      {items.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.exploreCard}
          onPress={item.onPress}
          activeOpacity={0.5}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.exploreIconWrap}>
              <Image source={item.icon} style={styles.exploreIcon} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.exploreTitle}>{item.title}</Text>
              <Text style={styles.exploreSubtitle}>{item.subtitle}</Text>
            </View>
          </View>
          <Image source={images.rightArrow} style={styles.exploreArrow} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

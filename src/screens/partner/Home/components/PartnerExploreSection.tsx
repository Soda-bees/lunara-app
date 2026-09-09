import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import InitialsAvatar from '../../../../components/InitialsAvatar';
import images from '../../../../constants/images/home';
import { sizes } from '../../../../constants/sizes';
import { partnerHomeStyles as styles } from '../style';

export type ExploreItem = {
  id: string;
  title: string;
  subtitle: string;
  icon?: number;
  avatarName?: string | null;
  onPress: () => void;
};

type Props = {
  items: ExploreItem[];
};

const AVATAR_SIZE = sizes.screenWidth * 0.1;

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
            {item.avatarName !== undefined ? (
              <InitialsAvatar name={item.avatarName} size={AVATAR_SIZE} />
            ) : (
              <View style={styles.exploreIconWrap}>
                <Image source={item.icon} style={styles.exploreIcon} />
              </View>
            )}
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

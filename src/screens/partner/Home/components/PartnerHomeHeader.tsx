import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import images from '../../../../constants/images/home';
import type { RootStackParamList } from '../../../../navigation/stackNavigation';
import InitialsAvatar from '../../../../components/InitialsAvatar';
import { partnerHomeStyles as styles } from '../style';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Props = {
  primaryUserName: string;
};

export default function PartnerHomeHeader({ primaryUserName }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const displayName = primaryUserName || 'their';

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Image source={images.logoFull} style={styles.logo} />
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <InitialsAvatar name={primaryUserName} size={26} />
          <Text style={styles.profileButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.contextLine}>
        Viewing <Text style={styles.contextName}>{displayName}&apos;s</Text>{' '}
        dashboard
      </Text>
    </View>
  );
}

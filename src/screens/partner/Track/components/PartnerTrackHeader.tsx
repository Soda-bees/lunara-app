import React from 'react';
import { Text, View } from 'react-native';
import { usePartnerMode } from '../../../../context/PartnerModeContext';
import { getPartnerDisplayNames } from '../partnerTrackUtils';
import { partnerTrackStyles as styles } from '../style';

export default function PartnerTrackHeader() {
  const { primaryUserName } = usePartnerMode();
  const { partnerNamePossessive } = getPartnerDisplayNames(primaryUserName);

  return (
    <View style={styles.topContainer}>
      <Text style={styles.heading}>Nutrition & Movement</Text>
      <Text style={styles.subHeading}>
        Viewing {partnerNamePossessive} tracking
      </Text>
    </View>
  );
}

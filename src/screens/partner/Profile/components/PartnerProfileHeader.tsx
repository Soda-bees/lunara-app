import React from 'react';
import { Text, View } from 'react-native';
import { usePartnerMode } from '../../../../context/PartnerModeContext';
import { getPartnerDisplayNames } from '../../Track/partnerTrackUtils';
import { partnerProfileStyles as styles } from '../style';

export default function PartnerProfileHeader() {
  const { primaryUserName } = usePartnerMode();
  const { partnerNamePossessive } = getPartnerDisplayNames(primaryUserName);

  return (
    <View style={styles.topContainer}>
      <Text style={styles.heading}>Profile & Stats</Text>
      <Text style={styles.subHeading}>
        Viewing {partnerNamePossessive} wellness overview
      </Text>
    </View>
  );
}

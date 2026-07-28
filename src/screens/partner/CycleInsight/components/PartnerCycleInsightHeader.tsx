import React from 'react';
import { Text, View } from 'react-native';
import { usePartnerMode } from '../../../../context/PartnerModeContext';
import styles from '../style';

type Props = {
  title?: string;
};

export default function PartnerCycleInsightHeader({
  title = 'Cycle Insights',
}: Props) {
  const { primaryUserName } = usePartnerMode();
  const displayName = primaryUserName || 'their';

  return (
    <View style={styles.topContainer}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.subHeading}>
        Viewing {displayName}&apos;s cycle insights
      </Text>
    </View>
  );
}

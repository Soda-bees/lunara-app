import React from 'react';
import { Image, Text, View } from 'react-native';
import GradientWrapper from '../../../../components/GradientWrapper';
import images from '../../../../constants/images';
import type { PhaseInfo } from '../../../../services/api';
import { partnerTrackStyles as styles } from '../style';

type Props = {
  partnerNamePossessive: string;
  phaseInfo: PhaseInfo;
};

export default function PartnerMovementPhaseCard({
  partnerNamePossessive,
  phaseInfo,
}: Props) {
  return (
    <GradientWrapper variant="basic">
      <View style={styles.phaseBody}>
        <View style={styles.rowFull}>
          <View style={styles.rowBottom}>
            <View>
              <Text style={styles.phaseLabelSmall}>
                {partnerNamePossessive} current phase
              </Text>
              <Text style={styles.phaseTitleLarge}>{phaseInfo.phaseName}</Text>
              <View style={styles.phasePill}>
                <Text style={styles.phasePillText}>{phaseInfo.phaseTitle}</Text>
              </View>
            </View>
          </View>
          <Image source={images.dumbellIcon} style={styles.dumbellIcon} />
        </View>
        <Text style={styles.textDarkGrey}>{phaseInfo.description}</Text>
        <View style={styles.infoRow}>
          <Image source={images.energyHigh} style={styles.infoIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoHeading}>Hormone benefit</Text>
            <Text style={styles.infoValue}>{phaseInfo.benefit}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Image
            source={images.informationIcon}
            style={[styles.infoIcon, { tintColor: 'red' }]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoHeading}>What to avoid</Text>
            <Text style={styles.infoValue}>{phaseInfo.avoid}</Text>
          </View>
        </View>
      </View>
    </GradientWrapper>
  );
}

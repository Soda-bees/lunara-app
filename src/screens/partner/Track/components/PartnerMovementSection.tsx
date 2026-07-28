import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import MovementMap from '../../../../components/MovementMap';
import {
  getMovementScience,
  getPhaseInfo,
  type LoggedWorkout,
  type MovementScienceItem,
  type PhaseInfo,
} from '../../../../services/api';
import PartnerMovementLogCard from './PartnerMovementLogCard';
import PartnerMovementPhaseCard from './PartnerMovementPhaseCard';
import PartnerMovementScienceList from './PartnerMovementScienceList';
import { partnerTrackStyles as styles } from '../style';

const FALLBACK_PHASE_INFO: PhaseInfo = {
  phaseName: 'Current phase',
  phaseTitle: 'Movement focus',
  description:
    'Movement guidance adapts to the current cycle phase and energy levels.',
  benefit: 'Supports overall health and hormone balance',
  avoid: 'Overexertion or ignoring body signals',
  phase: 'unknown',
  isPregnant: false,
  isBreastfeeding: false,
  isPostpartum: false,
};

const FALLBACK_SCIENCE: MovementScienceItem[] = [
  {
    title: 'Muscle & Insulin',
    description:
      'Muscle contraction increases insulin sensitivity—helping regulate blood sugar and hormone balance.',
    image: '💪',
  },
  {
    title: 'Walking After Meals',
    description:
      'A 10-minute walk after eating can reduce estrogen dominance and improve digestion.',
    image: '🚶‍♀️',
  },
];

type Props = {
  partnerNamePossessive: string;
  today: string;
  dailyMovementLogs: LoggedWorkout[];
  refreshToken?: number;
};

export default function PartnerMovementSection({
  partnerNamePossessive,
  today,
  dailyMovementLogs,
  refreshToken = 0,
}: Props) {
  const [phaseInfo, setPhaseInfo] = useState<PhaseInfo | null>(null);
  const [movementScienceData, setMovementScienceData] = useState<
    MovementScienceItem[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [phaseRes, scienceRes] = await Promise.all([
          getPhaseInfo(today),
          getMovementScience(),
        ]);
        if (cancelled) return;

        if (phaseRes.success && phaseRes.data) {
          setPhaseInfo(phaseRes.data);
        } else {
          setPhaseInfo(null);
        }

        if (scienceRes.success && scienceRes.data?.length) {
          setMovementScienceData(scienceRes.data);
        } else {
          setMovementScienceData(FALLBACK_SCIENCE);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const message =
            e instanceof Error
              ? e.message
              : 'Unable to load movement information.';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [today, refreshToken]);

  const displayPhaseInfo = phaseInfo || FALLBACK_PHASE_INFO;

  const introSubtitle = useMemo(
    () => `Movement guidance tailored to ${partnerNamePossessive} current phase.`,
    [partnerNamePossessive],
  );

  return (
    <View style={styles.sectionContent}>
      <View>
        <Text style={styles.sectionIntroTitle}>Hormone-intelligent movement</Text>
        <Text style={styles.sectionIntroSubtitle}>{introSubtitle}</Text>
      </View>

      <PartnerMovementLogCard
        partnerNamePossessive={partnerNamePossessive}
        logs={dailyMovementLogs}
      />

      <PartnerMovementPhaseCard
        partnerNamePossessive={partnerNamePossessive}
        phaseInfo={displayPhaseInfo}
      />

      <MovementMap />

      <PartnerMovementScienceList
        items={movementScienceData}
        loading={loading}
        error={error}
      />
    </View>
  );
}

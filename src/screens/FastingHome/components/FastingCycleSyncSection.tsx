import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import images from '../../../constants/images';
import { cycleSyncGuidance } from '../fastingData';
import styles from '../style';

type Props = {
  currentPhase: string;
};

export default function FastingCycleSyncSection({ currentPhase }: Props) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🌙</Text>
        <Text style={styles.sectionTitle}>Cycle-Synced Fasting</Text>
      </View>
      <Text style={styles.sectionIntro}>
        Unlike men, your metabolism changes throughout your cycle. Smart fasting
        honors these fluctuations rather than fighting them. Here's your
        phase-by-phase guide:
      </Text>

      {cycleSyncGuidance.map(phase => {
        const isExpanded = expandedPhase === phase.phase;
        const isCurrent = phase.phase === currentPhase;

        return (
          <View
            key={phase.phase}
            style={[styles.phaseCard, isCurrent && styles.phaseCardCurrent]}
          >
            <TouchableOpacity
              style={styles.phaseHeader}
              onPress={() =>
                setExpandedPhase(isExpanded ? null : phase.phase)
              }
            >
              <Text style={styles.phaseEmoji}>{phase.emoji}</Text>
              <View style={styles.phaseHeaderContent}>
                <View style={styles.phaseTitleRow}>
                  <Text style={styles.phaseTitle}>
                    {phase.phase.charAt(0).toUpperCase() +
                      phase.phase.slice(1)}{' '}
                    Phase
                  </Text>
                  {isCurrent && (
                    <View style={styles.currentPhaseBadge}>
                      <Text style={styles.currentPhaseBadgeText}>Current</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.phaseWindow}>{phase.window} window</Text>
              </View>
              <Image
                source={isExpanded ? images.rightArrow : images.rightArrow}
                style={isExpanded ? styles.chevronInverted : styles.chevron}
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.phaseContent}>
                <View style={styles.phaseApproach}>
                  <Text style={styles.phaseApproachText}>
                    {phase.approach}
                  </Text>
                </View>
                <Text style={styles.phaseDescription}>{phase.description}</Text>

                <View style={styles.phaseSection}>
                  <Text style={styles.phaseSectionTitle}>
                    ✓ Recommendations
                  </Text>
                  {phase.recommendations.map((rec, i) => (
                    <Text key={i} style={styles.phaseListItem}>
                      <Text style={styles.phaseListBulletRecommend}>•</Text>{' '}
                      {rec}
                    </Text>
                  ))}
                </View>

                <View style={styles.phaseSection}>
                  <Text
                    style={[
                      styles.phaseSectionTitle,
                      styles.phaseSectionTitleAvoid,
                    ]}
                  >
                    ⚠ Avoid
                  </Text>
                  {phase.avoid.map((item, i) => (
                    <Text key={i} style={styles.phaseListItem}>
                      <Text style={styles.phaseListBulletAvoid}>•</Text> {item}
                    </Text>
                  ))}
                </View>

                <View style={styles.phaseScience}>
                  <Text style={styles.phaseScienceTitle}>🧬 The Science</Text>
                  <Text style={styles.phaseScienceText}>{phase.science}</Text>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../constants/colors';
import images from '../../../constants/images/track';
import { fastingMechanisms } from '../fastingData';
import styles from '../style';

export default function FastingMechanismsSection() {
  const [expandedMechanism, setExpandedMechanism] = useState<string | null>(
    null,
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📚</Text>
        <Text style={styles.sectionTitle}>The Deep Science</Text>
      </View>
      <Text style={styles.sectionIntro}>
        Fasting isn't just about not eating—it triggers a cascade of cellular
        and metabolic changes that promote healing, longevity, and hormonal
        balance. Here's what happens in your body:
      </Text>

      {fastingMechanisms.map(mechanism => (
        <View
          key={mechanism.title}
          style={
            expandedMechanism === mechanism.title
              ? [styles.mechanismCard, { borderColor: colors.lightOranger }]
              : styles.mechanismCard
          }
        >
          <TouchableOpacity
            style={styles.mechanismHeader}
            onPress={() =>
              setExpandedMechanism(
                expandedMechanism === mechanism.title ? null : mechanism.title,
              )
            }
          >
            <View style={styles.mechanismIconContainer}>
              <Text style={styles.mechanismIcon}>{mechanism.icon}</Text>
            </View>
            <View style={styles.mechanismContent}>
              <Text style={styles.mechanismTitle}>{mechanism.title}</Text>
              <Text style={styles.mechanismDescription}>
                {mechanism.description}
              </Text>
            </View>
            <Image
              source={
                expandedMechanism === mechanism.title
                  ? images.rightArrow
                  : images.rightArrow
              }
              style={
                expandedMechanism === mechanism.title
                  ? styles.chevronInverted
                  : styles.chevron
              }
            />
          </TouchableOpacity>

          {expandedMechanism === mechanism.title && (
            <View style={styles.mechanismDetail}>
              <Text style={styles.mechanismDetailText}>
                {mechanism.detail}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

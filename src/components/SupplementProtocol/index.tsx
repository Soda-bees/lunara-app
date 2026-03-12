import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { colors } from '../../constants/colors';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import { ChallengeStackPhase } from '../../services/api';

interface SupplementProtocolProps {
  phases?: ChallengeStackPhase[];
}

export default function SupplementProtocol({ phases = [] }: SupplementProtocolProps) {
  // Map backend data structure to component display format
  const supplementPhases = useMemo(() => {
    if (!phases || phases.length === 0) {
      return [];
    }

    return phases.map((phase) => {
      // Parse items: if they contain "(", split into title and description
      // Otherwise, use the whole string as title
      const parseItem = (item: string) => {
        const parenIndex = item.indexOf('(');
        if (parenIndex > 0) {
          return {
            title: item.substring(0, parenIndex).trim(),
            text: item.substring(parenIndex).trim(),
          };
        }
        return {
          title: item,
          text: '',
        };
      };

      // Map supplements to sections
      const sections = (phase.supplements || []).map((supplement) => ({
        title: supplement.timing,
        bullets: (supplement.items || []).map(parseItem),
      }));

      return {
        title: phase.name || '',
        days: phase.days || '',
        goal: phase.goal ? (phase.goal.startsWith('Goal:') ? phase.goal : `Goal: ${phase.goal}`) : '',
        sections,
      };
    });
  }, [phases]);

  if (supplementPhases.length === 0) {
    return null;
  }

  return (
    <View>
      {supplementPhases.map((item, index) => {
        return (
          <View style={styles.visionBehindView} key={index}>
            <View style={styles.row}>
              <Image source={images.logWaterDrop} style={styles.icon} />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.days}>{item.days}</Text>
              </View>
            </View>
            <Text style={styles.goalText}>{item.goal}</Text>
            {item.sections.map((item, index) => {
              return (
                <View key={index}>
                  <Text style={styles.timeOfDay}>{item.title}</Text>
                  {item.bullets.map((item, index) => {
                    return (
                      <View
                        style={[styles.row, { marginBottom: 10 }]}
                        key={index}
                      >
                        <View style={styles.dot} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.bulletTitle}>{item.title}</Text>
                          {item.text ? (
                            <Text style={styles.bulletText}>{item.text}</Text>
                          ) : null}
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  visionBehindView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: sizes.screenWidth * 0.08,
    height: sizes.screenWidth * 0.08,
    tintColor: '#757DD6',
    marginRight: 6,
    resizeMode: 'contain',
  },

  title: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  days: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  goalText: {
    marginTop: 10,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 18,
  },

  timeOfDay: {
    fontSize: 12,
    color: colors.heading,
    fontFamily: 'Inter-Regular',
    marginVertical: 10,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.green,
    borderRadius: 10,
    marginTop: 6,
    marginRight: 10,
  },

  bulletTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },

  bulletText: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});

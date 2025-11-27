import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

interface RecentPattern {
  symptom: string;
  severity: string;
  trendIcon: any;
}

interface HistoryItem {
  day: number;
  date: string;
  phase: string;
  symptoms: Record<string, string>;
  note?: string;
}

interface Props {
  recentPatterns?: RecentPattern[];
  history?: HistoryItem[];
}

export default function SymptomTrends({
  recentPatterns: propRecentPatterns,
  history: propHistory,
}: Props) {
  const [showHistory, setShowHistory] = useState(false);

  const mockRecentPatterns: RecentPattern[] = [
    {
      symptom: 'Energy',
      severity: 'Severe',
      trendIcon: images.btTrackActive,
    },
    {
      symptom: 'Mood',
      severity: 'Moderate',
      trendIcon: images.btTrackActive,
    },
    {
      symptom: 'Focus',
      severity: 'Severe',
      trendIcon: images.btTrackActive,
    },
    {
      symptom: 'Sleep Quality',
      severity: 'Moderate',
      trendIcon: images.btTrackActive,
    },
  ];

  const mockHistory: HistoryItem[] = [
    {
      day: 8,
      date: '2025-10-23',
      phase: 'Follicular',
      symptoms: {
        Energy: 'Severe',
        Mood: 'Moderate',
        Focus: 'Severe',
        SleepQuality: 'Moderate',
      },
      note: 'Feeling energized, had a great workout',
    },
    {
      day: 7,
      date: '2025-10-22',
      phase: 'Follicular',
      symptoms: {
        Energy: 'Severe',
        Mood: 'Moderate',
        Focus: 'Severe',
        SleepQuality: 'Moderate',
      },
    },
    {
      day: 6,
      date: '2025-10-21',
      phase: 'Follicular',
      symptoms: {
        Energy: 'Severe',
        Mood: 'Moderate',
        Focus: 'Severe',
        SleepQuality: 'Moderate',
      },
    },
  ];

  const recentPatterns = propRecentPatterns || mockRecentPatterns;
  const history = propHistory || mockHistory;

  const getColorBySeverity = (severity: string) => {
    switch (severity) {
      case 'Severe':
        return '#E85C5C';
      case 'Moderate':
        return '#E68C3A';
      case 'Mild':
        return '#5DBB63';
      default:
        return colors.black;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Symptom Trends</Text>
        <Text style={styles.subtitle}>Track patterns across your cycle</Text>
        <Text
          style={[
            styles.subtitle,
            { fontFamily: 'Inter-Medium', marginTop: 13 },
          ]}
        >
          RECENT PATTERNS
        </Text>
      </View>

      <View>
        {recentPatterns.map((item, index) => (
          <View key={index} style={styles.patternRow}>
            <View style={styles.left}>
              <Text style={styles.patternName}>{item.symptom}</Text>
              <Image source={item.trendIcon} style={styles.trendIcon} />
            </View>

            <View
              style={[
                styles.severityBox,
                { backgroundColor: getColorBySeverity(item.severity) + '20' },
              ]}
            >
              <Text
                style={[
                  styles.severityText,
                  { color: getColorBySeverity(item.severity) },
                ]}
              >
                {item.severity}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => setShowHistory(!showHistory)}
        style={styles.dropdown}
      >
        <Text style={styles.title}>View Full History</Text>
        <Image
          source={images.rightArrow}
          style={[
            styles.arrowStyle,
            { transform: [{ rotate: showHistory ? '-90deg' : '90deg' }] },
          ]}
        />
      </TouchableOpacity>
      {showHistory && <View style={styles.horizontalLine} />}

      {showHistory && (
        <View style={{ width: '100%', marginTop: 10 }}>
          {history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDay}>Day {item.day}</Text>

                <View style={styles.phasePill}>
                  <Text style={styles.phaseText}>{item.phase}</Text>
                </View>
              </View>

              <Text style={styles.historyDate}>{item.date}</Text>

              {Object.entries(item.symptoms).map(([key, value]) => (
                <View key={key} style={styles.historyRow}>
                  <Text style={styles.symptomKey}>{key}</Text>
                  <Text
                    style={[
                      styles.symptomValue,
                      { color: getColorBySeverity(value) },
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              ))}

              {item.note && <Text style={styles.noteText}>"{item.note}"</Text>}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginVertical: 16,
  },

  header: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  title: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Regular',
  },

  subtitle: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  patternRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: sizes.screenWidth * 0.02,
    marginTop: 5,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trendIcon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.025,
    height: sizes.screenWidth * 0.025,
    marginLeft: 5,
  },
  patternName: {
    fontFamily: 'Inter-Medium',
    color: colors.black,
    fontSize: 12,
  },

  severityBox: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  severityText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    // borderBottomColor: colors.borderColorLight,
    // borderBottomWidth: 1.5,
    // paddingBottom: 8,
  },

  horizontalLine: {
    borderBottomColor: colors.borderColorLight,
    borderBottomWidth: 1.5,
    paddingBottom: 8,
  },

  dropdownArrow: {
    marginLeft: 8,
    fontSize: 12,
  },

  historyCard: {
    paddingVertical: 10,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  historyDay: {
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },

  phasePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#F3D8EA',
    borderRadius: 20,
  },

  phaseText: {
    color: '#8A4676',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },

  historyDate: {
    marginTop: 2,
    color: colors.green,

    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  symptomKey: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },

  symptomValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  noteText: {
    marginTop: 6,
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-SemiBoldItalic',
  },

  arrowStyle: {
    resizeMode: 'contain',
    width: 12,
    height: 12,
  },
});

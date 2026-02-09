import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import {
  getCycleSymptomPatterns,
  getCycleSymptomHistory,
  CycleSymptomPattern,
  CycleSymptomHistoryItem,
} from '../../services/api';
import SymptomLogModal from '../SymptomLogModal';
import moment from 'moment';

interface RecentPattern {
  symptom: string;
  severity: string;
  trendIcon: any;
}

interface HistoryItem {
  day: number | null;
  date: string;
  phase: string;
  symptoms: Record<string, string>;
  note?: string | null;
}

interface Props {
  onLogSymptom?: () => void; // Callback when symptom is logged
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SymptomTrends({ onLogSymptom }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const [recentPatterns, setRecentPatterns] = useState<RecentPattern[]>([]);
  const [lastSevenDays, setLastSevenDays] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [hasAnySymptoms, setHasAnySymptoms] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patternsResponse, historyResponse] = await Promise.all([
        getCycleSymptomPatterns(),
        getCycleSymptomHistory(),
      ]);

      if (patternsResponse.success && patternsResponse.data.patterns) {
        // Transform patterns to RecentPattern format
        const transformedPatterns: RecentPattern[] =
          patternsResponse.data.patterns.map((pattern: CycleSymptomPattern) => ({
            symptom: pattern.symptom,
            severity:
              pattern.severity.charAt(0).toUpperCase() +
              pattern.severity.slice(1),
            trendIcon: images.btTrackActive, // Use existing icon
          }));
        setRecentPatterns(transformedPatterns);
      }

      if (historyResponse.success && historyResponse.data) {
        // Transform history items
        const transformedHistory: HistoryItem[] = historyResponse.data.map(
          (item: CycleSymptomHistoryItem) => ({
            day: item.day,
            date: item.date,
            phase: item.phase,
            symptoms: item.symptoms,
            note: item.note,
          }),
        );

        // Check if there are any symptoms in the full history
        setHasAnySymptoms(transformedHistory.length > 0);

        // Filter to last 7 days
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');
        const lastSeven = transformedHistory.filter((item) => {
          const itemDate = moment(item.date).startOf('day');
          return itemDate.isSameOrAfter(sevenDaysAgo);
        });
        setLastSevenDays(lastSeven);
      } else {
        // If history response failed or has no data, set hasAnySymptoms to false
        setHasAnySymptoms(false);
      }
    } catch (error: any) {
      console.error('Error fetching symptom data:', error);
      // Don't show alert for empty state, just set empty arrays
      setRecentPatterns([]);
      setLastSevenDays([]);
      setHasAnySymptoms(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogSymptom = () => {
    setShowLogModal(true);
  };

  const handleSymptomLogged = () => {
    // Refresh data after logging
    fetchData();
    if (onLogSymptom) {
      onLogSymptom();
    }
  };

  const handleViewFullHistory = () => {
    navigation.navigate('SymptomHistory');
  };

  const getColorBySeverity = (severity: string) => {
    switch (severity.toLowerCase()) {
      // Physical symptoms
      case 'severe':
        return '#E85C5C';
      case 'moderate':
        return '#E68C3A';
      case 'mild':
        return '#5DBB63';
      // Energy
      case 'high':
        return '#5DBB63';
      case 'medium':
        return '#E68C3A';
      case 'low':
        return '#E85C5C';
      // Mood/Focus
      case 'good':
        return '#5DBB63';
      case 'neutral':
      case 'fair':
        return '#E68C3A';
      case 'poor':
        return '#E85C5C';
      default:
        return colors.black;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Symptom Trends</Text>
            <Text style={styles.subtitle}>Track patterns across your cycle</Text>
          </View>
          <TouchableOpacity
            style={styles.logButton}
            onPress={handleLogSymptom}
          >
            <Text style={styles.logButtonText}>Log Symptom</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.subtitle,
            { fontFamily: 'Inter-Medium', marginTop: 13 },
          ]}
        >
          RECENT PATTERNS
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.green} />
          <Text style={styles.loadingText}>Loading patterns...</Text>
        </View>
      ) : recentPatterns.length === 0 && !hasAnySymptoms ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No symptoms logged yet. Log your first symptom to start tracking.
          </Text>
        </View>
      ) : recentPatterns.length === 0 && hasAnySymptoms ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No recent symptoms. Symptom trends show patterns from the last 7 days. View full history to see all your symptoms.
          </Text>
        </View>
      ) : (
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
      )}

      <TouchableOpacity
        onPress={handleViewFullHistory}
        style={styles.dropdown}
      >
        <Text style={styles.title}>View Full History</Text>
        <Image source={images.rightArrow} style={styles.arrowStyle} />
      </TouchableOpacity>

      {lastSevenDays.length > 0 && (
        <>
          <View style={styles.horizontalLine} />
          <View style={{ width: '100%', marginTop: 10 }}>
            {lastSevenDays.map((item, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDay}>
                    {item.day !== null ? `Day ${item.day}` : 'N/A'}
                  </Text>

                  <View style={styles.phasePill}>
                    <Text style={styles.phaseText}>{item.phase}</Text>
                  </View>
                </View>

                <Text style={styles.historyDate}>
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>

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

                {item.note && (
                  <Text style={styles.noteText}>"{item.note}"</Text>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      <SymptomLogModal
        visible={showLogModal}
        onClose={() => setShowLogModal(false)}
        onConfirm={handleSymptomLogged}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
  },
  logButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.heading,
    borderRadius: 20,
    marginLeft: 12,
  },
  logButtonText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.gray,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.gray,
    textAlign: 'center',
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

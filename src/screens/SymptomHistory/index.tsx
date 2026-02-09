import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import {
  getCycleSymptomHistory,
  CycleSymptomHistoryItem,
} from '../../services/api';
import moment from 'moment';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HistoryItem {
  day: number | null;
  date: string;
  phase: string;
  symptoms: Record<string, string>;
  note?: string | null;
}

export default function SymptomHistory() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getCycleSymptomHistory();
      if (response.success && response.data) {
        // Transform history items
        const transformedHistory: HistoryItem[] = response.data.map(
          (item: CycleSymptomHistoryItem) => ({
            day: item.day,
            date: item.date,
            phase: item.phase,
            symptoms: item.symptoms,
            note: item.note,
          }),
        );
        setHistory(transformedHistory);
      }
    } catch (error: any) {
      console.error('Error fetching symptom history:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load symptom history. Please try again.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

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

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <BackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>Symptom History</Text>

          {history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No symptoms logged yet. Start tracking to see your history!
              </Text>
            </View>
          ) : (
            <View style={styles.historyList}>
              {history.map((item, index) => (
                <View key={index} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyHeaderLeft}>
                      <Text style={styles.historyDay}>
                        {item.day !== null ? `Day ${item.day}` : 'N/A'}
                      </Text>
                      <Text style={styles.historyDate}>
                        {moment(item.date).format('MMMM D, YYYY')}
                      </Text>
                    </View>
                    <View style={styles.phasePill}>
                      <Text style={styles.phaseText}>{item.phase}</Text>
                    </View>
                  </View>

                  {Object.entries(item.symptoms).map(([key, value]) => (
                    <View key={key} style={styles.symptomRow}>
                      <Text style={styles.symptomKey}>{key}</Text>
                      <View
                        style={[
                          styles.severityBadge,
                          {
                            backgroundColor: getColorBySeverity(value) + '20',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            { color: getColorBySeverity(value) },
                          ]}
                        >
                          {value}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {item.note && (
                    <View style={styles.noteContainer}>
                      <Text style={styles.noteText}>"{item.note}"</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

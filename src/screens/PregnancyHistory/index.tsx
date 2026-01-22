import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import { getPregnancyHistory, PregnancySymptom } from '../../services/api';
import moment from 'moment';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PregnancyHistory() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<PregnancySymptom[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await getPregnancyHistory();
      if (response.success) {
        setSymptoms(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching pregnancy history:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load pregnancy history. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, []),
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return '#D97706';
      case 'moderate':
        return '#F59E0B';
      case 'mild':
        return '#10B981';
      default:
        return colors.darkGrey;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <BackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Pregnancy History</Text>

          {symptoms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No symptoms logged yet. Log your first symptom from the Pregnancy Dashboard.
              </Text>
            </View>
          ) : (
            <View style={styles.symptomsList}>
              {symptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomCard}>
                  <View style={styles.symptomHeader}>
                    <Text style={styles.symptomName}>{symptom.symptom}</Text>
                    <View
                      style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(symptom.severity) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.severityText,
                          { color: getSeverityColor(symptom.severity) },
                        ]}
                      >
                        {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.symptomDate}>
                    {moment(symptom.date).format('MMMM D, YYYY')}
                  </Text>
                  {symptom.notes && (
                    <Text style={styles.symptomNotes}>{symptom.notes}</Text>
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



import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import Header from '../../components/Header';
import {
  getPeriods,
  getPeriodStatistics,
  deletePeriod,
  Period,
  PeriodFilters,
  PeriodStatisticsResponse,
} from '../../services/api';
import moment from 'moment';
import PeriodListItem from '../../components/PeriodListItem';
import styles from './style';
import { colors } from '../../constants/colors';
import images from '../../constants/images';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';
import { updatePeriod } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CycleHistory() {
  const navigation = useNavigation<NavigationProp>();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [statistics, setStatistics] = useState<
    PeriodStatisticsResponse['data'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const fetchPeriods = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const filters: PeriodFilters = {
        sort: sortOrder,
      };

      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (searchQuery.trim()) filters.search = searchQuery.trim();

      const response = await getPeriods(pageNum, 20, filters);

      if (response.success) {
        if (reset) {
          setPeriods(response.data);
        } else {
          setPeriods(prev => [...prev, ...response.data]);
        }

        setHasMore(
          response.pagination.page < response.pagination.pages,
        );
        setPage(pageNum);
      }
    } catch (error: any) {
      console.error('Error fetching periods:', error);
      Alert.alert('Error', 'Failed to load periods. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getPeriodStatistics();
      if (response.success && response.data) {
        setStatistics(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching statistics:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPeriods(1, true);
      fetchStatistics();
    }, [sortOrder, startDate, endDate, searchQuery]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPeriods(1, true);
    fetchStatistics();
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPeriods(page + 1, false);
    }
  };

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setShowModal(true);
  };

  const handleDeletePeriod = (period: Period) => {
    Alert.alert(
      'Delete Period',
      'Are you sure you want to delete this period? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deletePeriod(period._id);
              if (response.success) {
                Alert.alert('Success', 'Period deleted successfully!');
                fetchPeriods(1, true);
                fetchStatistics();
              }
            } catch (error: any) {
              console.error('Error deleting period:', error);
              Alert.alert(
                'Error',
                error.message || 'Failed to delete period. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const handlePeriodUpdate = async (data: PeriodLogData) => {
    if (!editingPeriod) return;

    try {
      const response = await updatePeriod(editingPeriod._id, {
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        flow: data.flow,
        symptoms: data.symptoms,
        notes: data.notes,
      });

      if (response.success) {
        Alert.alert('Success', 'Period updated successfully!');
        setEditingPeriod(null);
        setShowModal(false);
        fetchPeriods(1, true);
        fetchStatistics();
      }
    } catch (error: any) {
      console.error('Error updating period:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update period. Please try again.',
      );
    }
  };

  const formatDateRange = (statistics: PeriodStatisticsResponse['data']) => {
    if (!statistics?.dateRange) return '—';
    const first = moment(statistics.dateRange.firstPeriodDate).format('MMM YYYY');
    const last = moment(statistics.dateRange.lastPeriodDate).format('MMM YYYY');
    return `${first} - ${last}`;
  };

  const renderPeriodItem = ({ item }: { item: Period }) => (
    <PeriodListItem
      period={item}
      onEdit={() => handleEditPeriod(item)}
      onDelete={() => handleDeletePeriod(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {searchQuery || startDate || endDate
          ? 'No periods match your filters'
          : 'No periods logged yet'}
      </Text>
      <Text style={styles.emptyStateSubtext}>
        {searchQuery || startDate || endDate
          ? 'Try adjusting your search or date range'
          : 'Start tracking your cycle by logging your first period'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <View style={styles.content}>
        {/* Statistics Summary */}
        {statistics && statistics.totalPeriods && statistics.totalPeriods > 0 && (
          <View style={styles.statisticsCard}>
            <View style={styles.statisticsHeader}>
              <Text style={styles.statisticsTitle}>Summary</Text>
            </View>
            <View style={styles.statisticsRow}>
              <View style={styles.statisticItem}>
                <Text style={styles.statisticValue}>
                  {statistics.totalPeriods}
                </Text>
                <Text style={styles.statisticLabel}>Total Periods</Text>
              </View>
              {statistics.cycleLength?.average && (
                <View style={styles.statisticItem}>
                  <Text style={styles.statisticValue}>
                    {statistics.cycleLength.average}
                  </Text>
                  <Text style={styles.statisticLabel}>Avg Cycle (days)</Text>
                </View>
              )}
              {statistics.periodLength?.average && (
                <View style={styles.statisticItem}>
                  <Text style={styles.statisticValue}>
                    {statistics.periodLength.average}
                  </Text>
                  <Text style={styles.statisticLabel}>Avg Period (days)</Text>
                </View>
              )}
            </View>
            <Text style={styles.dateRangeText}>
              Tracked from {formatDateRange(statistics)}
            </Text>
          </View>
        )}

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search symptoms or notes..."
            placeholderTextColor={colors.darkGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => fetchPeriods(1, true)}
          />
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() =>
                setSortOrder(prev => (prev === 'newest' ? 'oldest' : 'newest'))
              }
            >
              <Text style={styles.sortButtonText}>
                Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Period List */}
        {loading && periods.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={periods}
            renderItem={renderPeriodItem}
            keyExtractor={item => item._id}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
              />
            }
            contentContainerStyle={
              periods.length === 0 ? styles.emptyListContainer : undefined
            }
          />
        )}
      </View>

      <PeriodStartModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPeriod(null);
        }}
        onConfirm={handlePeriodUpdate}
        editingPeriod={editingPeriod}
      />
    </SafeAreaView>
  );
}


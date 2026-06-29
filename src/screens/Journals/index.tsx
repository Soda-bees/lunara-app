import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styles from './style';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { FlatList } from 'react-native';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import BackButton from '../../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { JournalType } from '../../types';
import TouchAnimation from '../../components/TouchAnimation';
import { useJournal } from '../../context/JournalContext';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Journals'>;

const Journals = () => {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const { journals, loading, refreshing, error, refreshJournals } =
    useJournal();
  const { isPartnerMode } = usePartnerMode();

  useFocusEffect(
    useCallback(() => {
      void refreshJournals();
    }, [refreshJournals]),
  );

  const sortJournals = (journals: JournalType[]) => {
    return [...journals]
      .reverse()
      .sort((a, b) => (a.pin === b.pin ? 0 : a.pin ? -1 : 1));
  };
  const allJournals = useMemo(() => sortJournals(journals), [journals]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', { weekday: 'long' });

    return `${day} ${month} ${year} ${weekday}`;
  }

  const handleWriteANote = () => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    navigation.navigate('WriteJournal', {});
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);

    return parts.join('');
  };

  const truncateText = (text: string = '', maxLength: number = 80) => {
    if (!text) return '';

    // 1. Trim leading/trailing spaces
    let cleanedText = text.trim();

    // 2. Replace multiple spaces/newlines with a single space
    cleanedText = cleanedText.replace(/\s+/g, ' ');

    // 3. Truncate safely
    return cleanedText.length > maxLength
      ? cleanedText.substring(0, maxLength) + '...more'
      : cleanedText;
  };

  const renderItem = ({ item }: { item: JournalType }) => (
    <TouchAnimation
      containerStyle={styles.notificationCard}
      slow
      onPress={() => navigation.navigate('Journal', { id: item._id })}
    >
      <LinearGradient
        colors={['#FFEED3', '#FFD8E2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.dateContainer}
      >
        <Text style={styles.dateText}>{formatDate(item?.createdAt)}</Text>
        {item.pin && <Text style={styles.dateText}>Pinned</Text>}
      </LinearGradient>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          {highlightText(item?.title || '', search)}
        </Text>
        <Text style={styles.message}>
          {truncateText(item?.description, 80)}
        </Text>
      </View>
    </TouchAnimation>
  );

  const filteredJournals = allJournals.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SoftGradientBackground>
      <BackButton />
      <View style={styles.searchContainer}>
        <Image source={images.searchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          onChangeText={text => {
            setSearch(text);
          }}
          placeholder="Search"
          placeholderTextColor={colors.disabledText}
        />
      </View>
      <View style={styles.mainContainer}>
        {loading && journals.length === 0 ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 24 }}
          />
        ) : error && journals.length === 0 ? (
          <Text
            style={{
              color: colors.disabledText,
              alignSelf: 'center',
              marginTop: 24,
              textAlign: 'center',
              paddingHorizontal: 16,
            }}
          >
            {error}
          </Text>
        ) : (
          <FlatList
            data={filteredJournals}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshing={refreshing}
            onRefresh={refreshJournals}
            ListEmptyComponent={
              <Text
                style={{
                  color: colors.disabledText,
                  alignSelf: 'center',
                }}
              >
                {search
                  ? 'No results found.'
                  : 'You haven’t added any journals yet.'}
              </Text>
            }
          />
        )}
      </View>
      {!isPartnerMode && (
        <TouchableOpacity
          style={styles.addJournalIconContainer}
          onPress={handleWriteANote}
        >
          <Image source={images.addJournalIcon} style={styles.addJournalIcon} />
        </TouchableOpacity>
      )}
    </SoftGradientBackground>
  );
};

export default Journals;

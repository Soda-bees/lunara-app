import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { useCycleData } from '../../context/CycleDataContext';
import { useSleepData } from '../../context/SleepDataContext';

/** Debounce showing offline to reduce flaky-network flicker (MOB-032). */
const OFFLINE_DEBOUNCE_MS = 800;

function formatLastUpdated(ts: number | null): string | null {
  if (!ts) return null;
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * Non-blocking offline strip. Uses MOB-031 snapshot timestamps when present.
 */
export default function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);
  const { cycleStatus } = useCycleData();
  const { statistics } = useSleepData();

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const unsub = NetInfo.addEventListener(state => {
      const isOffline = state.isConnected === false;

      if (isOffline) {
        if (showTimer) clearTimeout(showTimer);
        showTimer = setTimeout(() => {
          setOffline(true);
        }, OFFLINE_DEBOUNCE_MS);
        return;
      }

      if (showTimer) {
        clearTimeout(showTimer);
        showTimer = null;
      }
      setOffline(false);
    });

    return () => {
      unsub();
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  if (!offline) {
    return null;
  }

  const cycleLabel = formatLastUpdated(cycleStatus.lastFetchedAt);
  const sleepLabel = formatLastUpdated(statistics.lastFetchedAt);
  const staleParts: string[] = [];
  if (cycleLabel) staleParts.push(`Cycle ${cycleLabel}`);
  if (sleepLabel) staleParts.push(`Sleep ${sleepLabel}`);

  return (
    <View
      pointerEvents="none"
      style={[styles.banner, { paddingTop: Math.max(insets.top, 8) }]}
      accessibilityRole="text"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.title}>You're offline</Text>
      <Text style={styles.subtitle}>
        {staleParts.length > 0
          ? `Showing saved data · ${staleParts.join(' · ')}`
          : 'Changes will sync when you reconnect'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    paddingBottom: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  subtitle: {
    color: colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    marginTop: 2,
    opacity: 0.9,
    textAlign: 'center',
  },
});

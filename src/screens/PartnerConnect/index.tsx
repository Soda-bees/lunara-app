import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import {
  disconnectPartner,
  generatePartnerCode,
  getPartnerStatus,
  type PartnerStatusResponse,
} from '../../services/api';
import { STALE_TIME_MS } from '../../types/fetchState';
import {
  clearStoredPartnerCode,
  getStoredPartnerCode,
  persistPartnerCode,
} from '../../utils/partnerCodeStorage';
import styles from './style';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PartnerConnect() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<PartnerStatusResponse | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string | null>(null);
  const statusRef = useRef<PartnerStatusResponse | null>(null);
  const lastFetchedAtRef = useRef<number | null>(null);
  statusRef.current = status;

  const loadStatus = useCallback(async (options?: { force?: boolean }) => {
    const cached = statusRef.current;
    const now = Date.now();
    if (
      !options?.force &&
      cached &&
      lastFetchedAtRef.current &&
      now - lastFetchedAtRef.current < STALE_TIME_MS
    ) {
      return;
    }

    if (!cached) {
      setLoading(true);
    }
    try {
      const res = await getPartnerStatus();
      setStatus(res);
      lastFetchedAtRef.current = Date.now();

      if (res.partnerSessionActive || !res.hasActiveCode) {
        await clearStoredPartnerCode();
        setGeneratedCode(null);
        setCodeExpiresAt(null);
      } else {
        const stored = await getStoredPartnerCode();
        if (stored) {
          setGeneratedCode(stored.code);
          setCodeExpiresAt(stored.expiresAt);
        } else {
          setCodeExpiresAt(res.codeExpiresAt);
        }
      }
    } catch (error: any) {
      if (!cached) {
        Alert.alert(
          'Error',
          error?.message || 'Could not load partner status.',
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatus();
    }, [loadStatus]),
  );

  const handleGenerate = async (regenerate = false) => {
    const run = async () => {
      setGenerating(true);
      try {
        const res = await generatePartnerCode();
        setGeneratedCode(res.code);
        setCodeExpiresAt(res.expiresAt);
        await persistPartnerCode(res.code, res.expiresAt);
        await loadStatus({ force: true });
        Alert.alert(
          regenerate ? 'New code generated' : 'Code generated',
          regenerate
            ? 'Your previous partner session was ended. Share the new code.'
            : 'Share this code with your partner. It expires in 2 days.',
        );
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Could not generate code.');
      } finally {
        setGenerating(false);
      }
    };

    if (regenerate) {
      Alert.alert(
        'Regenerate code?',
        'This will log out any connected partner and create a new code.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Regenerate', style: 'destructive', onPress: run },
        ],
      );
      return;
    }

    await run();
  };

  const handleShare = async () => {
    if (!generatedCode) return;
    const message = `Join my Lunara partner view with code: ${generatedCode}`;
    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Partner code', generatedCode);
    }
  };

  const handleCopy = () => {
    if (!generatedCode) return;
    Alert.alert('Partner code', generatedCode, [
      { text: 'OK' },
      {
        text: 'Share',
        onPress: () => {
          void Share.share({ message: generatedCode });
        },
      },
    ]);
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect partner?',
      'Your partner will lose access on their next action.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              await disconnectPartner();
              await loadStatus({ force: true });
              Alert.alert('Disconnected', 'Partner access has been revoked.');
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Could not disconnect.');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" />
      <BackButton />
      <View style={styles.mainContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Connect Partner</Text>
            <Text style={styles.paraText}>
              Generate a 7-day code so your partner can view your Lunara data in
              read-only mode.
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#E4AF5D" />
          ) : (
            <>
              <View style={styles.statusCard}>
                <Text style={styles.statusLabel}>Partner status</Text>
                <Text style={styles.statusValue}>
                  {status?.partnerSessionActive
                    ? `Connected since ${formatDate(status.partnerConnectedAt)}`
                    : 'No partner connected'}
                </Text>
                {status?.hasActiveCode && (
                  <>
                    <Text style={[styles.statusLabel, { marginTop: 12 }]}>
                      Active code expires
                    </Text>
                    <Text style={styles.statusValue}>
                      {formatDate(status.codeExpiresAt)}
                    </Text>
                  </>
                )}
              </View>

              {generatedCode && (
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{generatedCode}</Text>
                  <Text style={styles.codeHint}>
                    Expires {formatDate(codeExpiresAt)}
                  </Text>
                </View>
              )}

              <View style={styles.actionRow}>
                <Button
                  title={
                    generating
                      ? 'Generating...'
                      : generatedCode || status?.hasActiveCode
                        ? 'Regenerate code'
                        : 'Generate code'
                  }
                  onPress={() =>
                    handleGenerate(
                      Boolean(generatedCode || status?.hasActiveCode),
                    )
                  }
                  disabled={generating}
                />
                {generatedCode && (
                  <>
                    <Button title="Share code" onPress={handleShare} />
                    <Button title="Copy code" onPress={handleCopy} />
                  </>
                )}
                {status?.partnerSessionActive && (
                  <Button
                    title="Disconnect partner"
                    onPress={handleDisconnect}
                    disabled={false}
                  />
                )}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

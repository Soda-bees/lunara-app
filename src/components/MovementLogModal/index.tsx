import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';
import {
  createCustomWorkoutApi,
  deleteCustomWorkoutApi,
  getWorkoutLibrary,
  updateCustomWorkoutApi,
  type Workout,
} from '../../services/api';
import type { RitualSection } from '../../utils/ritualSections';
import CustomWorkoutPreview from './CustomWorkoutPreview';
import WorkoutLibraryRow from './WorkoutLibraryRow';
import styles from './style';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: {
    workoutId: string;
    durationMinutes: number;
  }) => Promise<void>;
};

export default function MovementLogModal({ visible, onClose, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'library' | 'custom'>('library');
  const [library, setLibrary] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [durationText, setDurationText] = useState('30');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customRitualSection, setCustomRitualSection] =
    useState<RitualSection>('midday');
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeCustomTitle = (value: string) => {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const titleKey = (value: string) =>
    value.trim().replace(/\s+/g, ' ').toLowerCase();

  const resetModalState = () => {
    setMode('library');
    setDurationText('30');
    setCustomTitle('');
    setCustomDescription('');
    setCustomRitualSection('midday');
    setEditingWorkoutId(null);
    setError(null);
    setSaving(false);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const loadLibrary = useCallback(async () => {
    const res = await getWorkoutLibrary();
    if (res.success) {
      const data = res.data || [];
      setLibrary(data);
      return data;
    }
    return [];
  }, []);

  useEffect(() => {
    if (!visible) return;
    resetModalState();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadLibrary();
        if (data.length > 0) {
          setSelectedWorkoutId(data[0]._id);
          setDurationText(String(data[0].duration || 30));
        }
      } catch (e: any) {
        setError(e?.message || 'Unable to load workout library.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [visible, loadLibrary]);

  const durationMinutes = useMemo(() => {
    const parsed = Number(durationText);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(1, Math.min(600, Math.round(parsed)));
  }, [durationText]);

  const normalizedCustomTitle = useMemo(
    () => normalizeCustomTitle(customTitle),
    [customTitle],
  );

  const existingCustomByTitle = useMemo(() => {
    if (!normalizedCustomTitle || editingWorkoutId) return null;
    const key = titleKey(normalizedCustomTitle);
    return (
      library.find(
        w =>
          w.isCustom && titleKey(w.title) === key && w._id !== editingWorkoutId,
      ) ?? null
    );
  }, [library, normalizedCustomTitle, editingWorkoutId]);

  const existingSeededByTitle = useMemo(() => {
    if (!normalizedCustomTitle) return null;
    const key = titleKey(normalizedCustomTitle);
    return library.find(w => !w.isCustom && titleKey(w.title) === key) ?? null;
  }, [library, normalizedCustomTitle]);

  const handleSelectWorkout = useCallback((workout: Workout) => {
    setSelectedWorkoutId(workout._id);
    setDurationText(String(workout.duration || 30));
  }, []);

  const startEditCustomWorkout = useCallback((workout: Workout) => {
    setEditingWorkoutId(workout._id);
    setCustomTitle(workout.title);
    setCustomDescription(workout.description || '');
    setCustomRitualSection(workout.ritualSection || 'midday');
    setDurationText(String(workout.duration || 30));
    setMode('custom');
    setError(null);
  }, []);

  const performDeleteCustomWorkout = useCallback(
    async (workout: Workout) => {
      try {
        setSaving(true);
        await deleteCustomWorkoutApi(workout._id);
        const data = await loadLibrary();
        if (selectedWorkoutId === workout._id) {
          if (data.length > 0) {
            setSelectedWorkoutId(data[0]._id);
            setDurationText(String(data[0].duration || 30));
          } else {
            setSelectedWorkoutId('');
          }
        }
        Alert.alert('Deleted', 'Custom workout removed from your library.');
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Unable to delete custom workout.');
      } finally {
        setSaving(false);
      }
    },
    [loadLibrary, selectedWorkoutId],
  );

  const handleDeleteCustomWorkout = useCallback(
    (workout: Workout) => {
      Alert.alert(
        'Delete custom workout?',
        `"${workout.title}" will be removed from your library. Past movement logs will keep their recorded names.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              performDeleteCustomWorkout(workout).catch(() => {});
            },
          },
        ],
      );
    },
    [performDeleteCustomWorkout],
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (durationMinutes <= 0) {
        setError('Please enter a valid duration in minutes.');
        return;
      }

      let workoutId = selectedWorkoutId;
      let reusedExistingCustom = false;

      if (mode === 'custom') {
        if (!normalizedCustomTitle) {
          setError('Please enter a custom workout name.');
          return;
        }

        if (existingSeededByTitle) {
          setError(
            'This name matches a library workout. Pick it from Workout Library or use a different name.',
          );
          return;
        }

        if (editingWorkoutId) {
          const updateRes = await updateCustomWorkoutApi(editingWorkoutId, {
            title: normalizedCustomTitle,
            durationMinutes,
            description: customDescription.trim() || undefined,
            ritualSection: customRitualSection,
          });
          if (!updateRes.success || !updateRes.data?._id) {
            setError('Unable to update custom workout.');
            return;
          }
          workoutId = updateRes.data._id;
          await loadLibrary();
        } else if (existingCustomByTitle?._id) {
          workoutId = existingCustomByTitle._id;
          reusedExistingCustom = true;
        } else {
          const customRes = await createCustomWorkoutApi({
            title: normalizedCustomTitle,
            durationMinutes,
            description: customDescription.trim() || undefined,
            ritualSection: customRitualSection,
          });
          if (!customRes.success || !customRes.data?._id) {
            setError('Unable to create custom workout.');
            return;
          }
          workoutId = customRes.data._id;
          reusedExistingCustom = Boolean(customRes.reusedExisting);
          await loadLibrary();
        }
      }

      if (!workoutId) {
        setError('Please select a workout.');
        return;
      }

      await onSave({ workoutId, durationMinutes });

      if (reusedExistingCustom) {
        const title = existingCustomByTitle?.title || normalizedCustomTitle;
        Alert.alert(
          'Using existing workout',
          `You already have "${title}" in your library. That workout was logged.`,
        );
      }

      handleClose();
    } catch (e: any) {
      setError(e?.message || 'Unable to save movement log.');
    } finally {
      setSaving(false);
    }
  };

  const saveButtonLabel = useMemo(() => {
    if (saving) return 'Saving...';
    if (mode === 'custom' && editingWorkoutId) return 'Update';
    return 'Save';
  }, [saving, mode, editingWorkoutId]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      style={styles.modal}
      swipeDirection="down"
      onSwipeComplete={handleClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Log Movement</Text>
        <View style={styles.contentArea}>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'library' && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode('library');
                setEditingWorkoutId(null);
                setError(null);
              }}
            >
              <Text style={styles.modeText}>Workout Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'custom' && styles.modeButtonActive,
              ]}
              onPress={() => {
                setMode('custom');
                if (!editingWorkoutId) {
                  setCustomTitle('');
                  setCustomDescription('');
                  setCustomRitualSection('midday');
                }
                setError(null);
              }}
            >
              <Text style={styles.modeText}>
                {editingWorkoutId ? 'Edit Custom' : 'Custom Workout'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectionArea}>
            {loading ? (
              <View style={styles.loadingArea}>
                <ActivityIndicator color={colors.heading} />
              </View>
            ) : mode === 'library' ? (
              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              >
                {library.map(item => (
                  <WorkoutLibraryRow
                    key={item._id}
                    workout={item}
                    selected={selectedWorkoutId === item._id}
                    onPress={handleSelectWorkout}
                    onEdit={
                      item.isCustom ? startEditCustomWorkout : undefined
                    }
                    onDelete={
                      item.isCustom ? handleDeleteCustomWorkout : undefined
                    }
                    actionsDisabled={saving}
                  />
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.customWrap}>
                  {existingCustomByTitle ? (
                    <View style={styles.noticeBanner}>
                      <Text style={styles.noticeBannerText}>
                        You already have this workout in your library. Saving
                        will log that workout.
                      </Text>
                    </View>
                  ) : null}
                  {existingSeededByTitle ? (
                    <View style={styles.noticeBanner}>
                      <Text style={styles.noticeBannerText}>
                        This name matches a library workout. Choose a different
                        name or select it from Workout Library.
                      </Text>
                    </View>
                  ) : null}
                  <Text style={styles.sectionLabel}>Time of day</Text>
                  <View style={styles.sectionRow}>
                    {(
                      [
                        ['morning', 'Morning'],
                        ['midday', 'Midday'],
                        ['evening', 'Evening'],
                      ] as const
                    ).map(([value, label]) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.sectionChip,
                          customRitualSection === value &&
                            styles.sectionChipActive,
                        ]}
                        onPress={() => setCustomRitualSection(value)}
                      >
                        <Text
                          style={[
                            styles.sectionChipText,
                            customRitualSection === value &&
                              styles.sectionChipTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    value={customTitle}
                    onChangeText={setCustomTitle}
                    placeholder="Workout name"
                    placeholderTextColor={colors.placeholderColor}
                    style={styles.input}
                  />
                  <TextInput
                    value={customDescription}
                    onChangeText={setCustomDescription}
                    placeholder="Optional description"
                    placeholderTextColor={colors.placeholderColor}
                    style={styles.input}
                  />
                  <CustomWorkoutPreview
                    title={customTitle}
                    description={customDescription}
                    durationMinutes={durationMinutes}
                    ritualSection={customRitualSection}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.bottomRowGroup}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              value={durationText}
              onChangeText={setDurationText}
              placeholder="min"
              placeholderTextColor={colors.placeholderColor}
              keyboardType="number-pad"
              style={styles.durationInput}
            />
          </View>
          <View style={styles.bottomRowGroup}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.cancelBtn}
              disabled={saving}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={styles.saveBtn}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saveButtonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </Modal>
  );
}

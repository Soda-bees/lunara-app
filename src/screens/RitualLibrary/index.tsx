import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../constants/colors';
import {
  deleteCustomRitual,
  getRitualDefinitions,
  getRitualPreferences,
  postCustomRitual,
  putRitualPreferences,
  type RitualDefinitionDto,
  type RitualSection,
  type UserRitualPreferenceDto,
} from '../../services/api';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import BackButton from '../../components/BackButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'RitualLibrary'>;

const SECTIONS: RitualSection[] = ['morning', 'midday', 'evening'];

const sectionRank: Record<RitualSection, number> = {
  morning: 0,
  midday: 1,
  evening: 2,
};

type RitualNoteInputProps = {
  ritualKey: string;
  userNote: string;
  disabled: boolean;
  onCommit: (ritualKey: string, note: string) => void;
};

function RitualPreferenceNoteInput({
  ritualKey,
  userNote,
  disabled,
  onCommit,
}: RitualNoteInputProps) {
  const [text, setText] = useState(userNote ?? '');

  useEffect(() => {
    setText(userNote ?? '');
  }, [ritualKey, userNote]);

  const handleBlur = () => {
    const trimmed = text.trim();
    const prev = (userNote ?? '').trim();
    if (trimmed !== prev) {
      onCommit(ritualKey, trimmed);
    }
  };

  return (
    <TextInput
      style={styles.input}
      placeholder="A short note for you—only if helpful"
      value={text}
      onChangeText={setText}
      onBlur={handleBlur}
      editable={!disabled}
      maxLength={500}
    />
  );
}

export default function RitualLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const [definitions, setDefinitions] = useState<RitualDefinitionDto[]>([]);
  const [preferences, setPreferences] = useState<UserRitualPreferenceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedPhaseKey, setExpandedPhaseKey] = useState<string | null>(null);
  const [addTarget, setAddTarget] = useState<RitualDefinitionDto | null>(null);
  const [addSection, setAddSection] = useState<RitualSection>('morning');
  const [addNote, setAddNote] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createSection, setCreateSection] = useState<RitualSection>('morning');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [dRes, pRes] = await Promise.all([
        getRitualDefinitions(),
        getRitualPreferences(),
      ]);
      if (dRes.success && Array.isArray(dRes.data)) {
        setDefinitions(dRes.data);
      }
      if (pRes.success && Array.isArray(pRes.data)) {
        setPreferences(pRes.data);
      }
    } catch (e: any) {
      Alert.alert('Unable to load', e?.message || 'Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load().catch(() => {});
    }, [load]),
  );

  const persist = async (next: UserRitualPreferenceDto[]): Promise<boolean> => {
    try {
      setSaving(true);
      const res = await putRitualPreferences(next);
      if (res.success && Array.isArray(res.data)) {
        setPreferences(res.data);
        return true;
      }
      Alert.alert('Error', 'Could not save ritual preferences.');
      return false;
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Save failed.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const optionalCatalog = useMemo(() => {
    return definitions
      .filter(d => !d.isCore && d.isActive)
      .sort((a, b) => {
        const da = sectionRank[a.defaultSection];
        const db = sectionRank[b.defaultSection];
        if (da !== db) return da - db;
        const ac = a.isCustom ? 1 : 0;
        const bc = b.isCustom ? 1 : 0;
        if (ac !== bc) return ac - bc;
        return (a.defaultSortOrder ?? 0) - (b.defaultSortOrder ?? 0);
      });
  }, [definitions]);

  const prefKeys = useMemo(
    () => new Set(preferences.map(p => p.ritualKey)),
    [preferences],
  );

  const availableToAdd = useMemo(
    () => optionalCatalog.filter(d => !prefKeys.has(d.keyId)),
    [optionalCatalog, prefKeys],
  );

  const togglePhaseDetail = (key: string) => {
    setExpandedPhaseKey(prev => (prev === key ? null : key));
  };

  const renderPhaseBlock = (
    key: string,
    def: RitualDefinitionDto | undefined,
  ) => {
    if (!def?.phaseFitLabel && !def?.phaseFitWhy) return null;
    const expanded = expandedPhaseKey === key;
    return (
      <>
        {def.phaseFitLabel ? (
          <Text style={styles.phaseLabel}>{def.phaseFitLabel}</Text>
        ) : null}
        {def.phaseFitWhy ? (
          <>
            <TouchableOpacity
              onPress={() => togglePhaseDetail(key)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Text style={styles.phaseToggle}>
                {expanded ? 'Hide why phases' : 'Why these phases?'}
              </Text>
            </TouchableOpacity>
            {expanded ? (
              <Text style={styles.phaseWhy}>{def.phaseFitWhy}</Text>
            ) : null}
          </>
        ) : null}
      </>
    );
  };

  const openAddModal = (def: RitualDefinitionDto) => {
    setAddTarget(def);
    setAddSection(def.defaultSection);
    setAddNote('');
  };

  const closeAddModal = () => {
    setAddTarget(null);
  };

  const confirmAddRitual = async () => {
    if (!addTarget) return;
    const next: UserRitualPreferenceDto[] = [
      ...preferences,
      {
        ritualKey: addTarget.keyId,
        section: addSection,
        userNote: addNote.trim(),
        sortIndex: preferences.length,
        enabled: true,
      },
    ];
    const ok = await persist(next);
    if (ok) closeAddModal();
  };

  const removeRitual = (ritualKey: string) => {
    persist(preferences.filter(p => p.ritualKey !== ritualKey)).catch(() => {});
  };

  const setSection = (ritualKey: string, section: RitualSection) => {
    persist(
      preferences.map(p => (p.ritualKey === ritualKey ? { ...p, section } : p)),
    ).catch(() => {});
  };

  const setNote = (ritualKey: string, userNote: string) => {
    persist(
      preferences.map(p =>
        p.ritualKey === ritualKey ? { ...p, userNote } : p,
      ),
    ).catch(() => {});
  };

  const openCreateModal = () => {
    setCreateTitle('');
    setCreateDesc('');
    setCreateSection('morning');
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const submitCreateCustom = async () => {
    const t = createTitle.trim();
    if (!t) {
      Alert.alert('Title required', 'Give your ritual a short name.');
      return;
    }
    try {
      setSaving(true);
      const res = await postCustomRitual({
        title: t,
        description: createDesc.trim() || undefined,
        defaultSection: createSection,
      });
      if (res.success && res.data) {
        await load();
        closeCreateModal();
      } else {
        Alert.alert('Could not create', res.message || 'Try again.');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create ritual.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteCustom = (def: RitualDefinitionDto) => {
    Alert.alert(
      'Delete custom ritual?',
      'It is removed from your library. If it is on your day, it is removed there too.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCustomRitual(def.keyId)
              .then(res => {
                if (res.success) {
                  load().catch(() => {});
                } else {
                  Alert.alert('Error', res.message || 'Delete failed.');
                }
              })
              .catch((e: any) =>
                Alert.alert('Error', e?.message || 'Delete failed.'),
              );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackButton />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Ritual library</Text>
        <Text style={styles.sub}>
          Add optional rituals to your day, place them in morning, midday, or
          evening, and remove them anytime. Core rituals (sleep, symptoms,
          meals, workouts) stay on Home automatically.
        </Text>
        <Text style={styles.disclaimer}>
          Supplements and herbs are personal; follow your clinician or label.
          Lunara does not recommend doses.
        </Text>

        {loading ? (
          <ActivityIndicator color={colors.heading} style={styles.loader} />
        ) : null}

        {saving ? <Text style={styles.saving}>Saving…</Text> : null}

        <Text style={styles.sectionLabel}>Browse optional</Text>
        <TouchableOpacity
          style={styles.createOutlineBtn}
          onPress={openCreateModal}
          disabled={saving || loading}
        >
          <Text style={styles.createOutlineBtnText}>+ Create custom ritual</Text>
        </TouchableOpacity>
        {availableToAdd.length === 0 && !loading ? (
          <Text style={styles.muted}>You’ve added all available rituals.</Text>
        ) : null}
        {availableToAdd.map(def => (
          <View key={def.keyId} style={styles.card}>
            <View style={styles.cardBody}>
              {def.isCustom ? (
                <Text style={styles.customTag}>Custom</Text>
              ) : null}
              <Text style={styles.cardTitle}>{def.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={4}>
                {def.description}
              </Text>
              {renderPhaseBlock(def.keyId, def)}
            </View>
            <View style={styles.cardActionsCol}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => openAddModal(def)}
                disabled={saving}
              >
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
              {def.isCustom ? (
                <TouchableOpacity
                  onPress={() => confirmDeleteCustom(def)}
                  disabled={saving}
                  style={styles.deleteCustomBrowse}
                >
                  <Text style={styles.deleteCustomBrowseText}>Delete custom</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))}

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
          Your optional rituals
        </Text>
        {preferences.length === 0 && !loading ? (
          <Text style={styles.muted}>
            Nothing added yet. Pick one or two that feel supportive—not
            required.
          </Text>
        ) : null}
        {preferences.map(pref => {
          const def = definitions.find(d => d.keyId === pref.ritualKey);
          return (
            <View key={pref.ritualKey} style={styles.cardCol}>
              <Text style={styles.cardTitle}>
                {def?.title || pref.ritualKey}
              </Text>
              {def ? renderPhaseBlock(`mine-${pref.ritualKey}`, def) : null}
              <Text style={styles.rowLabel}>Time of day</Text>
              <View style={styles.segRow}>
                {SECTIONS.map((sec, idx) => (
                  <TouchableOpacity
                    key={sec}
                    style={[
                      styles.segBtn,
                      pref.section === sec && styles.segBtnOn,
                      idx === SECTIONS.length - 1 && styles.segBtnLast,
                    ]}
                    onPress={() => setSection(pref.ritualKey, sec)}
                    disabled={saving}
                  >
                    <Text
                      style={[
                        styles.segBtnText,
                        pref.section === sec && styles.segBtnTextOn,
                      ]}
                    >
                      {sec === 'midday'
                        ? 'Midday'
                        : sec.charAt(0).toUpperCase() + sec.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.rowLabel}>Personal note (optional)</Text>
              <RitualPreferenceNoteInput
                ritualKey={pref.ritualKey}
                userNote={pref.userNote ?? ''}
                disabled={saving}
                onCommit={setNote}
              />
              <TouchableOpacity
                onPress={() => removeRitual(pref.ritualKey)}
                disabled={saving}
              >
                <Text style={styles.remove}>Remove from my day</Text>
              </TouchableOpacity>
              {def?.isCustom ? (
                <TouchableOpacity
                  onPress={() => def && confirmDeleteCustom(def)}
                  disabled={saving}
                >
                  <Text style={styles.deleteCustomEntirely}>
                    Delete custom ritual entirely
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={addTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add ritual</Text>
            {addTarget ? (
              <Text style={styles.modalRitualName}>{addTarget.title}</Text>
            ) : null}
            <Text style={styles.modalLabel}>Time of day</Text>
            <View style={styles.segRow}>
              {SECTIONS.map((sec, idx) => (
                <TouchableOpacity
                  key={sec}
                  style={[
                    styles.segBtn,
                    addSection === sec && styles.segBtnOn,
                    idx === SECTIONS.length - 1 && styles.segBtnLast,
                  ]}
                  onPress={() => setAddSection(sec)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.segBtnText,
                      addSection === sec && styles.segBtnTextOn,
                    ]}
                  >
                    {sec === 'midday'
                      ? 'Midday'
                      : sec.charAt(0).toUpperCase() + sec.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.modalLabel}>Personal note (optional)</Text>
            <TextInput
              style={[styles.input, styles.modalNoteInput]}
              placeholder="A short note for you—only if helpful"
              value={addNote}
              onChangeText={setAddNote}
              editable={!saving}
              maxLength={500}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={closeAddModal}
                disabled={saving}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={confirmAddRitual}
                disabled={saving || !addTarget}
              >
                <Text style={styles.modalBtnPrimaryText}>
                  {saving ? 'Saving…' : 'Add to my day'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={createModalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeCreateModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create custom ritual</Text>
            <Text style={styles.modalHint}>
              It appears in your library like other rituals. You can add it to
              your day when you are ready.
            </Text>
            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Evening walk with the dog"
              value={createTitle}
              onChangeText={setCreateTitle}
              editable={!saving}
              maxLength={120}
            />
            <Text style={styles.modalLabel}>Description (optional)</Text>
            <TextInput
              style={[styles.input, styles.modalNoteInput]}
              placeholder="What counts as done for you?"
              value={createDesc}
              onChangeText={setCreateDesc}
              editable={!saving}
              maxLength={500}
              multiline
            />
            <Text style={styles.modalLabel}>Default time of day</Text>
            <View style={styles.segRow}>
              {SECTIONS.map((sec, idx) => (
                <TouchableOpacity
                  key={sec}
                  style={[
                    styles.segBtn,
                    createSection === sec && styles.segBtnOn,
                    idx === SECTIONS.length - 1 && styles.segBtnLast,
                  ]}
                  onPress={() => setCreateSection(sec)}
                  disabled={saving}
                >
                  <Text
                    style={[
                      styles.segBtnText,
                      createSection === sec && styles.segBtnTextOn,
                    ]}
                  >
                    {sec === 'midday'
                      ? 'Midday'
                      : sec.charAt(0).toUpperCase() + sec.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={closeCreateModal}
                disabled={saving}
              >
                <Text style={styles.modalBtnSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={async () => {
                  await submitCreateCustom();
                }}
                disabled={saving}
              >
                <Text style={styles.modalBtnPrimaryText}>
                  {saving ? 'Saving…' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  sub: {
    marginTop: 8,
    fontSize: 13,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  disclaimer: {
    marginTop: 10,
    fontSize: 11,
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  phaseLabel: {
    marginTop: 8,
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    lineHeight: 16,
  },
  phaseToggle: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: colors.green,
  },
  phaseWhy: {
    marginTop: 6,
    fontSize: 11,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  sectionLabel: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  sectionLabelSpaced: {
    marginTop: 24,
  },
  createOutlineBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.heading,
    backgroundColor: colors.headingLight,
  },
  createOutlineBtnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.heading,
  },
  customTag: {
    alignSelf: 'flex-start',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    backgroundColor: colors.headingLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  loader: { marginTop: 24 },
  cardBody: { flex: 1, paddingRight: 8 },
  cardActionsCol: { alignItems: 'center', justifyContent: 'center' },
  deleteCustomBrowse: { marginTop: 8, paddingVertical: 4 },
  deleteCustomBrowseText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: colors.maroonText,
  },
  deleteCustomEntirely: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.maroonText,
  },
  muted: { fontSize: 12, color: colors.disabledText, marginTop: 6 },
  saving: { fontSize: 12, color: colors.heading, marginTop: 8 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  cardCol: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  cardDesc: { fontSize: 12, color: colors.green, marginTop: 4 },
  addBtn: {
    backgroundColor: colors.headingLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.heading,
  },
  addBtnText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  rowLabel: {
    fontSize: 11,
    color: colors.disabledText,
    marginTop: 10,
    marginBottom: 4,
  },
  segRow: { flexDirection: 'row' },
  segBtn: {
    flex: 1,
    marginRight: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
  },
  segBtnLast: {
    marginRight: 0,
  },
  segBtnOn: {
    borderColor: colors.heading,
    backgroundColor: colors.headingLight,
  },
  segBtnText: {
    fontSize: 11,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },
  segBtnTextOn: { fontFamily: 'Inter-Medium', color: colors.heading },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.black,
  },
  remove: {
    marginTop: 12,
    color: colors.maroonText,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  back: { marginTop: 28, alignSelf: 'center' },
  backText: { color: colors.heading, fontFamily: 'Inter-Medium', fontSize: 14 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  modalHint: {
    marginTop: 8,
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  modalRitualName: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.green,
  },
  modalLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.disabledText,
    marginTop: 14,
    marginBottom: 6,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 18,
  },
  modalBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
    marginRight: 8,
  },
  modalBtnSecondaryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
  },
  modalBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.heading,
    alignItems: 'center',
  },
  modalBtnPrimaryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.white,
  },
  modalNoteInput: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
});

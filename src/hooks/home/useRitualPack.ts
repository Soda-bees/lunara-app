import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getRitualDefinitions,
  getRitualPreferences,
  getRitualCompletions,
  postRitualDayToggle,
  type RitualDefinitionDto,
  type UserRitualPreferenceDto,
} from '../../services/api';

export function useRitualPack(todayISO: string) {
  const [ritualDefinitions, setRitualDefinitions] = useState<
    RitualDefinitionDto[]
  >([]);
  const [ritualPreferences, setRitualPreferences] = useState<
    UserRitualPreferenceDto[]
  >([]);
  const [ritualCompletions, setRitualCompletions] = useState<
    Record<string, boolean>
  >({});

  const refreshRitualPack = useCallback(async () => {
    try {
      const [defsRes, prefsRes, compRes] = await Promise.all([
        getRitualDefinitions(),
        getRitualPreferences(),
        getRitualCompletions(todayISO),
      ]);
      if (defsRes.success && Array.isArray(defsRes.data)) {
        setRitualDefinitions(defsRes.data);
      }
      if (prefsRes.success && Array.isArray(prefsRes.data)) {
        setRitualPreferences(prefsRes.data);
      }
      if (compRes.success && compRes.data && typeof compRes.data === 'object') {
        setRitualCompletions(compRes.data);
      }
    } catch {
      // Offline / API missing: keep empty catalog; core still renders from fallbacks
    }
  }, [todayISO]);

  useEffect(() => {
    refreshRitualPack().catch(() => {});
  }, [refreshRitualPack]);

  const defByKey = useMemo(() => {
    const m = new Map<string, RitualDefinitionDto>();
    ritualDefinitions.forEach(d => m.set(d.keyId, d));
    return m;
  }, [ritualDefinitions]);

  const toggleOptionalRitual = useCallback(
    async (ritualKey: string, completed: boolean) => {
      const res = await postRitualDayToggle({
        date: todayISO,
        ritualKey,
        completed,
      });
      if (res.success) {
        setRitualCompletions(prev => ({ ...prev, [ritualKey]: completed }));
      }
    },
    [todayISO],
  );

  return {
    ritualDefinitions,
    ritualPreferences,
    ritualCompletions,
    defByKey,
    refreshRitualPack,
    toggleOptionalRitual,
  };
}

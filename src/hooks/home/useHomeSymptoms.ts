import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getCycleSymptomPatterns,
  getCycleSymptoms,
  type CycleSymptomPattern,
} from '../../services/api';
import type { SymptomSummary } from './types';

export function useHomeSymptoms(todayISO: string) {
  const [symptomsLoading, setSymptomsLoading] = useState(false);
  const [symptomsCountToday, setSymptomsCountToday] = useState<number | null>(
    null,
  );
  const [todaySymptoms, setTodaySymptoms] = useState<
    Array<{ symptom: string; severity: string }>
  >([]);
  const [symptomPatterns, setSymptomPatterns] = useState<CycleSymptomPattern[]>(
    [],
  );

  const refreshSymptoms = useCallback(async () => {
    try {
      setSymptomsLoading(true);
      // MOB-017: skip getCycleSymptomHistory on Home — History / Cycle Insight fetch on demand.
      const [todayRes, patternsRes] = await Promise.all([
        getCycleSymptoms(todayISO, todayISO),
        getCycleSymptomPatterns(),
      ]);

      const uniqueTodaySymptoms =
        todayRes.success && Array.isArray(todayRes.data)
          ? todayRes.data.reduce<Array<{ symptom: string; severity: string }>>(
              (acc, item) => {
                if (acc.some(existing => existing.symptom === item.symptom)) {
                  return acc;
                }
                acc.push({ symptom: item.symptom, severity: item.severity });
                return acc;
              },
              [],
            )
          : [];

      setSymptomsCountToday(uniqueTodaySymptoms.length);
      setTodaySymptoms(uniqueTodaySymptoms.slice(0, 3));
      setSymptomPatterns(
        patternsRes.success && Array.isArray(patternsRes.data?.patterns)
          ? patternsRes.data.patterns
          : [],
      );
    } catch {
      setSymptomsCountToday(0);
      setTodaySymptoms([]);
      setSymptomPatterns([]);
    } finally {
      setSymptomsLoading(false);
    }
  }, [todayISO]);

  useEffect(() => {
    refreshSymptoms();
  }, [refreshSymptoms]);

  const symptomsCompleted = useMemo(() => {
    if (symptomsCountToday === null) return false;
    return symptomsCountToday > 0;
  }, [symptomsCountToday]);

  const symptomSummary = useMemo<SymptomSummary>(() => {
    const topSymptoms = symptomPatterns
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .map(p => p.symptom);
    const topPattern = symptomPatterns
      .slice()
      .sort((a, b) => b.count - a.count)[0];
    const trend = topPattern?.trend ?? null;
    const loggedTodayCount = symptomsCountToday ?? 0;
    // Patterns cover recent logs; full history is loaded on Symptom History / Cycle Insight.
    const hasAnyLogged = loggedTodayCount > 0 || symptomPatterns.length > 0;
    const lastLoggedDate = loggedTodayCount > 0 ? todayISO : null;

    return {
      loggedTodayCount,
      hasAnyLogged,
      statusText:
        loggedTodayCount > 0
          ? `${loggedTodayCount} symptom${loggedTodayCount > 1 ? 's' : ''} logged today`
          : 'No symptoms logged yet today',
      todaySymptoms,
      lastLoggedDate,
      topSymptoms,
      trend,
      loading: symptomsLoading,
    };
  }, [
    symptomPatterns,
    symptomsCountToday,
    symptomsLoading,
    todaySymptoms,
    todayISO,
  ]);

  return {
    symptomsLoading,
    symptomsCompleted,
    symptomSummary,
    refreshSymptoms,
  };
}

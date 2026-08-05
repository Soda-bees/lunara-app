import type { HomeRitual } from './types';

export const toLocalDateKey = (input: Date | string): string => {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (plain) {
      const y = Number(plain[1]);
      const mo = Number(plain[2]) - 1;
      const day = Number(plain[3]);
      const local = new Date(y, mo, day);
      if (Number.isNaN(local.getTime())) return '';
      const yy = local.getFullYear();
      const mm = String(local.getMonth() + 1).padStart(2, '0');
      const dd = String(local.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    }
  }
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const addLocalCalendarDays = (
  yyyyMmDd: string,
  deltaDays: number,
): string => {
  const parts = yyyyMmDd.split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return '';
  const [y, mo, d] = parts;
  const dt = new Date(y, mo - 1, d);
  if (Number.isNaN(dt.getTime())) return '';
  dt.setDate(dt.getDate() + deltaDays);
  return toLocalDateKey(dt);
};

export const isSameLocalDate = (
  isoOrDate?: string,
  localDayKey?: string,
): boolean => {
  if (!isoOrDate || !localDayKey) return false;
  const key = toLocalDateKey(isoOrDate);
  return key.length > 0 && key === localDayKey;
};

export const normalizeWorkoutId = (workoutId: any): string | null => {
  if (!workoutId) return null;
  if (typeof workoutId === 'string') return workoutId;
  if (typeof workoutId === 'object') {
    if (workoutId._id) return String(workoutId._id);
  }
  return null;
};

export const sortByOrder = (a: HomeRitual, b: HomeRitual) =>
  a.orderIndex - b.orderIndex;

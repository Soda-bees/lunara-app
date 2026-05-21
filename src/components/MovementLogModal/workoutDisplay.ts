import type { Workout } from '../../services/api';

export function isUserCustomWorkout(workout: Workout): boolean {
  return Boolean(workout.isCustom);
}

export function hasLibraryExtras(workout: Workout): boolean {
  if (isUserCustomWorkout(workout)) return false;
  const benefits = (workout.benefits || []).some(b => String(b).trim());
  const equipment = (workout.equipment || []).some(e => String(e).trim());
  return benefits || equipment;
}

export function formatWorkoutType(type: string): string {
  if (!type?.trim()) return 'Workout';
  return type
    .trim()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function formatIntensity(
  intensity: Workout['intensity'] | string | undefined,
): string {
  if (!intensity) return '';
  const lower = String(intensity).toLowerCase();
  if (lower === 'low') return 'Low';
  if (lower === 'medium') return 'Medium';
  if (lower === 'high') return 'High';
  return formatWorkoutType(intensity);
}

export function formatRitualSection(
  section: Workout['ritualSection'] | string | undefined,
): string {
  if (!section) return '';
  if (section === 'morning') return 'Morning';
  if (section === 'midday') return 'Midday';
  if (section === 'evening') return 'Evening';
  return formatWorkoutType(section);
}

export function formatEquipment(equipment: string[] | undefined): string {
  const list = (equipment || []).map(e => e.trim()).filter(Boolean);
  if (list.length === 0) return 'No equipment';
  const joined = list.join(', ');
  if (joined.length <= 40) return joined;
  return `${joined.slice(0, 37)}...`;
}

export function pickBenefitPreview(
  benefits: string[] | undefined,
  max = 2,
): string[] {
  return (benefits || [])
    .map(b => b.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function buildWorkoutMetaPills(workout: Workout): string[] {
  const pills: string[] = [];
  if (workout.duration) {
    pills.push(`${workout.duration} min`);
  }
  const intensity = formatIntensity(workout.intensity);
  if (intensity) pills.push(intensity);
  const type = formatWorkoutType(workout.type);
  if (type && type !== 'Custom') pills.push(type);
  const section = formatRitualSection(workout.ritualSection);
  if (section) pills.push(section);
  return pills;
}

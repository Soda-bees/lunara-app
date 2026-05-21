/** Display preference only; canonical storage is always cm / kg on the server. */
export type MeasurementSystem = 'metric' | 'imperial';

/** App default when user has not chosen a preference (onboarding, API omit). */
export const DEFAULT_MEASUREMENT_SYSTEM: MeasurementSystem = 'imperial';

const LB_PER_KG = 2.2046226218;
const CM_PER_INCH = 2.54;

export function kgToLb(kg: number): number {
  return kg * LB_PER_KG;
}

export function lbToKg(lb: number): number {
  return lb / LB_PER_KG;
}

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function feetInchesToTotalInches(feet: number, inches: number): number {
  return feet * 12 + inches;
}

export function totalInchesToFeetInches(total: number): { feet: number; inches: number } {
  const feet = Math.floor(total / 12);
  const inches = Math.round((total - feet * 12) * 10) / 10;
  return { feet, inches: Math.min(11.9, Math.max(0, inches)) };
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function formatWeight(kg: number | undefined | null, system: MeasurementSystem): string {
  if (kg == null || Number.isNaN(kg)) return '—';
  if (system === 'imperial') {
    return `${round1(kgToLb(kg))} lb`;
  }
  return `${round1(kg)} kg`;
}

export function formatWeightParts(
  kg: number | undefined | null,
  system: MeasurementSystem,
): { value: string; unit: string } {
  if (kg == null || Number.isNaN(kg)) {
    return { value: '—', unit: '' };
  }
  if (system === 'imperial') {
    return { value: String(round1(kgToLb(kg))), unit: 'lb' };
  }
  return { value: String(round1(kg)), unit: 'kg' };
}

export function formatHeight(cm: number | undefined | null, system: MeasurementSystem): string {
  if (cm == null || Number.isNaN(cm)) return '—';
  if (system === 'imperial') {
    const totalIn = cmToInches(cm);
    const feet = Math.floor(totalIn / 12);
    const inches = Math.round(totalIn - feet * 12);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export const WEIGHT_KG_MIN = 30;
export const WEIGHT_KG_MAX = 300;
export const WEIGHT_LB_MIN = 66;
export const WEIGHT_LB_MAX = 660;
export const HEIGHT_CM_MIN = 100;
export const HEIGHT_CM_MAX = 250;
export const HEIGHT_IN_MIN = 39;
export const HEIGHT_IN_MAX = 99;

export function parseNumberInput(raw: string): number | null {
  const t = raw.trim().replace(',', '.');
  if (t === '') return null;
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

export function validateWeightKg(kg: number): boolean {
  return kg >= WEIGHT_KG_MIN && kg <= WEIGHT_KG_MAX;
}

export function validateWeightLb(lb: number): boolean {
  return lb >= WEIGHT_LB_MIN && lb <= WEIGHT_LB_MAX;
}

export function validateHeightCm(cm: number): boolean {
  return cm >= HEIGHT_CM_MIN && cm <= HEIGHT_CM_MAX;
}

export function validateHeightInches(totalIn: number): boolean {
  return totalIn >= HEIGHT_IN_MIN && totalIn <= HEIGHT_IN_MAX;
}

export function targetWeightKgFromInput(
  raw: string,
  system: MeasurementSystem,
): number | null {
  const n = parseNumberInput(raw);
  if (n == null) return null;
  const kg = system === 'imperial' ? lbToKg(n) : n;
  return validateWeightKg(kg) ? round1(kg) : null;
}

export function bodyWeightKgFromInput(
  raw: string,
  system: MeasurementSystem,
): number | null {
  return targetWeightKgFromInput(raw, system);
}

export function heightCmFromMetricInput(raw: string): number | null {
  const n = parseNumberInput(raw);
  if (n == null) return null;
  if (!validateHeightCm(n)) return null;
  return Math.round(n);
}

export function heightCmFromImperialInput(feetStr: string, inchesStr: string): number | null {
  const feet = parseNumberInput(feetStr) ?? 0;
  const inches = parseNumberInput(inchesStr) ?? 0;
  if (feet < 3 || feet > 8) return null;
  const totalIn = feet * 12 + inches;
  if (!validateHeightInches(totalIn)) return null;
  return round1(inchesToCm(totalIn));
}

export function heightCmFromSingleImperialInches(totalInches: number): number | null {
  if (!validateHeightInches(totalInches)) return null;
  return round1(inchesToCm(totalInches));
}

/** Imperial height: single total inches field (not ft/in split). */
export function heightCmFromInchesInput(raw: string): number | null {
  const n = parseNumberInput(raw);
  if (n == null) return null;
  return heightCmFromSingleImperialInches(n);
}

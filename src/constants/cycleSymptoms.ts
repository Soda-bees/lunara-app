export type SymptomCategoryKey = 'physical' | 'mentalPerformance' | 'hormonal';

export type CycleSymptomType =
  | 'Cramps'
  | 'Bloating'
  | 'Headaches'
  | 'Breast Tenderness'
  | 'Acne'
  | 'Back Pain'
  | 'Nausea'
  | 'Energy'
  | 'Mood'
  | 'Focus'
  | 'Libido'
  | 'Discharge'
  | 'Ovulation';

export type CycleSymptomSeverity =
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'low'
  | 'medium'
  | 'high'
  | 'poor'
  | 'neutral'
  | 'good'
  | 'fair'
  | 'normal'
  | 'none'
  | 'dry'
  | 'sticky'
  | 'egg-white'
  | 'indicator';

export type SeverityOption = { value: CycleSymptomSeverity; label: string };

export const CATEGORY_ORDER: SymptomCategoryKey[] = [
  'physical',
  'mentalPerformance',
  'hormonal',
];

export const SYMPTOM_CATEGORIES: Record<
  SymptomCategoryKey,
  { label: string; symptoms: CycleSymptomType[] }
> = {
  physical: {
    label: 'Physical Symptoms',
    symptoms: [
      'Cramps',
      'Bloating',
      'Headaches',
      'Breast Tenderness',
      'Acne',
      'Back Pain',
      'Nausea',
    ],
  },
  mentalPerformance: {
    label: 'Mental / Performance',
    symptoms: ['Energy', 'Mood', 'Focus'],
  },
  hormonal: {
    label: 'Hormonal Signals',
    symptoms: ['Libido', 'Discharge', 'Ovulation'],
  },
};

export const SYMPTOM_SCALE_OPTIONS: Record<CycleSymptomType, SeverityOption[]> = {
  Cramps: [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  Bloating: [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  Headaches: [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  'Breast Tenderness': [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  Acne: [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  'Back Pain': [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  Nausea: [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
  ],
  Energy: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  Mood: [
    { value: 'poor', label: 'Poor' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'good', label: 'Good' },
  ],
  Focus: [
    { value: 'poor', label: 'Poor' },
    { value: 'fair', label: 'Fair' },
    { value: 'good', label: 'Good' },
  ],
  Libido: [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
  ],
  Discharge: [
    { value: 'none', label: 'None' },
    { value: 'dry', label: 'Dry' },
    { value: 'sticky', label: 'Sticky' },
    { value: 'egg-white', label: 'Egg-white' },
  ],
  Ovulation: [{ value: 'indicator', label: 'Indicator' }],
};

export const ALL_CYCLE_SYMPTOMS: CycleSymptomType[] = CATEGORY_ORDER.flatMap(
  category => SYMPTOM_CATEGORIES[category].symptoms,
);

export function getScaleOptions(symptom: CycleSymptomType): SeverityOption[] {
  return SYMPTOM_SCALE_OPTIONS[symptom];
}

export function defaultScale(symptom: CycleSymptomType): CycleSymptomSeverity {
  return SYMPTOM_SCALE_OPTIONS[symptom][0].value;
}

export function supportsManualScale(symptom: CycleSymptomType): boolean {
  return symptom !== 'Ovulation';
}


// Fasting data constants for the Metabolic Timer screen

export interface FastingMechanism {
  title: string;
  description: string;
  icon: string; // Emoji or icon identifier
  detail: string;
  color: string;
}

export interface FastingStage {
  hours: number;
  label: string;
  description: string;
  icon: string;
}

export interface CycleFastingGuide {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  emoji: string;
  window: string;
  approach: string;
  description: string;
  recommendations: string[];
  avoid: string[];
  science: string;
}

export interface FastingResearch {
  finding: string;
  source: string;
  year: string;
}

export const fastingMechanisms: FastingMechanism[] = [
  {
    title: 'Autophagy Activation',
    description: 'Cellular cleanup and renewal',
    icon: '🔄',
    color: '#8B5CF6',
    detail:
      "Autophagy (literally 'self-eating') is your body's cellular recycling system. During fasting, cells break down and recycle damaged proteins, dysfunctional organelles, and cellular debris. This process is critical for preventing disease, reducing inflammation, and maintaining cellular youth. The 2016 Nobel Prize in Medicine was awarded for autophagy research.",
  },
  {
    title: 'Metabolic Switching',
    description: 'From glucose to ketone burning',
    icon: '🔥',
    color: '#F97316',
    detail:
      'After 12-14 hours without food, your liver\'s glycogen stores deplete and your body switches to burning stored fat for fuel. The liver converts fatty acids into ketones—a super-efficient brain fuel. This metabolic flexibility is associated with cognitive clarity, reduced inflammation, and improved insulin sensitivity.',
  },
  {
    title: 'Insulin Sensitivity Reset',
    description: 'Improve glucose regulation',
    icon: '📈',
    color: '#10B981',
    detail:
      'Constant eating keeps insulin chronically elevated, leading to insulin resistance over time. Fasting gives your cells a break from insulin, allowing receptors to resensitize. Improved insulin sensitivity means better blood sugar control, reduced diabetes risk, and more stable energy throughout the day.',
  },
  {
    title: 'Growth Hormone Surge',
    description: 'Muscle preservation and repair',
    icon: '⚡',
    color: '#F59E0B',
    detail:
      'Human growth hormone (HGH) can increase by 300-500% during extended fasts. HGH protects lean muscle mass during fasting, promotes fat burning, supports tissue repair, and has anti-aging effects. This is one reason why fasting doesn\'t cause muscle loss when done properly.',
  },
  {
    title: 'BDNF Production',
    description: 'Brain health and neuroplasticity',
    icon: '🧠',
    color: '#EC4899',
    detail:
      'Fasting increases Brain-Derived Neurotrophic Factor (BDNF), a protein that supports neuron growth, synaptic plasticity, and cognitive function. Higher BDNF levels are associated with better memory, learning, and mood. Low BDNF is linked to depression and neurodegenerative diseases.',
  },
  {
    title: 'Inflammation Reduction',
    description: 'Systemic anti-inflammatory effects',
    icon: '🛡️',
    color: '#3B82F6',
    detail:
      'Fasting reduces markers of chronic inflammation like C-reactive protein (CRP), IL-6, and TNF-alpha. Chronic low-grade inflammation is the root of many modern diseases—from heart disease to autoimmune conditions. Fasting gives your immune system a reset, reducing unnecessary inflammatory responses.',
  },
];

export const fastingTimeline: FastingStage[] = [
  {
    hours: 0,
    label: 'Fed State',
    description: 'Digesting, insulin active, storing nutrients',
    icon: '🍽️',
  },
  {
    hours: 4,
    label: 'Early Fasting',
    description: 'Insulin dropping, glycogen being used',
    icon: '⏳',
  },
  {
    hours: 8,
    label: 'Glycogen Depletion',
    description: 'Liver glycogen running low',
    icon: '📉',
  },
  {
    hours: 12,
    label: 'Metabolic Switch',
    description: 'Ketosis begins, fat burning activates',
    icon: '🔥',
  },
  {
    hours: 14,
    label: 'Fat Burning Peak',
    description: 'Efficient fat oxidation, ketones rising',
    icon: '⚡',
  },
  {
    hours: 16,
    label: 'Autophagy',
    description: 'Cellular cleanup intensifies',
    icon: '✨',
  },
  {
    hours: 18,
    label: 'Deep Renewal',
    description: 'Enhanced DNA repair, HGH surge',
    icon: '🧬',
  },
  {
    hours: 24,
    label: 'Extended Fast',
    description: 'Significant autophagy, immune reset',
    icon: '🔄',
  },
];

export const cycleSyncGuidance: CycleFastingGuide[] = [
  {
    phase: 'menstrual',
    emoji: '🌑',
    window: '12-13 hours',
    approach: 'Gentle & Nourishing',
    description:
      'Your body is in its lowest hormonal state and actively shedding the uterine lining. This is NOT the time to push extended fasts.',
    recommendations: [
      'Keep fasting windows short (12-13 hours max)',
      'Break fast with warm, mineral-rich foods',
      'Prioritize iron and B vitamins to replenish blood loss',
      "Listen to hunger cues—if you're hungry, eat",
      'Focus on nourishment over restriction',
    ],
    avoid: [
      'Extended fasts (16+ hours)',
      'Pushing through strong hunger signals',
      'Combining with intense exercise',
    ],
    science:
      'Low estrogen and progesterone mean less metabolic flexibility. Cortisol is naturally higher. Extended fasting can add stress to an already demanding phase.',
  },
  {
    phase: 'follicular',
    emoji: '🌒',
    window: '13-15 hours',
    approach: 'Building & Flexible',
    description:
      'Estrogen is rising, bringing increased insulin sensitivity and metabolic flexibility. Your body handles fasting well.',
    recommendations: [
      'Gradually extend fasting windows if desired',
      'Morning fasted workouts can be effective',
      'Break fast with protein + healthy fats',
      'Experiment with different fasting durations',
      'Your energy is rising—lean into it',
    ],
    avoid: [
      'Nothing specific—this is your most flexible phase',
      "Just don't jump straight to extended fasts",
    ],
    science:
      "Rising estrogen improves your body's ability to switch between glucose and fat burning. Insulin sensitivity peaks, making this ideal for metabolic challenges.",
  },
  {
    phase: 'ovulatory',
    emoji: '🌕',
    window: '15-18 hours',
    approach: 'Peak Performance',
    description:
      'Estrogen and testosterone peak together, creating optimal conditions for longer fasts and metabolic challenges.',
    recommendations: [
      'This is your window for longer fasts if desired',
      "Your body is metabolically powerful—embrace it",
      'Stay hydrated with minerals (sodium, potassium, magnesium)',
      'Break fast mindfully with nutrient-dense foods',
      'Can combine with higher-intensity training',
    ],
    avoid: ['Overeating in the eating window', 'Ignoring hydration and electrolytes'],
    science:
      'Peak estrogen + testosterone create the most insulin-sensitive, metabolically flexible state of your cycle. Autophagy activation may be enhanced during this phase.',
  },
  {
    phase: 'luteal',
    emoji: '🌗',
    window: '12-14 hours',
    approach: 'Supportive & Steady',
    description:
      'Progesterone rises and your body\'s metabolic demands increase. Shorter fasting windows support hormonal balance.',
    recommendations: [
      'Pull back to shorter fasting windows',
      'Focus on protein and complex carbs',
      'Evening fasts (early dinner, later breakfast) work well',
      "Don't fight cravings—they often signal real needs",
      'Prioritize sleep and stress management',
    ],
    avoid: [
      'Extended fasts (16+ hours)',
      'Low-carb AND fasting together',
      'Ignoring increased appetite signals',
    ],
    science:
      'Progesterone is catabolic and raises basal body temperature, increasing caloric needs by 100-300 calories/day. Fasting adds stress when your body needs fuel for hormone production.',
  },
];

export const fastingResearch: FastingResearch[] = [
  {
    finding:
      'Intermittent fasting improves insulin sensitivity and reduces markers of oxidative stress',
    source: 'Mattson et al., New England Journal of Medicine',
    year: '2019',
  },
  {
    finding:
      'Time-restricted eating reduces body weight and improves cardiometabolic health',
    source: 'Wilkinson et al., Cell Metabolism',
    year: '2020',
  },
  {
    finding:
      'Fasting triggers autophagy, a cellular cleaning process linked to longevity',
    source: 'Alirezaei et al., Autophagy',
    year: '2010',
  },
  {
    finding:
      'Women may respond differently to fasting due to hormonal fluctuations throughout the menstrual cycle',
    source: 'Harvie & Howell, British Journal of Nutrition',
    year: '2017',
  },
  {
    finding:
      'Metabolic switching from glucose to ketones occurs after 12-36 hours of fasting',
    source: 'Anton et al., Obesity',
    year: '2018',
  },
  {
    finding: 'Fasting increases human growth hormone secretion by up to 500%',
    source: 'Ho et al., Journal of Clinical Investigation',
    year: '1988',
  },
];

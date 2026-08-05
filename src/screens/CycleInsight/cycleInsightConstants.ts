import { WeeklyUpdate, DidYouKnow } from '../../services/api';

export const PHASE_NAMES: Record<string, string> = {
  menstrual: 'Menstrual Phase',
  follicular: 'Follicular Phase',
  ovulatory: 'Ovulatory Phase',
  luteal: 'Luteal Phase',
};

// Frontend fallback descriptions (used when backend doesn't provide)
export const PHASE_DESCRIPTIONS: Record<string, string> = {
  menstrual:
    'This is your deep rest phase. Your body is shedding the uterine lining and working hard behind the scenes. Prioritize warmth, comfort, iron-rich foods, and gentle movement like stretching or slow walks.',
  follicular:
    'This is your time to shine! Estrogen is rising, bringing mental clarity, creativity, and increasing energy. Perfect for starting new projects, learning, and more intense workouts.',
  ovulatory:
    'You are at your peak energy and magnetism. Communication, social connection, and high-intensity workouts may feel especially natural and satisfying right now.',
  luteal:
    'Your body is shifting into a more reflective, inward phase. Progesterone is higher, and you may feel more sensitive or slower. Great time for nesting, organizing, and gentle strength or yoga.',
};

// Frontend fallback fertility taglines (used when backend doesn't provide)
export const PHASE_TAGLINES: Record<string, string> = {
  menstrual: 'Low',
  follicular: 'Rising',
  ovulatory: 'High',
  luteal: 'Lower',
};

// Fallback data for weekly updates
export const FALLBACK_WEEKLY_UPDATES: WeeklyUpdate[] = [
  {
    title: 'Energy Rising',
    message:
      'Your energy levels will continue increasing through day 14. Perfect for challenging workouts and social activities.',
    iconType: 'energy',
    color: '#FFF1DB',
    iconColor: '#000000', // Will be overridden by colors.heading in component
    order: 1,
  },
  {
    title: 'Mental Clarity Peak',
    message:
      'Days 10-14 bring peak cognitive function. Schedule important meetings and creative projects.',
    iconType: 'mental',
    color: '#E4EFFF',
    order: 2,
  },
  {
    title: 'Metabolism Boost',
    message:
      'Your metabolic rate is increasing. Great time for extended fasting windows (13-15h).',
    iconType: 'metabolism',
    color: '#FFDEE0',
    iconColor: '#D6757B',
    order: 3,
  },
];

// Fallback data for "Did You Know?"
export const FALLBACK_DID_YOU_KNOW: DidYouKnow = {
  fact: 'Your basal body temperature naturally rises by 0.5-1°F after ovulation due to increased progesterone. Tracking this can help you understand your cycle patterns and optimize fertility awareness.',
  author: 'Dr. Jolene Brighten',
};

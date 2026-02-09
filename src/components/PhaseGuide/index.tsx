import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import {
  getCyclePhaseContent,
  CyclePhaseContent,
} from '../../services/api';

type PhaseGuideItem = {
  phase: string;
  days: string;
  icon: any;
  items: { title: string; value: string }[];
  sections: { title: string; text: string }[];
};

const FALLBACK_PHASE_GUIDE_DATA: PhaseGuideItem[] = [
  {
    phase: 'Menstrual',
    days: 'Days 1 – 5',
    icon: images.btCycleActive,
    items: [
      {
        title: 'Energy',
        value: 'Low • Rest & renewal',
      },
      {
        title: 'Mood',
        value: 'Introspective, sensitive',
      },
    ],
    sections: [
      {
        title: 'Focus',
        text: 'Deep rest, reflection, and gentle self-care. Say no to extra demands.',
      },
      {
        title: 'Nutrition Tips',
        text: 'Iron-rich foods (leafy greens, beans, red meat), warming meals, and omega‑3s. Stay hydrated and avoid intense fasting.',
      },
      {
        title: 'Movement',
        text: "Gentle yoga, walking, stretching, or complete rest. Honor your body's need to slow down.",
      },
    ],
  },
  {
    phase: 'Follicular',
    days: 'Days 6 – 13',
    icon: images.energyIcon,
    items: [
      {
        title: 'Energy',
        value: 'Rising • Motivation returns',
      },
      {
        title: 'Mood',
        value: 'Optimistic, curious',
      },
    ],
    sections: [
      {
        title: 'Focus',
        text: 'New projects, planning, learning, and creative work feel easier in this phase.',
      },
      {
        title: 'Nutrition Tips',
        text: 'Light, fresh foods, colorful veggies, lean protein, and fermented foods to support gut and hormone balance.',
      },
      {
        title: 'Movement',
        text: 'Build intensity: strength training, cardio, and trying new workouts feel more accessible.',
      },
    ],
  },
  {
    phase: 'Ovulatory',
    days: 'Days 14 – 17',
    icon: images.feelingsIcon,
    items: [
      {
        title: 'Energy',
        value: 'High • Peak social energy',
      },
      {
        title: 'Mood',
        value: 'Confident, connected',
      },
    ],
    sections: [
      {
        title: 'Focus',
        text: 'Collaboration, communication, presentations, and social activities are supported here.',
      },
      {
        title: 'Nutrition Tips',
        text: 'Fiber‑rich foods, cruciferous veggies, and plenty of hydration to support estrogen clearance.',
      },
      {
        title: 'Movement',
        text: 'Higher‑intensity training, group classes, and dynamic workouts are usually well tolerated.',
      },
    ],
  },
  {
    phase: 'Luteal',
    days: 'Days 18 – 28',
    icon: images.energyHigh,
    items: [
      {
        title: 'Energy',
        value: 'Declining • Slow and steady',
      },
      {
        title: 'Mood',
        value: 'Reflective, sensitive to stress',
      },
    ],
    sections: [
      {
        title: 'Focus',
          text: 'Finishing tasks, organizing, and creating structure. Build in extra buffers for rest.',
      },
      {
        title: 'Nutrition Tips',
        text: 'Complex carbs, magnesium‑rich foods, and stable blood sugar support mood and cravings.',
      },
      {
        title: 'Movement',
        text: 'Moderate movement: pilates, strength with lighter loads, walks, and restorative practices.',
      },
    ],
  },
];

const PHASE_DAYS_MAP: Record<string, string> = {
  menstrual: 'Days 1 – 5',
  follicular: 'Days 6 – 13',
  ovulatory: 'Days 14 – 17',
  luteal: 'Days 18 – 28',
};

const PHASE_ICON_MAP: Record<string, any> = {
  menstrual: images.btCycleActive,
  follicular: images.energyIcon,
  ovulatory: images.feelingsIcon,
  luteal: images.energyHigh,
};

const mapPhaseContentToGuideItem = (content: CyclePhaseContent): PhaseGuideItem => {
  const displayNameMap: Record<string, string> = {
    menstrual: 'Menstrual',
    follicular: 'Follicular',
    ovulatory: 'Ovulatory',
    luteal: 'Luteal',
  };

  const phaseKey = content.phase;
  const phaseName = displayNameMap[phaseKey] || content.phase;

  const energyLabelMap: Record<string, string> = {
    low: 'Low • Rest & renewal',
    rising: 'Rising • Building momentum',
    high: 'High • Peak energy',
    declining: 'Declining • Wind down',
  };

  const energyValue = energyLabelMap[content.energyLevel] || 'Cycling energy';
  const moodValue = content.mindset && content.mindset.length > 0
    ? content.mindset[0]
    : 'Tune into what you need today';

  const nutritionText = content.nutrition && content.nutrition.length > 0
    ? content.nutrition.join(' • ')
    : 'Support your hormones with balanced meals, quality protein, and healthy fats.';

  const movementText = content.movement && content.movement.length > 0
    ? content.movement.join(' • ')
    : 'Choose movement that matches your energy: some days bigger, some days softer.';

  const focusText =
    content.understanding ||
    (content.mindset && content.mindset.length > 0
      ? content.mindset.join(' • ')
      : 'Use this phase to listen to your body and adjust your pace.');

  return {
    phase: phaseName,
    days: PHASE_DAYS_MAP[phaseKey] || '',
    icon: PHASE_ICON_MAP[phaseKey] || images.btCycleActive,
    items: [
      {
        title: 'Energy',
        value: energyValue,
      },
      {
        title: 'Mood',
        value: moodValue,
      },
    ],
    sections: [
      {
        title: 'Focus',
        text: focusText,
      },
      {
        title: 'Nutrition Tips',
        text: nutritionText,
      },
      {
        title: 'Movement',
        text: movementText,
      },
    ],
  };
};

const PhaseGuide = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [phaseGuideData, setPhaseGuideData] =
    useState<PhaseGuideItem[]>(FALLBACK_PHASE_GUIDE_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await getCyclePhaseContent();

        if (response.success && Array.isArray(response.data) && response.data.length > 0) {
          const activeContent = response.data.filter(item => item.isActive);

          if (activeContent.length === 0) {
            // No active content, keep fallback
            return;
          }

          const mapped: PhaseGuideItem[] = activeContent.map(mapPhaseContentToGuideItem);

          // Sort phases in the standard order
          const order = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'];
          mapped.sort(
            (a, b) => order.indexOf(a.phase) - order.indexOf(b.phase),
          );

          if (isMounted) {
            setPhaseGuideData(mapped);
          }
        }
      } catch (error) {
        console.error('Error fetching cycle phase content for PhaseGuide:', error);
        // On error we silently fall back to existing data
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Phase Guide</Text>
      {loading && (
        <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.green} />
          <Text style={{ marginLeft: 6, fontSize: 11, color: colors.green }}>
            Loading personalized phase guidance...
          </Text>
        </View>
      )}

      {phaseGuideData.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <View key={index}>
            <TouchableOpacity
              onPress={() => toggle(index)}
              style={styles.phaseRow}
            >
              <View style={styles.leftRow}>
                <Image source={item.icon} style={styles.icon} />
                <View>
                  <Text style={styles.phaseName}>{item.phase}</Text>
                  <Text style={styles.phaseDays}>{item.days}</Text>
                </View>
              </View>

              <Image
                source={images.rightArrow}
                style={[
                  styles.arrow,
                  { transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] },
                ]}
              />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.contentBox}>
                <View style={styles.topGrid}>
                  {item.items.map((box, i) => (
                    <View key={i} style={styles.infoCard}>
                      <Text style={styles.infoTitle}>{box.title}</Text>
                      <Text style={styles.infoValue}>{box.value}</Text>
                    </View>
                  ))}
                </View>

                {item.sections.map((sec, s) => (
                  <View key={s} style={{ marginTop: 14 }}>
                    <Text style={styles.sectionTitle}>{sec.title}</Text>
                    <Text style={styles.sectionText}>{sec.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {index < phaseGuideData.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 18,
    marginTop: 20,
  },

  title: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    fontSize: 14,
    marginBottom: 18,
  },

  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: sizes.screenWidth * 0.045,
    height: sizes.screenWidth * 0.045,
    resizeMode: 'contain',
    marginRight: 10,
  },

  phaseName: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    fontSize: 14,
  },

  phaseDays: {
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.green,
    fontSize: 14,
  },

  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },

  contentBox: {
    paddingTop: 8,
    paddingBottom: 14,
  },

  topGrid: {
    flexDirection: 'row',
  },

  infoCard: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 12,
    marginRight: 10,
    borderRadius: sizes.screenWidth * 0.03,
  },

  infoTitle: {
    fontFamily: 'Inter-Regular',
    color: colors.green,
    fontSize: 12,
  },

  infoValue: {
    fontFamily: 'Inter-Regular',
    color: colors.black,
    fontSize: 12,
    marginTop: 4,
  },

  sectionTitle: {
    fontFamily: 'Inter-Regular',
    color: colors.green,
    fontSize: 12,
  },

  sectionText: {
    fontFamily: 'Inter-Regular',
    color: colors.black,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 20,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.borderColor,
    marginTop: 12,
  },
});

export default PhaseGuide;

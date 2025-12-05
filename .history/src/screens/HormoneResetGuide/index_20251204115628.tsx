import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import images from '../../constants/images';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function HormoneResetGuide() {
  const navigation = useNavigation<NavigationProp>();

  const handleDownloadPDF = () => {
    // Handle PDF download
    console.log('Download PDF');
  };

  const handleBeginJourney = () => {
    // Handle begin journey action
    console.log('Begin Journey');
  };

  const PhaseCard = ({
    icon,
    phaseName,
    duration,
    hormoneStatus,
    keyTheme,
    nutrition,
    movement,
    mindset,
  }: {
    icon: ImageSourcePropType;
    phaseName: string;
    duration: string;
    hormoneStatus: string;
    keyTheme: string;
    nutrition: string;
    movement: string;
    mindset: string;
  }) => (
    <View style={styles.phaseCard}>
      <View style={styles.phaseHeader}>
        <View style={styles.phaseIconContainer}>
          <Image source={icon} style={styles.phaseIcon} />
        </View>
        <View>
          <View style={styles.phaseHeaderText}>
            <Text style={styles.phaseName}>{phaseName}</Text>
            <View style={styles.phaseDurationContainer}>
              <Text style={styles.phaseDuration}>{duration}</Text>
            </View>
          </View>
          <Text style={styles.hormoneStatus}>{hormoneStatus}</Text>
          <View style={styles.themeTag}>
            <Text style={styles.themeTagText}>{keyTheme}</Text>
          </View>
        </View>
      </View>
      <View style={styles.phaseSection}>
        <Text style={styles.phaseSectionTitle}>NUTRITION:</Text>
        <Text style={styles.phaseSectionText}>{nutrition}</Text>
      </View>
      <View style={styles.phaseSection}>
        <Text style={styles.phaseSectionTitle}>MOVEMENT:</Text>
        <Text style={styles.phaseSectionText}>{movement}</Text>
      </View>
      <View style={styles.phaseSection}>
        <Text style={styles.phaseSectionTitle}>MINDSET:</Text>
        <Text style={styles.phaseSectionText}>{mindset}</Text>
      </View>
    </View>
  );

  const BenefitCard = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <View style={styles.benefitCard}>
      <Text style={styles.benefitIcon}>{icon}</Text>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDescription}>{description}</Text>
    </View>
  );

  const PrincipleCard = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <View style={styles.principleCard}>
      <Text style={styles.principleIcon}>{icon}</Text>
      <Text style={styles.principleTitle}>{title}</Text>
      <Text style={styles.principleDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header with Back Button and Profile */}
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Quick Guide Button */}
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.quickGuideButton}>
              <Text style={styles.quickGuideText}>Quick Guide</Text>
            </TouchableOpacity>
            {/* Main Title */}
            <Text style={styles.mainTitle}>Your Hormone Reset Guide</Text>
            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Understand your cycle. Balance your hormones. Transform your life.
            </Text>
          </View>

          {/* Why Cycle Syncing Works Section */}
          <GradientWrapper variant="basic">
            <View style={styles.sectionSmall}>
              <Text style={styles.sectionTitle}>Why Cycle Syncing Works</Text>
              <Text style={styles.infoText}>
                Your menstrual cycle isn't just about your period—it's a monthly
                blueprint for your energy, mood, metabolism, and even
                creativity. Each phase has a unique hormonal profile that
                affects how you feel, think, and perform.{'\n\n'} When you align
                your nutrition, movement, and lifestyle with these natural
                rhythms, you unlock your body's full potential. No more fighting
                fatigue or forcing productivity during low-energy phases.
                Instead, you work WITH your hormones for sustainable, lifelong
                wellness.
              </Text>
            </View>
          </GradientWrapper>

          {/* The Four Phases Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>
              The Four Phases of Your Cycle
            </Text>

            <PhaseCard
              icon={images.currentPhaseIconMain}
              phaseName="Menstrual Phase"
              duration="Days 1-5"
              hormoneStatus="All hormones at lowest"
              keyTheme="Rest & Reflection"
              nutrition="Iron-rich foods, warming soups, root vegetables"
              movement="Gentle yoga, walking, stretching"
              mindset="Introspection, planning, letting go"
            />

            <PhaseCard
              icon={images.eggOut}
              phaseName="Follicular Phase"
              duration="Days 6-14"
              hormoneStatus="Rising estrogen"
              keyTheme="Energy & Creativity"
              nutrition="Fresh vegetables, lean proteins, fermented foods"
              movement="HIIT, strength training, cardio"
              mindset="Start new projects, brainstorm, socialize"
            />

            <PhaseCard
              icon={images.sparkle}
              phaseName="Ovulatory Phase"
              duration="Days 15-17"
              hormoneStatus="Peak estrogen & testosterone"
              keyTheme="Peak Power & Confidence"
              nutrition="Raw vegetables, omega-3s, antioxidants"
              movement="High-intensity workouts, team sports"
              mindset="Important meetings, presentations, bold decisions"
            />

            <PhaseCard
              icon={images.eggIn}
              phaseName="Luteal Phase"
              duration="Days 18-28"
              hormoneStatus="Rising progesterone"
              keyTheme="Completion & Self-Care"
              nutrition="Complex carbs, magnesium, B vitamins"
              movement="Moderate cardio, pilates, barre"
              mindset="Complete tasks, organize, prepare for rest"
            />
          </View>

          {/* The Benefits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>The Benefits</Text>

            <View style={styles.benefitsGrid}>
              <BenefitCard
                icon="❤️"
                title="Hormonal Balance"
                description="Work with your natural rhythms instead of against them"
              />
              <BenefitCard
                icon="🧠"
                title="Mental Clarity"
                description="Understand your cognitive peaks and plan accordingly"
              />
            </View>

            <View style={styles.benefitsGrid}>
              <BenefitCard
                icon="⚡"
                title="Sustained Energy"
                description="No more fighting fatigue—optimize energy throughout your cycle"
              />
              <BenefitCard
                icon="🌿"
                title="Reduced Symptoms"
                description="Naturally minimize PMS, cramps, and mood swings"
              />
            </View>
          </View>

          {/* Three Core Principles Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Three Core Principles</Text>

            <PrincipleCard
              icon="🍎"
              title="Cycle-Synced Nutrition"
              description="Eat to support your hormones in each phase"
            />

            <PrincipleCard
              icon="🏋️"
              title="Phase-Based Movement"
              description="Exercise intensity that matches your energy"
            />

            <PrincipleCard
              icon="📖"
              title="Mindful Awareness"
              description="Track patterns and tune into your body's wisdom"
            />
          </View>

          {/* Ready to Get Started Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Ready to Get Started?</Text>
            <Text style={styles.ctaText}>
              Join thousands of women who've transformed their health by working
              WITH their hormones, not against them.
            </Text>
            <TouchableOpacity
              style={styles.beginButton}
              onPress={handleBeginJourney}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.beginButtonGradient}
              >
                <Text style={styles.beginButtonText}>Begin Your Journey</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

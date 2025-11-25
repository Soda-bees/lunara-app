import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../components/GradientText';
import { gradients } from '../../constants/gradientColors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const emojis = ['😄', '🙂', '😐', '😞'];
  const energyEmojis = [
    images.energizedEmoji,
    images.highEmoji,
    images.mediumEmoji,
  ];

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <GradientWrapper variant="basic">
          <View style={styles.phaseBody}>
            <View style={styles.row}>
              <Image
                style={styles.currentPhaseIconMain}
                source={images.currentPhaseIconMain}
              />
              <Text style={styles.heading}>Current Phase</Text>
            </View>
            <View style={styles.phaseTextContainer}>
              <Text style={styles.textPrimary}>Foliicular - Day 8</Text>
            </View>
            <View style={styles.colCenter}>
              <Text style={styles.spacedText}>TODAY</Text>
              <Text style={styles.textBlackMedium}>Tuesday, October 28</Text>
            </View>
            <View style={styles.cyclePhaseCard}>
              <Text style={styles.spacedText}>CYCLE PROGRESS</Text>

              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <GradientText fontSize={46} fontFamily="Inter-Regular">
                    8
                  </GradientText>
                  <Text style={[styles.numberTextMedium, { top: 8 }]}>
                    / 28
                  </Text>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>Day 8</Text>
                </View>
              </View>
              <View style={styles.progressIndicator}>
                <LinearGradient
                  style={styles.progress}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                ></LinearGradient>
              </View>
              <View style={styles.rowFull}>
                <View>
                  <Text style={styles.spacedText}>CURRENT PHASE</Text>
                  <GradientText
                    fontSize={24}
                    fontFamily="PlayfairDisplay-SemiBold"
                  >
                    Luteal
                  </GradientText>
                </View>
                <Image source={images.lutealIcon} style={styles.lutealIcon} />
              </View>

              <Text style={styles.textDarkGrey}>
                Energy rising _ perfect for new beginnings
              </Text>
            </View>

            <View style={styles.softCopyContainer}>
              <Text style={styles.textDarkGrey}>
                Energy is rising! This is your spring—time for new beginnings,
                creativity, and planning.
              </Text>
            </View>

            <TouchableOpacity style={styles.sliderRow}>
              <Image source={images.slideDown} style={styles.slideIcon} />
              <Text style={styles.greenText}>Tap to see detailed insights</Text>
            </TouchableOpacity>

            <View style={styles.rowFlexBox}>
              <View style={styles.flexBox}>
                <Image source={images.energyHigh} style={styles.icon} />
                <Text style={styles.greenText}>Energy Level</Text>
                <Text style={styles.textBlackSmall}>Rising - High</Text>
              </View>
              <View style={styles.flexBox}>
                <Image source={images.sparkle} style={styles.icon} />
                <Text style={styles.greenText}>Best For</Text>
                <Text style={styles.textBlackSmall}>
                  New projects, socializing, challenging workouts
                </Text>
              </View>
            </View>

            <View style={styles.thisPhaseDataContainer}>
              <View style={styles.section}>
                <View style={styles.row}>
                  <Image source={images.nutritionIcon} style={styles.icon} />
                  <Text style={styles.textBlackBold}>Nutrition This Phase</Text>
                </View>
                <View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Fresh, light foods
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Fermented foods for gut health
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>

                    <Text style={styles.textBlackNormal}>Lean proteins</Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Complex carbs for energy
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.row}>
                  <Image source={images.movementIcon} style={styles.icon} />
                  <Text style={styles.textBlackBold}>Movement This Phase</Text>
                </View>
                <View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>HIIT workouts</Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Strength training
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>

                    <Text style={styles.textBlackNormal}>Dance or cardio</Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Try new activities
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.row}>
                  <Image source={images.mondsetIcon} style={styles.icon} />
                  <Text style={styles.textBlackBold}>Mindset & Focus</Text>
                </View>
                <View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Start new projects
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Network and socialize
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>

                    <Text style={styles.textBlackNormal}>
                      Take on challenges
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.bulletPoint}></View>
                    <Text style={styles.textBlackNormal}>
                      Think big and plan
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <LinearGradient
              colors={gradients.pinkish}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.pinkishGradient}
            >
              <View style={styles.row}>
                <Image source={images.sparkle} style={styles.icon} />
                <Text style={styles.textBlackBold}>
                  Understanding This Phase
                </Text>
              </View>
              <Text style={styles.textBlackSmall}>
                Rising estrogen brings mental clarity and physical energy. This
                is when you naturally feel most optimistic and capable. Use this
                window for things that require focus, creativity, and social
                connection.
              </Text>
            </LinearGradient>
          </View>
        </GradientWrapper>

        <View style={styles.container}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Today’s Rituals</Text>
            <Text style={styles.headerProgress}>0/9 Complete</Text>
          </View>

          {/* MORNING */}
          <Text style={styles.sectionHeading}>MORNING</Text>
          <View style={styles.ritualsSection}>
            <RitualItem
              title="Log last night’s sleep"
              tag="Rest"
              description="💡 Tracking sleep patterns helps identify what supports your best rest"
              actionLabel="Log Sleep"
            />

            <RitualItem
              title="Hydrate with minerals + morning light"
              tag="Nourish"
              description="💡 Morning light sets your circadian rhythm and hormone balance"
              actionLabel="View Guide"
            />

            <RitualItem
              title="5-min breathwork practice"
              tag="Mindful"
              description="💡 Breathwork activates your parasympathetic nervous system"
              actionLabel="Practice"
            />

            <RitualItem
              title="Protein-rich breakfast (20–30g)"
              tag="Nourish"
              description="💡 Protein stabilizes blood sugar and supports hormone production"
              actionLabel="View Guide"
            />
          </View>

          <View style={styles.divider} />

          {/* MIDDAY */}
          <Text style={styles.sectionHeading}>MIDDAY</Text>
          <View style={styles.ritualsSection}>
            <RitualItem
              title="Movement session (any time)"
              tag="Move"
              description="💡 Exercise when it fits your schedule and energy levels"
            />

            <RitualItem
              title="Protein at lunch (20–30g)"
              tag="Nourish"
              description="💡 Consistent protein supports metabolic health and satiety"
              actionLabel="View Guide"
            />
          </View>

          <View style={styles.divider} />

          {/* EVENING */}
          <Text style={styles.sectionHeading}>EVENING</Text>
          <View style={styles.ritualsSection}>
            <RitualItem
              title="Gentle stretching or walk"
              tag="Move"
              description="💡 Light movement aids digestion and circulation"
            />

            <RitualItem
              title="Wind-down ritual"
              tag="Mindful"
              description="💡 Creating separation from day helps cortisol naturally decline"
              actionLabel="Practice"
            />

            <RitualItem
              title="Magnesium supplement (evening)"
              tag="Rest"
              description="💡 Evening magnesium supports deep sleep and muscle recovery"
            />
          </View>

          {/* Bottom Gradient Button */}
          <TouchableOpacity style={styles.updateButton}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.updateButtonGradient}
            >
              <Text style={styles.updateButtonText}>Update Rituals</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.container2}>
          <Text style={styles.sectionTitle}>Today's Tracking</Text>
          <View>
            <View style={styles.row}>
              <Image source={images.movementIcon} style={styles.icon} />
              <Text style={styles.label}>How are you feeling?</Text>
            </View>
            <View style={styles.row2}>
              {['Great', 'Good', 'Okay', 'Low'].map((mood, index) => (
                <TouchableOpacity key={index} style={styles.optionBox}>
                  <Text style={styles.optionEmojiText}>{emojis[index]}</Text>
                  <Text style={styles.optionText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <View style={styles.row}>
              <Image source={images.energyIcon} style={styles.icon} />
              <Text style={[styles.label]}>Energy Level</Text>
            </View>
            <View style={styles.row2}>
              {['High', 'Medium', 'Low'].map((level, index) => (
                <TouchableOpacity key={index} style={styles.optionBox}>
                  <Image
                    source={energyEmojis[index]}
                    style={styles.optionEmoji}
                  />
                  <Text style={styles.optionText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <View style={styles.row}>
              <Image source={images.sleepQualityIcon} style={styles.icon} />
              <Text style={styles.label}>How was your sleep quality?</Text>
            </View>
            <View style={styles.row2}>
              {['Great', 'Good', 'Okay', 'Poor'].map((mood, index) => (
                <TouchableOpacity key={index} style={styles.optionBox}>
                  <Text style={styles.optionEmojiText}>{emojis[index]}</Text>
                  <Text style={styles.optionText}>{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>View Sleep Details </Text>
            <Image source={images.arrow} style={styles.arrow} />
          </TouchableOpacity>
        </View>

        <View style={styles.container2}>
          <Text style={styles.sectionTitle}>Cycle Insights</Text>

          <View style={styles.insightRow}>
            <View style={styles.insightCard}>
              <View style={styles.row}>
                <Image source={images.energyHigh} style={styles.icon} />
                <Text style={styles.insightLabel}>Cycle Length</Text>
              </View>
              <Text style={styles.insightValue}>28 days avg</Text>
              <Text style={styles.insightStatus}>Consistent</Text>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.row}>
                <Image source={images.sleepQualityIcon} style={styles.icon} />
                <Text style={styles.insightLabel}>Sleep Quality</Text>
              </View>
              <Text style={styles.insightValue}>7.8 hrs</Text>
              <Text style={styles.insightStatus}>Improving</Text>
            </View>
          </View>

          <View style={styles.insightRow}>
            <View style={styles.insightCard}>
              <View style={styles.row}>
                <Image source={images.hydrationIcon} style={styles.icon} />
                <Text style={styles.insightLabel}>Hydration</Text>
              </View>
              <Text style={styles.insightValue}>85%</Text>
              <Text style={styles.insightStatus}>Great</Text>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.row}>
                <Image source={images.energyIcon} style={styles.icon} />
                <Text style={styles.insightLabel}>Energy Level</Text>
              </View>
              <Text style={styles.insightValue}>High</Text>
              <Text style={styles.insightStatus}>Peak phase</Text>
            </View>
          </View>

          <View style={styles.softCopyContainer}>
            <Text style={styles.textDarkGrey}>
              💡 You've had reduced bloating for two cycles since adding daily
              sauna use
            </Text>
          </View>
        </View>
        <GradientWrapper variant="basic">
          <View style={styles.container}>
            <Text style={styles.sectionTitleGreen}>Active Challenge</Text>

            <Text style={styles.challengeTitle}>21-Day Detox Reset</Text>
            <Text style={styles.challengeDisclaimer}>
              Day 8 — You're glowing from the inside out.
            </Text>

            <TouchableOpacity style={styles.challengeButton}>
              <Text style={styles.challengeBtnText}>View Challenge</Text>
            </TouchableOpacity>
          </View>
        </GradientWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

const RitualItem = ({
  title,
  tag,
  description,
  actionLabel,
}: {
  title: string;
  tag: string;
  description: string;
  actionLabel?: string;
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <TouchableOpacity>
          <Image source={images.circleUnchecked} style={styles.checkIcon} />
        </TouchableOpacity>
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>● {tag}</Text>
          </View>
        </View>
        {/* {actionLabel && (
          <TouchableOpacity>
            <Text style={styles.actionLabel}>{actionLabel} →</Text>
          </TouchableOpacity>
        )} */}
      </View>

      <Text style={styles.itemDescription}>{description}</Text>
    </View>
  );
};

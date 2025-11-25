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
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
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
              <View style={styles.row}>
                <Image source={images.nutritionIcon} style={styles.icon} />
                <Text style={styles.textBlackBold}>Nutrition This Phase</Text>
              </View>
              <View style={styles.row}>
                <View style={styles.bulletPoint}></View>
                <Text style={styles.textBlackNormal}>Fresh, light foods</Text>
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
        </GradientWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

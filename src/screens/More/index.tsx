import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './style';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function More() {
  const navigation = useNavigation<NavigationProp>();

  const mainFeatures = [
    {
      id: 1,
      title: 'Founder Story',
      subtitle: 'Why I built Lunara & my journey',
      icon: images.movementIcon,
      navigateTo: 'FounderStory',
    },
    {
      id: 2,
      title: 'Profile & Stats',
      subtitle: 'View your progress and insights',
      icon: images.userIcon,
      // navigateTo: 'Weight',
    },
    {
      id: 3,
      title: 'Challenges',
      subtitle: 'Join wellness challenges',
      icon: images.challengesIcon,
      navigateTo: 'ChallengeHub',
    },
    {
      id: 4,
      title: 'Partner Dashboard',
      subtitle: 'Share your cycle insights',
      icon: images.multipleUsers,
      // navigateTo: 'CyclePattern',
    },
  ];

  const additionalTools = [
    {
      id: 5,
      title: 'Hormone Reset Guide',
      subtitle: 'Download your promotional PDF guide',
      icon: images.journal,
      // navigateTo: 'SleepTracker',
    },
    {
      id: 6,
      title: '60-Day Social Media Plan',
      subtitle: 'Complete content calendar for promotion',
      icon: images.socialMediaPlan,
      // navigateTo: 'YourStrengthTransition',
    },
    {
      id: 7,
      title: 'Fasting Tracker',
      subtitle: 'Intermittent fasting logs',
      icon: images.currentPhaseIconMain,
      // navigateTo: 'QuickTracking',
    },
    {
      id: 8,
      title: 'Sleep Tracker',
      subtitle: 'Monitor your sleep quality',
      icon: images.periodCalender,
      navigateTo: 'SleepTracker',
    },
  ];

  const handlePress = async () => {
    navigation.navigate('GetToKnow');
  };

  const handleSingleNavigation = (item: {
    navigateTo?: keyof RootStackParamList;
  }) => {
    if (item.navigateTo) {
      navigation.navigate(item.navigateTo as any);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>More</Text>
          <Text style={styles.paraText}>
            Explore additional features and settings
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 10,
          }}
        >
          <Text style={styles.mainHeading}>Main Features</Text>
          {mainFeatures.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.featuresView}
                activeOpacity={0.5}
                // onPress={() => navigation.navigate(item.navigateTo as any)}
                onPress={() => handleSingleNavigation(item as any)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.imageMainView}>
                    <Image source={item.icon} style={styles.imageView} />
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.heading}>{item.title}</Text>
                    <Text style={styles.subHeading}>{item.subtitle}</Text>
                  </View>
                </View>

                <Image source={images.rightArrow} style={styles.arrowImage} />
              </TouchableOpacity>
            );
          })}
          <Text style={styles.mainHeading}>Additional Tools</Text>
          {additionalTools.map((item, index) => {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.featuresView}
                activeOpacity={0.5}
                onPress={() => handleSingleNavigation(item as any)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.imageMainView}>
                    <Image source={item.icon} style={styles.imageView} />
                  </View>

                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.heading}>{item.title}</Text>
                    <Text style={styles.subHeading}>{item.subtitle}</Text>
                  </View>
                </View>

                <Image source={images.rightArrow} style={styles.arrowImage} />
              </TouchableOpacity>
            );
          })}
          <View style={{ marginVertical: 16 }}>
            <GradientWrapper variant="basic">
              <View style={styles.phaseBody}>
                <Image
                  source={images.settings}
                  style={styles.settingImageView}
                />
                <View style={{ marginLeft: 7 }}>
                  <Text style={styles.settingMainHeading}>Settings</Text>
                  <Text style={styles.settingSubHeading}>
                    Preferences and account
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.updateButton}>
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateButtonGradient}
                >
                  <Text style={styles.updateButtonText}>Manage Account</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GradientWrapper>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

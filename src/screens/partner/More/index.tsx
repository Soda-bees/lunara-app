import React from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../../constants/images';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import { clearToken, partnerLogout } from '../../../services/api';
import { useOnboarding } from '../../../context/OnboardingContext';
import { usePartnerMode } from '../../../context/PartnerModeContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PartnerMore() {
  const navigation = useNavigation<NavigationProp>();
  const { resetData } = useOnboarding();
  const { primaryUserName } = usePartnerMode();

  const mainFeatures = [
    {
      id: 1,
      title: 'Founder Story',
      subtitle: 'Why I built Lunara & my journey',
      icon: images.movementIcon,
      navigateTo: 'FounderStory' as const,
    },
    {
      id: 2,
      title: 'Profile & Stats',
      subtitle: 'View account and wellness stats',
      icon: images.userIcon,
      navigateTo: 'Profile' as const,
    },
    {
      id: 3,
      title: 'Challenges',
      subtitle: 'View wellness challenges',
      icon: images.challengesIcon,
      navigateTo: 'ChallengeHub' as const,
    },
  ];

  const additionalTools = [
    {
      id: 5,
      title: 'Hormone Reset Guide',
      subtitle: 'Download your promotional PDF guide',
      icon: images.journal,
      navigateTo: 'HormoneResetGuide' as const,
    },
    {
      id: 6,
      title: '60-Day Social Media Plan',
      subtitle: 'Complete content calendar for promotion',
      icon: images.socialMediaPlan,
    },
    {
      id: 7,
      title: 'Fasting Tracker',
      subtitle: 'View intermittent fasting logs',
      icon: images.currentPhaseIconMain,
      navigateTo: 'FastingHome' as const,
    },
    {
      id: 8,
      title: 'Sleep Tracker',
      subtitle: 'View sleep quality logs',
      icon: images.periodCalender,
      navigateTo: 'SleepTracker' as const,
    },
  ];

  const handleExitPartnerView = () => {
    Alert.alert(
      'Exit partner view?',
      'You will return to the welcome screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: async () => {
            try {
              await partnerLogout();
            } catch {
              // Best-effort server logout.
            }
            try {
              await clearToken();
              resetData();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Exit partner view error:', error);
              Alert.alert('Error', 'Could not exit partner view. Please try again.');
            }
          },
        },
      ],
      { cancelable: true },
    );
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
            {primaryUserName
              ? `Viewing ${primaryUserName}'s data`
              : 'Viewing partner data'}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <Text style={styles.mainHeading}>Main Features</Text>
          {mainFeatures.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.featuresView}
              activeOpacity={0.5}
              onPress={() => handleSingleNavigation(item)}
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
          ))}
          <Text style={styles.mainHeading}>Additional Tools</Text>
          {additionalTools.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.featuresView}
              activeOpacity={0.5}
              onPress={() => handleSingleNavigation(item)}
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
          ))}
          <View style={{ marginTop: 16 }}>
            <Button
              title="Exit partner view"
              onPress={handleExitPartnerView}
              disabled={false}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

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
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { clearToken } from '../../services/api';
import { useOnboarding } from '../../context/OnboardingContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function More() {
  const navigation = useNavigation<NavigationProp>();
  const { resetData } = useOnboarding();

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
      subtitle: 'Manage your account and preferences',
      icon: images.userIcon,
      navigateTo: 'Profile' as const,
    },
    {
      id: 3,
      title: 'Challenges',
      subtitle: 'Join wellness challenges',
      icon: images.challengesIcon,
      navigateTo: 'ChallengeHub' as const,
    },
    {
      id: 4,
      title: 'Connect Partner',
      subtitle: 'Share your cycle insights',
      icon: images.multipleUsers,
      navigateTo: 'PartnerConnect' as const,
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
      subtitle: 'Intermittent fasting logs',
      icon: images.currentPhaseIconMain,
      navigateTo: 'FastingHome' as const,
    },
    {
      id: 8,
      title: 'Sleep Tracker',
      subtitle: 'Monitor your sleep quality',
      icon: images.periodCalender,
      navigateTo: 'SleepTracker' as const,
    },
  ];

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearToken();
              resetData();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
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
            Explore additional features and settings
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
            <Button title="Logout" onPress={handleLogout} disabled={false} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

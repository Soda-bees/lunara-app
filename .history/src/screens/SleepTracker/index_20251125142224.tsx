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

export default function SleepTracker() {
  const navigation = useNavigation<NavigationProp>();
  const emojis = ['😄', '🙂', '😐', '😞'];
  const energyEmojis = [
    images.energizedEmoji,
    images.highEmoji,
    images.mediumEmoji,
  ];

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ gap: 16 }}>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>Sleep Tracking</Text>
                <TouchableOpacity style={styles.plusBtn}>
                  <Text style={styles.textMaroon}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.textBlackNormal}>
                Your most important recovery tool
              </Text>
              <View style={styles.rowFlexBox}>
                <View style={styles.flexBox}>
                  <View style={styles.row}>
                    <Image source={images.energyHigh} style={styles.icon} />
                    <Text style={styles.greenText}>Energy Level</Text>
                  </View>
                  <Text style={styles.heading}>8.2</Text>
                </View>
                <View style={styles.flexBox}>
                  <View style={styles.row}>
                    <Image source={images.energyHigh} style={styles.icon} />
                    <Text style={styles.greenText}>Best For</Text>
                  </View>
                  <Text style={styles.heading}>3.9/5</Text>
                </View>
              </View>
            </View>
          </GradientWrapper>

          <GradientWrapper variant="primary"></GradientWrapper>
        </View>
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

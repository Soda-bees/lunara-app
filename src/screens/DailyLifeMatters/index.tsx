import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import styles from './style';
import images from '../../constants/images';
import GradientText from '../../components/GradientText';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import LottieView from 'lottie-react-native';
type Props = NativeStackScreenProps<
  RootStackParamList,
  'DailyLifeMatters' | 'Lifestyle'
>;
export const DailyLifeMatters: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);
  return (
    <ScreenContainer backgroundImage>
      <View style={styles.header}>
        <View>
          {/* <Image source={images.twinkleStar} style={styles.prettyLadyStyle} /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/Lifestyles.json')}
              autoPlay
              loop={true}
              style={StyleSheet.absoluteFill}
              ref={ref}
            />
          </View>

          <GradientText
            fontFamily="PlayfairDisplay-SemiBold"
            style={styles.title}
          >
            Your Daily Life Matters
          </GradientText>

          <Text style={styles.body}>
            We all have different schedules, responsibilities, and lifestyles.
            Whether you're a busy professional, a parent, a student, or juggling
            multiple roles - we'll create a plan that fits YOUR life, not the
            other way around.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Share My Lifestyle"
            onPress={() => navigation.navigate('Lifestyle')}
            // onPress={() => navigation.navigate('LetsGetStarted')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

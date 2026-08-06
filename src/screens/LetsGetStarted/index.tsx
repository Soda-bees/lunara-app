import { View, Text, Image, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import styles from './style';
import images from '../../constants/images/onboarding';
import GradientText from '../../components/GradientText';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import LottieView from 'lottie-react-native';
type Props = NativeStackScreenProps<
  RootStackParamList,
  'LetsGetStarted' | 'BasicInfo'
>;
export const LetsGetStarted: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);
  return (
    <ScreenContainer backgroundImage>
      <View style={styles.header}>
        <View>
          {/* <Image source={images.getToKnowImg} style={styles.prettyLadyStyle} /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/LetsGetStarted.json')}
              autoPlay
              loop={true}
              style={StyleSheet.absoluteFill}
              ref={ref}
            />
          </View>
          <View style={styles.selfCenter}>
            <GradientText
              fontFamily="PlayfairDisplay-SemiBold"
              style={styles.title}
            >
              Personalize Your Wellness Experience
            </GradientText>
          </View>
          <Text style={styles.body}>
            Before we create your personalized wellness plan, we'd love to learn
            a bit about you. Don't worry - this will only take a few minutes,
            and everything you share helps us support you better.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Tell Me More"
            onPress={() => navigation.navigate('BasicInfo')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

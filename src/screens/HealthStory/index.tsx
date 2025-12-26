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
  'HealthStory' | 'MedicalInfo'
>;

export const HealthStory: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);

  return (
    <ScreenContainer backgroundImage>
      <View style={styles.header}>
        <View>
          {/* <Image source={images.healthApple} style={styles.prettyLadyStyle} /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/HealthStory.json')}
              autoPlay
              loop={true}
              style={StyleSheet.absoluteFill}
              ref={ref}
            />
          </View>
          <View style={styles.selfCenter}>
            <Text style={styles.title}>Your Health Story</Text>
          </View>
          <Text style={styles.body}>
            Your health history helps us create a safe and personalized plan.
            Share only what you're comfortable with - we're here to support you,
            and everything you tell us stays private and secure.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Continue"
            onPress={() => navigation.navigate('MedicalInfo')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

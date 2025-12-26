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
  'YoureDoingGreat' | 'Goals'
>;

export const YoureDoingGreat: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);

  return (
    <ScreenContainer backgroundImage>
      <View style={styles.header}>
        <View>
          {/* <Image source={images.doingGreat} style={styles.prettyLadyStyle} /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/DoingGreat.json')}
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
              You're Doing Great!
            </GradientText>
          </View>
          <Text style={styles.body}>
            Now that we know a bit about you, let's talk about your goals. What
            do you want to achieve on this journey? Remember, there's no right
            or wrong answer - this is about what matters to YOU.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Let’s Set Goals"
            onPress={() => navigation.navigate('Goals')}
            // onPress={() => navigation.navigate('LetsGetStarted')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

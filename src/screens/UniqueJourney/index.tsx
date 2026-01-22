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
  'UniqueJourney' | 'WomenHealth'
>;
export const UniqueJourney: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);
  return (
    <ScreenContainer backgroundImage>
      <View style={styles.header}>
        <View>
          {/* <Image source={images.unique} style={styles.prettyLadyStyle} /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/UniqueJourney.json')}
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
              Your Unique Journey
            </GradientText>
          </View>
          <Text style={styles.body}>
            As women, our bodies have unique needs that change throughout our
            cycles. Understanding your cycle and hormonal health helps us create
            a plan that truly works WITH your body, not against it. Let's
            explore this together.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Continue"
            onPress={() => navigation.navigate('WomenHealth')}
            // onPress={() => navigation.navigate('LetsGetStarted')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

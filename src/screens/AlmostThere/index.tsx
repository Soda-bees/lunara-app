import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from './style';
import images from '../../constants/images';
import GradientText from '../../components/GradientText';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AlmostThere' | 'MedicalInfo'
>;

export const AlmostThere: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Image
            source={images.celebrationIcon}
            style={styles.prettyLadyStyle}
          />
          <View style={styles.selfCenter}>
            <Text style={styles.title}>Almost There!</Text>
          </View>
          <Text style={styles.body}>
            You've shared so much valuable information with us. We're putting
            together your personalized wellness plan right now. Get ready to
            meet your new companion for health, wellness, and self-care!
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Let's Finish"
            onPress={() => navigation.navigate('OnboardingComplete')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

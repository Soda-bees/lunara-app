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
  'HealthStory' | 'MedicalInfo'
>;

export const HealthStory: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Image source={images.healthApple} style={styles.prettyLadyStyle} />
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

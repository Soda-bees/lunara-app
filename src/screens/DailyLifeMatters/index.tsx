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
  'DailyLifeMatters' | 'Lifestyle'
>;

export const DailyLifeMatters: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Image source={images.twinkleStar} style={styles.prettyLadyStyle} />
          <View style={styles.selfCenter}>
            <Text style={styles.title}>Your Daily Life Matters</Text>
          </View>
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

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
  'FuelAndJoy' | 'DietaryPreferences'
>;

export const FuelAndJoy: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Image source={images.fuel} style={styles.prettyLadyStyle} />
          <View style={styles.selfCenter}>
            <GradientText
              fontFamily="PlayfairDisplay-SemiBold"
              style={styles.title}
            >
              Food is Fuel & Joy
            </GradientText>
          </View>
          <Text style={styles.body}>
            Nutrition is so much more than calories - it's about nourishing your
            body, supporting your hormones, and finding foods that make you feel
            amazing. Let's discover what works best for your unique needs and
            preferences.
          </Text>
        </View>
        <View style={styles.actions}>
          <EmpatheticButton
            title="Let’s Talk Food"
            onPress={() => navigation.navigate('DietaryPreferences')}
            // onPress={() => navigation.navigate('LetsGetStarted')}
          />
        </View>
      </View>
    </ScreenContainer>
    // </SafeAreaView>
  );
};

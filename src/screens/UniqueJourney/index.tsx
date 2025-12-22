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
  'UniqueJourney' | 'WomenHealth'
>;

export const UniqueJourney: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Image source={images.unique} style={styles.prettyLadyStyle} />
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

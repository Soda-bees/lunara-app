import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import styles from './style';
import { RootStackParamList } from '../../navigation/stackNavigation';
import Button from '../../components/Button';
import images from '../../constants/images';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Welcome' | 'AccountSetup'
>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer color="#FFE4E8">
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={images.prettyLady} style={styles.prettyLadyStyle} />
          <Text style={styles.title}>Welcome to Lunara</Text>
          <Text style={styles.subtitle}>
            Your personal companion for health, wellness, and self-care.
          </Text>
          <Text style={styles.body}>
            We're here to support you every step of the way on your wellness
            journey. Let's create a plan that's uniquely yours.
          </Text>
        </View>

        <View style={styles.actions}>
          <EmpatheticButton
            title="Let's Begin"
            onPress={() => navigation.navigate('AccountSetup')}
          />
          <Text style={styles.bottomText}>You've got this! 💪</Text>
          {/* <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.link}>Skip for now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>I already have an account</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </ScreenContainer>
  );
};

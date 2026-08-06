import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images/onboarding';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function YourStrengthTransition() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    navigation.navigate('Weight');
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.mainContainer}>
        <View style={{ position: 'absolute' }}>
          <BackButton />
        </View>
        <Image source={images.strengthImage} style={styles.resetSuccess} />
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Your body, your strength</Text>
          <Text style={styles.paraText}>
            A few questions about your body will help us give more accurate
            health insights — no judgments here, just care.
          </Text>
        </View>

        <View style={styles.bottomButton}>
          <Button title="Continue" onPress={handlePress} loader={loader} />
        </View>
      </View>
    </SafeAreaView>
  );
}

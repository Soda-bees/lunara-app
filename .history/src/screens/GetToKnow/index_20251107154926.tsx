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
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function GetToKnow() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    navigation.navigate('SignIn');
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
        <BackButton />
        <Image source={images.resetSuccess} style={styles.resetSuccess} />
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Let’s get to know you better </Text>
          <Text style={styles.paraText}>
            We’d love to personalize your experience — a profile photo helps
            make your space here feel more like you! 
          </Text>
        </View>

        <View style={styles.bottomButton}>
          <Button title="Continue" onPress={handlePress} loader={loader} />
        </View>
      </View>
    </SafeAreaView>
  );
}

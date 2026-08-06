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
import images from '../../constants/images/auth';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
type NavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'ResetSuccess'>;

export default function ResetSuccess() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    navigation.navigate('Login');
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
        <Image source={images.resetSuccess} style={styles.resetSuccess} />
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Congratulations!! </Text>
          <Text style={styles.paraText}>
            You’ve successfully updated your password. You{'\n'}can now sign in
            with your new credentials.
          </Text>
        </View>

        <View style={styles.bottomButton}>
          <Button title="Sign In" onPress={handlePress} loader={loader} />
        </View>
      </View>
    </SafeAreaView>
  );
}

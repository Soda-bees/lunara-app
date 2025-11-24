import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
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
import Button from '../../components/Button';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function WhoIsTheUser() {
  const navigation = useNavigation<NavigationProp>();
  const [imageUri, setImageUri] = useState<string | undefined>('');

  const handlePress = () => {
    navigation.navigate('GetToKnow');
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
      <BackButton />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.forgotText}>Hi IsaBella</Text>
              <Text style={styles.paraText}>
                Is Lunara For Your personal use?
              </Text>
            </View>
          </View>

          <View style={styles.bottomButton}>
            <Button
              title="Continue"
              onPress={handlePress}
              // disabled={!imageUri}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

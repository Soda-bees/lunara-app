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

export default function BirthdayInput() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
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
              <Text style={styles.forgotText}>When is Your Birthday</Text>
              <Text style={styles.paraText}>
                Knowing your birthdate helps us personalize your cycle and
                wellness insights — just for you.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 40,
              }}
            >
              <TextInput
                placeholder="DD"
                placeholderTextColor={colors.gray}
                maxLength={2}
                keyboardType="number-pad"
                style={[styles.inputBox, { width: 70 }]}
              />
              <TextInput
                placeholder="MM"
                placeholderTextColor={colors.gray}
                maxLength={2}
                keyboardType="number-pad"
                style={[styles.inputBox, { width: 70 }]}
              />
              <TextInput
                placeholder="YYYY"
                placeholderTextColor={colors.gray}
                maxLength={4}
                keyboardType="number-pad"
                style={[styles.inputBox, { width: 100 }]}
              />
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button title="Continue" onPress={handlePress} loader={loader} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

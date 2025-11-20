import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './style';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function BirthdayInput() {
  const navigation = useNavigation<NavigationProp>();

  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [showPicker, setShowPicker] = useState(false);

  const handlePress = async () => {
    navigation.navigate('PregnancyStatus');
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
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

            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateBoxText}>
                {birthday
                  ? `${(birthday.getMonth() + 1)
                      .toString()
                      .padStart(2, '0')}-${birthday
                      .getDate()
                      .toString()
                      .padStart(2, '0')}-${birthday.getFullYear()}`
                  : 'Select your birthday'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={birthday || new Date(2000, 0, 1)}
              mode="date"
              display="spinner" // this gives iOS style wheel
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setBirthday(selectedDate);
              }}
            />
          )}

          <View style={styles.bottomButton}>
            <Button
              title="Continue"
              onPress={handlePress}
              disabled={!birthday}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

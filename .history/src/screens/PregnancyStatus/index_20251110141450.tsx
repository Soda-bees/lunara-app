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
import styles from './style';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PregnancyStatus() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedOption, setSelectedOption] = useState<
    'trying' | 'not interested' | 'yes' | null
  >(null);
  const handlePress = () => {
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
      <BackButton />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.forgotText}>Are You currently Pregnant?</Text>
              <Text style={styles.paraText}>
                Whether you're expecting or just planning ahead, we’ll tailor
                your experience based on your current journey.
              </Text>
            </View>
            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'trying' && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption('trying')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === 'trying' && styles.optionTextSelected,
                  ]}
                >
                  Not yet, but I'm trying
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'not interested' &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption('not interested')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === 'not interested' &&
                      styles.optionTextSelected,
                  ]}
                >
                  No, I’m here to learn more about my body
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'yes' && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption('yes')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === 'yes' && styles.optionTextSelected,
                  ]}
                >
                  No, I have a partner code
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomButton}>
            <Button title="Continue" onPress={handlePress} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

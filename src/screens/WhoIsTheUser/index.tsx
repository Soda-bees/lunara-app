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
import GradientText from '../../components/GradientText';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function WhoIsTheUser() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedOption, setSelectedOption] = useState<
    'self' | 'partner' | null
  >(null);
  const handlePress = () => {
    // Only allow navigation for personal use
    if (selectedOption === 'self') {
      navigation.navigate('SignIn');
    }
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
              <GradientText
                fontFamily="PlayfairDisplay-SemiBold"
                style={styles.title}
              >
                Hi!
              </GradientText>
              <Text style={styles.paraText}>
                Is Lunara For Your personal use?
              </Text>
            </View>
            <View style={{ marginTop: 30 }}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'self' && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption('self')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === 'self' && styles.optionTextSelected,
                  ]}
                >
                  Yes, I'm using it for myself
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === 'partner' && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption('partner')}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === 'partner' && styles.optionTextSelected,
                  ]}
                >
                  No, I have a partner code
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomButton}>
            <Button
              title="Continue"
              onPress={handlePress}
              disabled={selectedOption !== 'self'}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

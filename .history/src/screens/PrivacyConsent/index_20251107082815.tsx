import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';

import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PrivacyConsent() {
  const navigation = useNavigation<NavigationProp>();

  const [consentData, setConsentData] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const handleContinue = () => {
    if (!consentData || !consentTerms) return;
    navigation.navigate('SignUp'); // or next screen
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={styles.mainCart}>
        <Text style={styles.heading}>Your body. Your data</Text>
        <Text style={styles.disabledText}>
          Your health data is yours. It will never be shared with anyone outside
          of Lunara, and you can delete it anytime you wish.
        </Text>

        <View style={styles.row}>
          <Checkbox
            status={consentData ? 'checked' : 'unchecked'}
            onPress={() => setConsentData(!consentData)}
            color="#E799AD"
          />
          <Text style={styles.textBlackSmall}>
            I agree to the processing of my personal health data to enable
            Lunara’s app features.{' '}
            <Text style={styles.underlineText}>Privacy Policy</Text>.
          </Text>
        </View>

        <View style={[styles.row, { marginTop: 10 }]}>
          <Checkbox
            status={consentTerms ? 'checked' : 'unchecked'}
            onPress={() => setConsentTerms(!consentTerms)}
            color="#E799AD"
          />
          <Text style={styles.textBlackSmall}>
            I agree to the{' '}
            <Text style={styles.underlineText}>Privacy Policy</Text> and{' '}
            <Text style={styles.underlineText}>Terms of Use</Text>.
          </Text>
        </View>

        <View style={{ marginTop: 30 }}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!consentData || !consentTerms}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

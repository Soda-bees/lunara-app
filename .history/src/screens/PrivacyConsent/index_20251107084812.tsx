import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PrivacyConsent() {
  const navigation = useNavigation<NavigationProp>();
  const [consentData, setConsentData] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const handleContinue = () => {
    if (!consentData || !consentTerms) return;
    navigation.navigate('SignUp');
  };

  // reusable local checkbox (inline)
  const RoundCheckbox = ({ checked, onPress }: any) => (
    <Pressable onPress={onPress} style={{ padding: 4 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 1.5,
          borderColor: checked ? '#E5A484' : '#C7C7C7',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? '#E5A484' : 'transparent',
        }}
      >
        {checked && <Icon name="checkmark" size={16} color="#fff" />}
      </View>
    </Pressable>
  );

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
      <View style={styles.mainCart}>
        <Image style={styles.logoFull} source={images.logoFull} />

        <View style={styles.textContainer}>
          <Text style={styles.heading}>Your body. Your data</Text>
          <Text style={styles.disabledText}>
            Your health data is yours. It will never be shared with anyone
            outside of Lunara, and you can delete it anytime you wish.
          </Text>
        </View>

        <View style={styles.row}>
          <RoundCheckbox
            checked={consentData}
            onPress={() => setConsentData(!consentData)}
          />
          <Text style={styles.textBlackSmall}>
            I agree to the processing of my personal health data to enable
            Lunara’s app features.{' '}
            <Text style={styles.underlineText}>Privacy Policy</Text>.
          </Text>
        </View>

        <View style={styles.row}>
          <RoundCheckbox
            checked={consentTerms}
            onPress={() => setConsentTerms(!consentTerms)}
          />
          <Text style={styles.textBlackSmall}>
            I agree to the{' '}
            <Text style={styles.underlineText}>Privacy Policy</Text> and{' '}
            <Text style={styles.underlineText}>Terms of Use</Text>.
          </Text>
        </View>

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!consentData || !consentTerms}
        />
      </View>
    </SafeAreaView>
  );
}

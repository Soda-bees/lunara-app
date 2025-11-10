import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PrivacyConsent() {
  const navigation = useNavigation<NavigationProp>();
  const [checked, setChecked] = useState<boolean>(false);
  const [checked2, setChecked2] = useState<boolean>(false);
  const handleContinue = async () => {};

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
          <TouchableOpacity
            style={{ marginRight: sizes.screenWidth * 0.02 }}
            onPress={() => {
              setChecked(!checked);
            }}
          >
            <Image
              source={checked ? images.checked : images.check}
              style={styles.inputIcon}
            />
          </TouchableOpacity>
          <Text style={styles.textBlackSmall}>
            I Agree To The Processing Of My Personal{'\n'}Health Data To Enable
            Lunara’s App Features. {'\n'}Learn More In Our{' '}
            <Text style={styles.underlineText} onPress={handleUnderlineText}>
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={{ marginRight: sizes.screenWidth * 0.02 }}
            onPress={() => {
              setChecked2(!checked2);
            }}
          >
            <Image
              source={checked2 ? images.checked : images.check}
              style={styles.inputIcon}
            />
          </TouchableOpacity>
          <Text style={styles.textBlackSmall}>
            I agree to the{' '}
            <Text
              style={[
                styles.underlineText,
                {
                  color: '#E678BD',
                },
              ]}
              onPress={handleUnderlineText}
            >
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text
              style={[
                styles.underlineText,
                {
                  color: '#E678BD',
                },
              ]}
              onPress={handleUnderlineText}
            >
              Terms of{'\n'}
              <Text
                style={{
                  color: '#B388EB',
                }}
              >
                Use
              </Text>
            </Text>
            .
          </Text>
        </View>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

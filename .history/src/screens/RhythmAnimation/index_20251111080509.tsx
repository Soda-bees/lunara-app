import React, { JSX, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StatusBar,
  Text,
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
const { width: screenWidth } = Dimensions.get('window');
const CIRCLE_SIZE = 280;
const ICON_SIZE = screenWidth * 0.14;
const CENTER_OFFSET = CIRCLE_SIZE / 2 - ICON_SIZE / 2;
const icons = [
  images.cycleFlower,
  images.cycleBloodDrop,
  images.cycleMoon,
  images.cycleHeart,
];
const iconPositions = [
  { top: 20, left: CENTER_OFFSET },
  { top: CENTER_OFFSET, left: CIRCLE_SIZE - ICON_SIZE },
  { top: CIRCLE_SIZE - ICON_SIZE, left: CENTER_OFFSET },
  { top: CENTER_OFFSET, left: 20 },
];
export default function RhythmAnimation() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    // navigation.navigate('UploadProfile');
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
        <View style={{ position: 'absolute' }}>
          <BackButton />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Your journey starts here</Text>
          <Text style={styles.paraText}>
            Whether you’re tracking cycles, trying to conceive, or understanding
            your body better — we’re here for you.
          </Text>
        </View>

        <View style={styles.bottomButton}>
          <Button title="Continue" onPress={handlePress} loader={loader} />
        </View>
      </View>
    </SafeAreaView>
  );
}

import React, { JSX, useEffect, useRef, useState } from 'react';
import {
  Animated,
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

export default function RhythmAnimation() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    // navigation.navigate('UploadProfile');
  };
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 8000, // one lap in 8 s
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spin]);

  const rotateOrbit = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  /* keep microscope upright */
  const keepUpright = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
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

        {/* Pivot at calendar centre */}
        <Animated.View
          style={[
            styles.microscopePivot,
            {
              // 45 ° offset so start point is lower‑right
              transform: [{ rotate: '0deg' }, { rotate: rotateOrbit }],
            },
          ]}
        >
          {/* ① shove outwards to orbit radius   ② counter‑rotate to stay upright */}
          <Animated.Image
            source={images.microscope}
            style={[
              styles.microscopeImg,
              {
                transform: [
                  { translateX: -30 }, // radius (tweak if needed)
                  { rotate: keepUpright },
                ],
              },
            ]}
          />
        </Animated.View>
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

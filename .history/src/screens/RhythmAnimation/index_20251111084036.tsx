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
import Button from '../../components/Button';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
const { width: screenWidth } = Dimensions.get('window');
const ICON_SIZE = screenWidth * 0.14;

const icons = [
  images.cycleFlower,
  images.cycleBloodDrop,
  images.cycleMoon,
  images.cycleHeart,
];

const circleRadius = (screenWidth * 0.65) / 2;

// orbit icons slightly outside (3% of screen width outward)
const iconRadius = circleRadius - ICON_SIZE / 2 + screenWidth * 0.03;

const anglePositions = [40, 130, 180, 270]; // degrees

export default function RhythmAnimation() {
  const navigation = useNavigation<NavigationProp>();
  const [loader, setLoader] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = async () => {
    // navigation.navigate('UploadProfile');
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const counterSpin = rotateAnim.interpolate({
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

        <View style={styles.circleContainer}>
          <Image
            source={images.cyclePhaseImage}
            style={styles.staticImage}
            resizeMode="contain"
          />

          <Text style={styles.heading}>Your&nbsp;Day</Text>
          <Text style={styles.centerText}>Your&nbsp;Phase</Text>

          {/* rotating ring of icons */}
          <Animated.View
            style={[styles.rotatingLayer, { transform: [{ rotate: spin }] }]}
          >
            {icons.map((icon, idx) => {
              const angle = (anglePositions[idx] * Math.PI) / 180;
              const x =
                iconRadius * Math.cos(angle) + circleRadius - ICON_SIZE / 2;
              const y =
                iconRadius * Math.sin(angle) + circleRadius - ICON_SIZE / 2;

              return (
                <Animated.Image
                  key={idx}
                  source={icon}
                  style={[
                    styles.icon,
                    { top: y, left: x, transform: [{ rotate: counterSpin }] },
                  ]}
                />
              );
            })}
          </Animated.View>
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

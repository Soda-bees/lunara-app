import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SliderDot from '../../components/SliderDot';
import { sizes } from '../../constants/sizes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import styles from './style';
import { introSlides } from '../../constants/content/introslides';
import useSlideAnim from '../../hooks/useSlideAnim';
import Button from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function IntroSlider() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideAnim = useSlideAnim(currentIndex);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < introSlides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    }
  };

  const handleSkip = () => {
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  return (
    <SafeAreaView
      style={styles.containerMain}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <TouchableOpacity onPress={handleSkip} style={{zIndex+ 10}}>
        <LinearGradient
          colors={['#E4AF5D', '#E799AD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.skipBtn}
        >
          <Text style={styles.skipTxt}>Skip</Text>
        </LinearGradient>
      </TouchableOpacity>
      <FlatList
        horizontal
        data={introSlides}
        ref={flatListRef}
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View
            style={{ width: sizes.screenWidth, height: sizes.screenHeight }}
          >
            <ImageBackground
              source={item.image}
              style={{
                width: sizes.screenWidth,
                height: sizes.screenWidth * (782 / 804),
              }}
              resizeMode="contain"
            >
              {index === currentIndex && (
                <Animated.View
                  style={[
                    styles.imgContainer,
                    { transform: [{ translateX: slideAnim }] },
                  ]}
                >
                  <Image source={item.smallImg} style={styles.img} />
                </Animated.View>
              )}
            </ImageBackground>

            <View style={styles.textView}>
              <Text style={[styles.title, { color: item.color }]}>
                {item.title}
              </Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.lastView}>
        <View style={styles.dotContainer}>
          {introSlides.map((_, i) => (
            <SliderDot key={i} active={i === currentIndex} />
          ))}
        </View>

        <View style={styles.btnContainer}>
          <Button title="Next" onPress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

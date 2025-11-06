import React, { JSX, useEffect, useRef, useState } from 'react';
import styles from './style';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
const sliderData = [
  {
    image: images.sliderBG1,
    smallImg: images.sliderBGInside1,
    title: 'Welcome & Positioning',
    desc: 'Welcome to Lunara your comprehensive women’s wellness guide.',
  },
  {
    image: images.sliderBG2,
    smallImg: images.sliderBGInside2,
    title: 'Hormones & Biohacking',
    desc: 'Your hormones shift daily. Biohacks like light, fasting, and movement help youwork with your body instead of against it.',
  },
  {
    image: images.sliderBG3,
    smallImg: images.sliderBGInside3,
    title: 'Hormones & Epigenetics',
    desc: 'Your choices can upregulate or downregulate gene expression. Nutrition, sleep, and stress directly influence how your hormones function.',
  },
  {
    image: images.sliderBG4,
    smallImg: images.sliderBGInside4,
    title: 'Hormones & Gut Health',
    desc: 'Your gut and your cycle are connected. Cravings, energy, and mood all tie back togut balance.',
  },
  {
    image: images.sliderBG5,
    smallImg: images.sliderBGInside5,
    title: 'Comprehensive Promise',
    desc: 'Lunara is the all-in-one women’s wellness app that will guide your daily journey with science-backed recommendations.',
  },
];

const IntroSlider = () => {
  const navigation = useNavigation<NavigationProp>();

  const lastIndex = sliderData.length - 1;

  const { width } = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    slideAnim.setValue(width); // start from right side

    Animated.spring(slideAnim, {
      toValue: 0,
      speed: 1,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleNext = () => {
    if (currentIndex < sliderData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      // navigation.navigate('Landing')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Landing' }],
      });
    }
  };

  const handleScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const isAtEnd =
      Math.round(contentOffset.x + layoutMeasurement.width) >=
      Math.round(contentSize.width);

    // when user is at lastIndex and swipes left again (overscroll)
    if (currentIndex === lastIndex && isAtEnd) {
      console.log('User tried to scroll past the last slide — navigate now');
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <View
        style={[
          styles.container,
          {
            width,
            height: sizes.screenHeight + insets.top,
            paddingBottom: insets.bottom + 10 || 16,
            top: -insets.top,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            data={sliderData}
            ref={flatListRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onMomentumScrollEnd={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <ImageBackground
                source={item.image}
                style={[
                  styles.flatList,
                  { width, height: sizes.screenHeight + insets.top },
                ]}
                resizeMode="cover"
              >
                {currentIndex === index && (
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
            )}
          />
          <View style={styles.textView}>
            <Text style={styles.title}>{sliderData[currentIndex].title}</Text>
            <Text style={styles.desc}>{sliderData[currentIndex].desc}</Text>
          </View>
          <View
            style={[
              styles.lastView,
              { bottom: insets.bottom, width: sizes.screenWidth },
            ]}
          >
            <View style={styles.dotContainer}>
              {sliderData.map((_, index) => {
                const isActive = index === currentIndex;
                const animatedWidth = useRef(
                  new Animated.Value(isActive ? 24 : 8),
                ).current;

                useEffect(() => {
                  Animated.timing(animatedWidth, {
                    toValue: isActive ? 24 : 8,
                    duration: 300,
                    useNativeDriver: false,
                  }).start();
                }, [isActive]);

                return (
                  <Animated.View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        width: animatedWidth,
                        backgroundColor: isActive ? '#000' : '#C4C4C4',
                      },
                    ]}
                  />
                );
              })}
            </View>
            <TouchAnimation
              slow
              onPress={() => handleNext()}
              containerStyle={styles.nextButton}
            >
              <Text>Next</Text>
            </TouchAnimation>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default IntroSlider;

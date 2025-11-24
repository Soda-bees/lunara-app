// components/WeightSlider.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  Vibration,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

type Props = {
  value: number;
  unit: 'kg' | 'lb';
  onChange: (newValue: number) => void;
};

const WeightSlider = ({ value, unit, onChange }: Props) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const kgData = Array.from({ length: 201 + VISIBLE_ITEMS }, (_, i) => i);
  const lbData = Array.from({ length: 441 + VISIBLE_ITEMS }, (_, i) => i);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: value * ITEM_WIDTH,
        animated: false,
      });
    }, 10);
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const v = Math.round(x / ITEM_WIDTH);
        onChange(v);
        Vibration.vibrate(5);
      },
    },
  );

  const renderItem = useCallback(({ item }: { item: number }) => {
    const isMajor = item % 10 === 0;
    const isHalf = item % 5 === 0;
    return (
      <View style={styles.tickContainer}>
        {isMajor && <Text style={styles.tickLabel}>{item}</Text>}
        <View
          style={[
            styles.tick,
            isMajor && styles.footTick,
            isHalf && styles.halfFootTick,
          ]}
        />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.heightView}>
        <Text style={styles.label}>
          Weight (In {unit === 'kg' ? 'Kg' : 'Lb'})
        </Text>
      </View>

      <Text style={styles.value}>
        {value} <Text style={styles.unit}>{unit}</Text>
      </Text>

      <View style={styles.rulerContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={unit === 'kg' ? kgData : lbData}
          renderItem={renderItem}
          keyExtractor={item => item.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (width - ITEM_WIDTH) / 2.42,
          }}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      </View>
    </View>
  );
};

export default WeightSlider;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  heading: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.h4,
    fontWeight: '500',
    color: colors.black,
    marginTop: sizes.screenHeight * 0.02,
  },

  disabledText: {
    fontFamily: 'HBG-Medium',
    fontSize: fontSize.medium,
    color: colors.disabledText,
    marginBottom: sizes.screenHeight * 0.03,
  },

  container: {
    marginTop: 80,
    alignItems: 'center',
    backgroundColor: colors.white,
    width: sizes.screenWidth * 0.9,
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: sizes.screenWidth * 0.06,
    alignSelf: 'center',
  },

  label: {
    fontSize: fontSize.extraLarge,
    fontFamily: 'MP-Medium',
  },

  unitToggle: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
  },

  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 35,
    backgroundColor: '#eee',
  },

  activeToggle: {
    backgroundColor: colors.primary,
  },

  activeText: {
    color: '#fff',
    fontFamily: 'MP-Medium',
  },

  inactiveText: {
    color: '#333',
    fontFamily: 'MP-Medium',
  },

  value: {
    fontSize: 40,
    marginBottom: 15,
    marginTop: sizes.screenHeight * 0.06,
    fontFamily: 'MP-Bold',
  },

  rulerContainer: {
    height: sizes.screenHeight * 0.1,
    paddingHorizontal: 10,
  },

  tickContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  tick: {
    width: 2,
    height: 35,
    backgroundColor: 'gray',
  },

  halfFootTick: {
    height: 60,
    backgroundColor: '#FF70A6',
    width: sizes.screenWidth * 0.007,
  },

  footTick: {
    height: 40,
    backgroundColor: 'red',
  },

  tickLabel: {
    fontSize: fontSize.medium,
    marginTop: 2,
    color: colors.disabledText,
    fontFamily: 'MP-Medium',
    width: sizes.screenWidth * 0.07,
    marginLeft: 7,
  },

  centerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'black',
    left: width / 2.3,
  },

  heightView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: sizes.screenWidth * 0.9,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 17,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },

  unit: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
    marginTop: -10,
    textAlignVertical: 'top',
    fontFamily: 'MP-Medium',
  },
});

// components/WeightSlider.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  Vibration,
  FlatList,
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
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const kgData = Array.from({ length: 201 + VISIBLE_ITEMS }, (_, i) => i);
  const lbData = Array.from({ length: 441 + VISIBLE_ITEMS }, (_, i) => i);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const x = event.nativeEvent.contentOffset.x;
        const newVal = Math.round(x / ITEM_WIDTH);
        if (newVal !== value) {
          Vibration.vibrate(10);
          onChange(newVal);
        }
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

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.heightView}>
        <Text style={styles.label}>Weight (In Lb)</Text>

        <View style={styles.unitToggle}>
          {unit === 'lb' ? (
            <LinearGradient
              colors={['#FA71AA', '#B687E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.toggleButton, styles.activeToggle]}
            >
              <Text style={styles.activeText}>lb</Text>
            </LinearGradient>
          ) : (
            <View style={styles.toggleButton}>
              <Text style={styles.inactiveText}>lb</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.value}>
        {value}
        <Text style={styles.unit}> {unit === 'kg' ? 'Kg' : 'Lb'}</Text>
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
          getItemLayout={getItemLayout}
          initialNumToRender={30}
          maxToRenderPerBatch={35}
          windowSize={10}
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

  unit: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
    marginTop: -10,
    textAlignVertical: 'top',
    fontFamily: 'MP-Medium',
  },
});

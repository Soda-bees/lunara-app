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
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

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

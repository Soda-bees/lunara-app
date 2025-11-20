import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  Dimensions,
  Vibration,
  Platform,
  StatusBar,
} from 'react-native';
import styles from './style';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20; // width per tick

const Height = () => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const MIN_INCHES = 36; // 3 feet
  const MAX_INCHES = 84; // 7 feet
  const [selectedInches, setSelectedInches] = useState(68); // default 5'8"

  const inchesData = Array.from(
    { length: MAX_INCHES - MIN_INCHES + 1 },
    (_, i) => i + MIN_INCHES,
  );

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const value =
          Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH) +
          MIN_INCHES;
        if (value !== selectedInches) {
          Vibration.vibrate(10);
          setSelectedInches(value);
        }
      },
    },
  );

  const renderItem = useCallback(({ item }: { item: number }) => {
    const feet = Math.floor(item / 12);
    const inches = item % 12;
    const isMajor = inches === 0; // major tick at full feet
    return (
      <View style={styles.tickContainer}>
        {isMajor && <Text style={styles.tickLabel}>{feet}'</Text>}
        <View style={[styles.tick, isMajor && styles.footTick]} />
      </View>
    );
  }, []);

  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const renderHeightValue = () => {
    const feet = Math.floor(selectedInches / 12);
    const inches = selectedInches % 12;
    return <Text style={styles.value}>{`${feet}' ${inches}"`}</Text>;
  };

  const handleContinue = () => {
    console.log(`Selected height: ${renderHeightValue()}`);
    // You can send `selectedInches` to backend
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />

      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>How tall are you?</Text>
          <Text style={styles.paraText}>
            We use your height to help personalize your health insights.
          </Text>
        </View>

        <View style={styles.numberSLiderContainer}>
          {renderHeightValue()}

          <View style={styles.rulerContainer}>
            <Animated.FlatList
              ref={flatListRef}
              data={inchesData}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={onScroll}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
              contentContainerStyle={{
                paddingHorizontal: (width - ITEM_WIDTH) / 2,
              }}
            />
          </View>
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Height;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Vibration,
  Platform,
  StatusBar,
} from 'react-native';
import styles from './style';
import Button from '../../components/Button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type RouteProps = RouteProp<RootStackParamList, 'Weight'>;

const Height = () => {
  const navigation = useNavigation<NavigationProp>();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [unit, setUnit] = useState<'ft' | 'in'>('in');
  const [selectedValue, setSelectedValue] = useState(0); // default 68 inches (~5'8")
  const [isToggling, setIsToggling] = useState(false);

  const INCHES_MIN = 36;
  const INCHES_MAX = 84;
  const ITEM_WIDTH = 20;

  const inchesData = Array.from({ length: INCHES_MAX + 1 }, (_, i) => i);
  const feetData = Array.from({ length: 8 }, (_, i) => i); // 0-7 ft

  const handleUnitToggle = () => {
    setIsToggling(true);
    const newUnit = unit === 'in' ? 'ft' : 'in';
    const newValue =
      newUnit === 'in' ? selectedValue * 12 : Math.floor(selectedValue / 12);
    setUnit(newUnit);
    setSelectedValue(newValue);

    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: newValue * ITEM_WIDTH,
        animated: false,
      });
      setIsToggling(false);
    }, 10);
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        if (isToggling) return;
        const x = event.nativeEvent.contentOffset.x;
        const value = Math.round(x / ITEM_WIDTH);
        setSelectedValue(value);
      },
    },
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const isMajor = item % 12 === 0; // major tick for feet
      const isHalf = item % 6 === 0; // half tick
      return (
        <View style={styles.tickContainer}>
          {isMajor && (
            <Text style={styles.tickLabel}>
              {unit === 'ft' ? item : Math.floor(item / 12)}
            </Text>
          )}
          <View
            style={[
              styles.tick,
              isMajor && styles.footTick,
              isHalf && styles.halfFootTick,
            ]}
          />
        </View>
      );
    },
    [unit],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const renderHeightValue = () => {
    if (unit === 'in') {
      const feet = Math.floor(selectedValue / 12);
      const inches = selectedValue % 12;
      return <Text style={styles.value}>{`${feet}' ${inches}"`}</Text>;
    } else {
      return (
        <Text style={styles.value}>
          {selectedValue}
          <Text style={styles.unit}> ft</Text>
        </Text>
      );
    }
  };
  const handleContinue = () => {};

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
      <BackButton />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>How tall are you?</Text>
          <Text style={styles.paraText}>
            We use your height to help personalize your health insights.
          </Text>
        </View>

        <View style={styles.numberSLiderContainer}>
          <View style={styles.heightView}>
            <Text style={styles.label}>Height (e.g., 5' 4")</Text>
            <View style={styles.toggleContainer}>
              {/* <TouchableOpacity
                style={unit === 'ft' ? styles.btnSelected : styles.btn}
                onPress={() => unit !== 'ft' && handleUnitToggle()}
              >
                <Text style={styles.btnText}>ft</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={unit === 'in' ? styles.btnSelected : styles.btn}
                // onPress={() => unit !== 'in' && handleUnitToggle()}
              >
                <Text style={styles.btnText}>ft & in</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.value}>{renderHeightValue()}</Text>
          <View style={styles.rulerContainer}>
            <Animated.FlatList
              ref={flatListRef}
              data={unit === 'in' ? inchesData : feetData}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: (width - ITEM_WIDTH) / 2.5,
              }}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={onScroll}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
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

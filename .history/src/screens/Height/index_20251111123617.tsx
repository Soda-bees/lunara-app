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
const ITEM_WIDTH = 40; // slightly larger for better scrolling
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type RouteProps = RouteProp<RootStackParamList, 'Weight'>;

const Height = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [unit, setUnit] = useState<'ft' | 'in'>('in');
  const [selectedValue, setSelectedValue] = useState(68); // default 68 inches (~5'8")
  const [isToggling, setIsToggling] = useState(false);

  const flatListFeetRef = useRef<FlatList>(null);
  const flatListInchesRef = useRef<FlatList>(null);
  const [selectedFeet, setSelectedFeet] = useState(5); // default 5 ft
  const [selectedInches, setSelectedInches] = useState(8); // default 8 in

  const feetData = Array.from({ length: 8 }, (_, i) => i); // 0-7 ft
  const inchesData = Array.from({ length: 12 }, (_, i) => i); // 0-11 in

  const onScrollFeet = Animated.event(
    [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const value = Math.round(
          event.nativeEvent.contentOffset.x / ITEM_WIDTH,
        );
        if (value !== selectedFeet) {
          Vibration.vibrate(10);
          setSelectedFeet(value);
        }
      },
    },
  );

  const onScrollInches = Animated.event(
    [{ nativeEvent: { contentOffset: { x: new Animated.Value(0) } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const value = Math.round(
          event.nativeEvent.contentOffset.x / ITEM_WIDTH,
        );
        if (value !== selectedInches) {
          Vibration.vibrate(10);
          setSelectedInches(value);
        }
      },
    },
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <View style={styles.tickContainer}>
        <Text style={styles.tickLabel}>{item}</Text>
        <View style={styles.tick} />
      </View>
    ),
    [],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const handleContinue = () => {
    const totalInches = selectedFeet * 12 + selectedInches;
    console.log(
      `Selected height: ${selectedFeet}' ${selectedInches}" (${totalInches} inches)`,
    );
    // send totalInches to backend or store locally
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
      <BackButton />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>How tall are you?</Text>
          <Text style={styles.paraText}>
            We use your height to help personalize your health insights.
          </Text>
        </View>

        <View style={styles.numberSLiderContainer}>
          <Text
            style={styles.value}
          >{`${selectedFeet}' ${selectedInches}"`}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Animated.FlatList
              ref={flatListFeetRef}
              data={feetData}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={onScrollFeet}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
              contentContainerStyle={{
                paddingHorizontal: (width - ITEM_WIDTH) / 2,
              }}
            />

            <Animated.FlatList
              ref={flatListInchesRef}
              data={inchesData}
              renderItem={renderItem}
              keyExtractor={item => item.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={onScrollInches}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
              contentContainerStyle={{
                paddingHorizontal: (width - ITEM_WIDTH) / 2,
              }}
            />
          </View>
        </View>

        {/* <View style={styles.numberSLiderContainer}>
          <View style={styles.heightView}>
            <Text style={styles.label}>Height ( {unit} )</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={unit === 'ft' ? styles.btnSelected : styles.btn}
                onPress={() => unit !== 'ft' && handleUnitToggle()}
              >
                <Text style={styles.btnText}>ft</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={unit === 'in' ? styles.btnSelected : styles.btn}
                onPress={() => unit !== 'in' && handleUnitToggle()}
              >
                <Text style={styles.btnText}>in</Text>
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
                paddingHorizontal: (width - ITEM_WIDTH) / 2,
              }}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              onScroll={onScroll}
              scrollEventThrottle={16}
              getItemLayout={getItemLayout}
            />
          </View>
        </View> */}

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Height;

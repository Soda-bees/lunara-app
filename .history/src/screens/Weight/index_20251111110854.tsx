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

const Weight = () => {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProps>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [unit, setUnit] = useState<'kg' | 'lb'>('lb');
  const [selectedValue, setSelectedValue] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [isToggling, setIsToggling] = useState(false);

  console.log('jdfhdfjdhfjdf', selectedValue);

  const getWeightInKg = (value: number, unit: 'kg' | 'lb') => {
    return unit === 'lb' ? parseFloat((value * 0.453592).toFixed(1)) : value;
  };

  const [finalWeightKg, setFinalWeightKg] = useState(
    getWeightInKg(selectedValue, unit),
  );

  useEffect(() => {
    const kgValue = getWeightInKg(selectedValue, unit);
    setFinalWeightKg(kgValue);
  }, [selectedValue, unit]);

  const handleUnitToggle = () => {
    setIsToggling(true);

    const newUnit = unit === 'kg' ? 'lb' : 'kg';

    const newValue =
      newUnit === 'kg'
        ? Math.round(selectedValue * 0.453592)
        : Math.round(finalWeightKg / 0.453592);

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

  const kgData = Array.from({ length: 201 + VISIBLE_ITEMS }, (_, i) => i);
  const lbData = Array.from({ length: 441 + VISIBLE_ITEMS }, (_, i) => i);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        if (isToggling) return;
        const x = event.nativeEvent.contentOffset.x;
        const value = Math.round(x / ITEM_WIDTH);

        setSelectedValue(prev => {
          if (prev !== value) {
            Vibration.vibrate(10);
          }
          return value;
        });
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

  const renderWeightValue = () => {
    return (
      <Text style={styles.value}>
        {selectedValue}
        <Text style={styles.unit}> {unit === 'kg' ? 'Kg' : 'Lb'}</Text>
      </Text>
    );
  };

  const handleContinue = () => {
    // if (Number(selectedValue) >= 50) {
    //   const updatedUserData = {
    //     ...userData,
    //     weight: selectedValue,
    //   };
    //   console.log(selectedValue);
    //   navigation.navigate('Height', {userData: updatedUserData});
    // } else {
    // }
  };

  return (
    <SafeAreaView
      style={styles.mainContainer}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <View style={styles.mainContainer}>
        <Text style={styles.heading}>What's Your Weight?</Text>
        <Text style={styles.disabledText}>
          Your weight helps us personalize nutrition and{'\n'}fitness
          suggestions.
        </Text>

        <View style={styles.container}>
          <View style={styles.heightView}>
            <Text style={styles.label}>Weight (In Lb)</Text>
            <View style={styles.unitToggle}>
              {/* <TouchableOpacity onPress={handleUnitToggle} activeOpacity={0.9}>
                {unit === 'kg' ? (
                  <LinearGradient
                    colors={['#FA71AA', '#B687E9']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                    style={[styles.toggleButton, styles.activeToggle]}>
                    <Text style={styles.activeText}>Kg</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.toggleButton}>
                    <Text style={styles.inactiveText}>Kg</Text>
                  </View>
                )}
              </TouchableOpacity> */}

              <View>
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
          </View>
          <Text style={styles.value}>{renderWeightValue()}</Text>
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
            {/* <View style={styles.centerLine} /> */}
          </View>
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Weight;

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

const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 7;
const data = Array.from({ length: 7 }, (_, i) => (i + 1).toString());

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type RouteProps = RouteProp<RootStackParamList, 'Weight'>;

export default function PeriodDuration() {
  const navigation = useNavigation<NavigationProp>();
  const listRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(data[4]);

  const route = useRoute<RouteProps>();

  const onMomentumScrollEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const value = data[index];

    if (value !== selectedValue) {
      Vibration.vibrate(10); // ✅ short vibration on change
      setSelectedValue(value);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      (listRef.current as any).scrollToOffset({
        offset: ITEM_HEIGHT * 3,
        animated: false,
      });
    }
  }, []);

  console.log('selectedValue', selectedValue);

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
          <View style={styles.centerHighlight} pointerEvents="none" />
          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            bounces={false}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(data, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
            contentContainerStyle={{
              paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
            }}
            renderItem={({ item }) => {
              const isSelected = item === selectedValue;
              return (
                <View style={styles.item}>
                  {isSelected ? (
                    <View style={styles.selectedWrapper}>
                      <Text style={styles.selectedText}>{item}</Text>
                      <Text style={styles.daysLabel}>Days</Text>
                    </View>
                  ) : (
                    <Text style={styles.itemText}>{item}</Text>
                  )}
                </View>
              );
            }}
          />
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}

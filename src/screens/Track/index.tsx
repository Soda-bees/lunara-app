import React, { JSX, useState } from 'react';
import { StatusBar, Text, View, ScrollView } from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { CategoryButton } from '../../components/CategoryButton';
import images from '../../constants/images';
import Nutrition from '../../components/Nutrition';
import Movement from '../../components/Moverment';
import Mindful from '../../components/Mindful';

type Category = 'Nutrition' | 'Movement' | 'Mindful';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Track() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('Nutrition');

  const handlePress = async () => {
    navigation.navigate('GetToKnow');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <View style={styles.mainContainer}>
        <Text style={styles.forgotText}>Track Your Day</Text>
        <Text style={styles.paraText}>
          Log nutrition, movement, and mindfulness in one place
        </Text>

        <View style={styles.categoryContainer}>
          <CategoryButton
            icon={images.nutritionsIcon}
            label="Nutrition"
            isActive={selectedCategory === 'Nutrition'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            icon={images.trackMovementIcon}
            label="Movement"
            isActive={selectedCategory === 'Movement'}
            onPress={setSelectedCategory}
          />
          {/* <CategoryButton
            icon={images.mindfulIcon}
            label="Mindful"
            isActive={selectedCategory === 'Mindful'}
            onPress={setSelectedCategory}
          /> */}
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          {selectedCategory === 'Nutrition' ? (
            <Nutrition />
          ) : selectedCategory === 'Movement' ? (
            <Movement />
          ) : selectedCategory === 'Mindful' ? (
            <Mindful />
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

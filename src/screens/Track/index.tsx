// import React, { JSX, useState } from 'react';
// import { StatusBar, Text, View } from 'react-native';
// import styles from './style';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { RootStackParamList } from '../../navigation/stackNavigation';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useNavigation } from '@react-navigation/native';
// import Header from '../../components/Header';
// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

// export default function Track() {
//   const navigation = useNavigation<NavigationProp>();
//   // const [category, setCategory] = useState('');

//   const handlePress = async () => {
//     navigation.navigate('GetToKnow');
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="dark-content"
//       />
//       <Header />
//       <View style={styles.mainContainer}>
//         <Text style={styles.forgotText}>Track Your Day</Text>
//         <Text style={styles.paraText}>
//           Log nutrition, movement, and mindfulness in one place
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// }

import React, { JSX, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import styles from './style'; // Assuming 'style.ts' contains the necessary styles
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import { CategoryButton } from '../../components/CategoryButton';

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
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
            icon="🍴"
            label="Nutrition"
            isActive={selectedCategory === 'Nutrition'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            icon="⚡"
            label="Movement"
            isActive={selectedCategory === 'Movement'}
            onPress={setSelectedCategory}
          />
          <CategoryButton
            icon="🧘"
            label="Mindful"
            isActive={selectedCategory === 'Mindful'}
            onPress={setSelectedCategory}
          />
        </View>

        {/* You would add content here based on the selectedCategory */}
        {/* <Text style={{ marginTop: 20 }}>Content for: {selectedCategory}</Text> */}
      </View>
    </SafeAreaView>
  );
}

// NOTE: You'll need to define the corresponding styles in your './style.ts' file
// to match the visual appearance from the image.

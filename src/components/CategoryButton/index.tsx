// import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { colors } from '../../constants/colors';

// type Category = 'Nutrition' | 'Movement' | 'Mindful';

// interface CategoryButtonProps {
//   icon: any;
//   label: Category;
//   isActive: boolean;
//   onPress: (category: Category) => void;
// }

// export const CategoryButton: React.FC<CategoryButtonProps> = ({
//   icon,
//   label,
//   isActive,
//   onPress,
// }) => (
//   <TouchableOpacity
//     style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
//     onPress={() => onPress(label)}
//   >
//     <Image
//       source={icon}
//       style={[styles.categoryIcon, isActive && styles.activeCategoryIconActive]}
//     />
//     <Text style={[styles.categoryLabel, isActive && styles.activeCategoryText]}>
//       {label}
//     </Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   categoryButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     borderRadius: 30,
//     backgroundColor: 'transparent',
//   },

//   activeCategoryButton: {
//     backgroundColor: '#FFFFFF',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//     paddingVertical: 8,
//     borderRadius: 15,
//   },

//   categoryIcon: {
//     width: 17,
//     height: 17,
//     marginRight: 4,
//     resizeMode: 'contain',
//   },

//   categoryLabel: {
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//     color: colors.green,
//     marginLeft:2
//   },

//   activeCategoryText: {
//     color: colors.black,
//     fontSize: 12,
//     fontFamily: 'Inter-SemiBold',
//   },

//   activeCategoryIconActive: {
//     tintColor: colors.black,
//     width: 17,
//     height: 17,
//     marginRight: 4,
//     resizeMode: 'contain',
//   },
// });

import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

interface CategoryButtonProps {
  icon?: any; // Optional!
  label: string; // Allow ANY string, not a union
  isActive: boolean;
  onPress: (category: any) => void;
}

export const CategoryButton: React.FC<CategoryButtonProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.categoryButton, isActive && styles.activeCategoryButton]}
    onPress={() => onPress(label)}
  >
    {icon && (
      <Image
        source={icon}
        style={[styles.categoryIcon, isActive && styles.activeCategoryIconActive]}
      />
    )}

    <Text
      style={[styles.categoryLabel, isActive && styles.activeCategoryText]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },

  activeCategoryButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    paddingVertical: 8,
    borderRadius: 15,
  },

  categoryIcon: {
    width: 17,
    height: 17,
    marginRight: 4,
    resizeMode: 'contain',
  },

  categoryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.green,
    marginLeft: 2,
  },

  activeCategoryText: {
    color: colors.black,
  },

  activeCategoryIconActive: {
    tintColor: colors.black,
    width: 17,
    height: 17,
    marginRight: 4,
    resizeMode: 'contain',
  },
});


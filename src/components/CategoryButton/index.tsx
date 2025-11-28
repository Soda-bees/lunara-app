import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Category = 'Nutrition' | 'Movement' | 'Mindful';

interface CategoryButtonProps {
  icon: string;
  label: Category;
  isActive: boolean;
  onPress: (category: Category) => void;
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
    <Text style={[styles.categoryIcon, isActive && styles.activeCategoryText]}>
      {icon}
    </Text>
    <Text style={[styles.categoryLabel, isActive && styles.activeCategoryText]}>
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
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },

  activeCategoryButton: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },

  categoryIcon: {
    fontSize: 18,
    marginRight: 4,
    color: '#388E3C',
  },

  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#388E3C',
  },

  activeCategoryText: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface Option {
  label: string;
  icon?: any;
}

interface Props {
  title: string;
  icon?: any;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function OptionGroup({
  title,
  icon,
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Heading */}
      <View style={styles.headingRow}>
        {icon && <Image source={icon} style={styles.headingIcon} />}
        <Text style={styles.headingText}>{title}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map(opt => {
          const isSelected = selected === opt.label;
          return (
            <TouchableOpacity
              key={opt.label}
              style={[styles.optionButton, isSelected && styles.optionSelected]}
              onPress={() => onSelect(opt.label)}
            >
              {opt.icon && (
                <Image source={opt.icon} style={styles.optionIcon} />
              )}
              <Text
                style={[
                  styles.optionLabel,
                  isSelected && styles.optionLabelSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 28,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  headingIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.black,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  optionSelected: {
    borderColor: colors.heading,
    backgroundColor: colors.headingLight,
  },
  optionIcon: {
    width: 24,
    height: 24,
    marginBottom: 2,
    resizeMode: 'contain',
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 132
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: colors.primary,
  },
});

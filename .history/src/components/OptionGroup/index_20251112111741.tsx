import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';

interface Option {
  label: string;
  icon?: string;
}

interface Props {
  title: string;
  options: Option[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export default function OptionGroup({
  title,
  options,
  selected,
  onSelect,
}: Props) {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#222',
          marginBottom: 12,
        }}
      >
        {title}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {options.map(opt => {
          const isSelected = selected === opt.label;
          return (
            <TouchableOpacity
              key={opt.label}
              style={{
                borderWidth: 1.5,
                borderColor: isSelected ? colors.primary : '#ddd',
                backgroundColor: isSelected ? '#fff5f8' : '#fff',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => onSelect(opt.label)}
            >
              <Text style={{ fontSize: 20, marginRight: 6 }}>{opt.icon}</Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: isSelected ? colors.primary : '#444',
                }}
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

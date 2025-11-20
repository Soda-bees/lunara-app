import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../constants/colors';

interface Option {
  label: string;
  icon?: any; // since images are require()d
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
    <View style={{ marginBottom: 28 }}>
      {/* Heading */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
          gap: 6,
        }}
      >
        {icon && (
          <Image
            source={icon}
            style={{ width: 18, height: 18, resizeMode: 'contain' }}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#222',
          }}
        >
          {title}
        </Text>
      </View>

      {/* Options */}
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
                paddingVertical: 10,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: 80,
              }}
              onPress={() => onSelect(opt.label)}
            >
              {opt.icon && (
                <Image
                  source={opt.icon}
                  style={{
                    width: 30,
                    height: 30,
                    marginBottom: 6,
                    resizeMode: 'contain',
                  }}
                />
              )}
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: isSelected ? colors.primary : '#444',
                  textAlign: 'center',
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

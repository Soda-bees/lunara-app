import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Image source={images.bottomArrow} style={styles.backIcon} />
      </TouchableOpacity>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.rightContainer}>
        {showSkip && (
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        {imagesRight.length > 0 &&
          imagesRight.map((imgSrc, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onImagePress?.(index)}
              style={styles.imageButton}
            >
              <Image source={imgSrc} style={styles.rightImage} />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'space-between',
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    marginBottom: 16,
  },

  backIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
  },
});
export default BackButton;

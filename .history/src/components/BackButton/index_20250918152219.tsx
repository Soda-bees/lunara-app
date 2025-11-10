import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import images from '../../services/utilities/images';
import {colors, fontSize, sizes} from '../../services/utilities';
type Props = {
  title?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  imagesRight?: ImageSourcePropType[];
  onImagePress?: (index: number) => void;
};
const BackButton = ({
  title,
  showSkip = false,
  onSkip,
  imagesRight = [],
  onImagePress,
}: Props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
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
              style={styles.imageButton}>
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
  backButton: {
    padding: 13,
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    zIndex: 2,
  },
  backIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
  },
  title: {
    fontFamily: 'HBG-Medium',
    position: 'absolute',
    left: 0,
    right: 5,
    bottom: 5,
    textAlign: 'center',
    fontSize: 22,
    color: colors.black,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.05,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    marginLeft: 8,
  },
  skipText: {
    color: colors.pink,
    fontSize: fontSize.medium,
    fontWeight: '500',
  },
  imageButton: {
    width: sizes.screenWidth * 0.11,
    height: sizes.screenWidth * 0.11,
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: colors.white,
    backgroundColor: colors.white,
    marginHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
export default BackButton;

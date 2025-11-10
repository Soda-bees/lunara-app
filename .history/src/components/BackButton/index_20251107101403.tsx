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
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={images.backIcon} style={styles.backIcon} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    marginBottom: 16,
  },

  backIcon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
});
export default BackButton;
